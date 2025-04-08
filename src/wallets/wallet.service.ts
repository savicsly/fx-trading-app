import { InjectRedis } from '@nestjs-modules/ioredis';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { lastValueFrom } from 'rxjs';
import { AnalyticsService } from 'src/shared/analytics/analytics.service';
import { UtilityService } from 'src/shared/utils/utility.service';
import { TransactionService } from 'src/transactions/transaction.service';
import { User } from 'src/users/user.entity';
import { DataSource, Repository } from 'typeorm';
import { convertCurrencyDto } from './dto/convert-currency.dto';
import { fundWalletDto } from './dto/fund-wallet.dto';
import { Wallet } from './wallet.entity';

@Injectable()
export class WalletService {
  private currencyApiUrl: string;
  private currencyApiKey: string;

  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private readonly httpService: HttpService,
    private configService: ConfigService,
    private transactionService: TransactionService,
    private analyticsService: AnalyticsService,
    private readonly dataSource: DataSource,
    @InjectRedis() private readonly redisClient: Redis,
    private readonly utilityService: UtilityService,
  ) {
    this.currencyApiUrl =
      this.configService.getOrThrow<string>('OPEN_EXCHANGE_URL');
    this.currencyApiKey = this.configService.getOrThrow<string>(
      'OPEN_EXCHANGE_API_KEY',
    );
  }

  async createWallet(user: User): Promise<Wallet> {
    const wallet = this.walletRepository.create({
      user,
      balances: { NGN: 5000 },
    });
    return this.walletRepository.save(wallet);
  }

  async getWalletBalances(userId: number): Promise<Record<string, number>> {
    const wallet = await this.walletRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Return only the balances
    return wallet.balances;
  }

  async fundWallet(
    data: fundWalletDto,
    userId: number,
  ): Promise<Record<string, number>> {
    const wallet = await this.walletRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    wallet.balances[data.currency] =
      (wallet.balances[data.currency] || 0) + data.amount;

    // Record the transaction
    await this.transactionService.recordTransaction({
      userId: wallet.user.id,
      type: 'fund',
      currency: data.currency,
      amount: data.amount,
      status: 'success',
    });

    await this.walletRepository.save(wallet);
    console.log(
      `Wallet funded: User ID ${userId}, Currency ${data.currency}, Amount ${data.amount}`,
    );

    // Log analytics
    await this.analyticsService.logUserActivity(
      userId,
      `Funded wallet with ${data.amount} ${data.currency}`,
    );

    // Return only the balances
    return wallet.balances;
  }

  async getExchangeRates(
    baseCurrency: string = 'USD',
    targetCurrency?: string,
  ): Promise<Record<string, number> | number> {
    return this.utilityService.fetchExchangeRates(baseCurrency, targetCurrency);
  }

  private async processCurrencyTransaction(
    data: convertCurrencyDto,
    userId: number,
    transactionType: 'convert' | 'trade',
  ): Promise<Record<string, number>> {
    return this.dataSource.transaction(async (manager) => {
      const wallet = await manager.findOne(Wallet, {
        where: { user: { id: userId } },
        relations: ['user'],
      });

      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }

      const sourceBalance = wallet.balances[data.baseCurrency];
      if (!sourceBalance || sourceBalance < data.amount) {
        throw new BadRequestException('Insufficient balance');
      }

      const exchangeRates = await this.getExchangeRates(
        data.baseCurrency,
        data.targetCurrency,
      );

      if (typeof exchangeRates !== 'number') {
        throw new NotFoundException('Conversion rate not found');
      }

      const conversionRate: number = exchangeRates;

      if (!conversionRate) {
        throw new NotFoundException('Conversion rate not found');
      }

      const convertedAmount = data.amount * conversionRate;

      wallet.balances[data.baseCurrency] -= data.amount;
      wallet.balances[data.targetCurrency] =
        (wallet.balances[data.targetCurrency] || 0) + convertedAmount;

      await manager.save(wallet);
      await this.transactionService.recordTransaction({
        userId: wallet.user.id,
        type: transactionType,
        currency: data.baseCurrency,
        amount: data.amount,
        rate: conversionRate,
        convertedAmount,
        targetCurrency: data.targetCurrency,
        status: 'success',
      });

      // Log analytics
      await this.analyticsService.logTrade(
        userId,
        data.baseCurrency,
        data.targetCurrency,
        data.amount,
        conversionRate,
      );

      return wallet.balances;
    });
  }

  async convertCurrency(
    data: convertCurrencyDto,
    userId: number,
  ): Promise<Record<string, number>> {
    return this.processCurrencyTransaction(data, userId, 'convert');
  }

  async tradeCurrency(
    data: convertCurrencyDto,
    userId: number,
  ): Promise<Record<string, number>> {
    return this.processCurrencyTransaction(data, userId, 'trade');
  }

  private async initiateFlutterwavePayment(
    amount: number,
    userId: number,
  ): Promise<{ data: { link: string } }> {
    const flutterwaveUrl =
      this.configService.getOrThrow<string>('FLUTTERWAVE_URL');
    const flutterwaveApiKey = this.configService.getOrThrow<string>(
      'FLUTTERWAVE_API_KEY',
    );

    const payload = {
      tx_ref: `tx-${userId}-${Date.now()}`,
      amount,
      currency: 'NGN',
      redirect_url: 'https://your-redirect-url.com',
      customer: {
        id: userId,
        email: `user${userId}@example.com`,
      },
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(flutterwaveUrl, payload, {
          headers: {
            Authorization: `Bearer ${flutterwaveApiKey}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      if (response.status !== HttpStatus.OK.valueOf()) {
        throw new HttpException(
          'Failed to initiate payment',
          HttpStatus.BAD_REQUEST,
        );
      }

      return response.data;
    } catch (error) {
      console.error('Flutterwave payment initiation failed:', error);
      throw new HttpException(
        'Payment initiation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fundWalletViaFlutterwave(
    data: fundWalletDto,
    userId: number,
  ): Promise<{ paymentLink: string }> {
    if (data.currency !== 'NGN') {
      throw new BadRequestException('Only NGN wallet can be funded directly.');
    }

    const paymentResponse: { data: { link: string } } =
      await this.initiateFlutterwavePayment(data.amount, userId);

    // Return the payment link to the client
    return { paymentLink: paymentResponse.data.link };
  }

  async handleFlutterwaveWebhook(payload: any): Promise<void> {
    const { tx_ref, status, amount, currency } = payload;

    if (status !== 'successful' || currency !== 'NGN') {
      console.error('Invalid or failed transaction:', payload);
      throw new BadRequestException('Invalid or failed transaction');
    }

    const userId = parseInt(tx_ref.split('-')[1], 10); // Extract userId from tx_ref
    const wallet = await this.walletRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    wallet.balances['NGN'] = (wallet.balances['NGN'] || 0) + amount;

    // Record the transaction
    await this.transactionService.recordTransaction({
      userId,
      type: 'fund',
      currency: 'NGN',
      amount,
      status: 'success',
    });

    await this.walletRepository.save(wallet);

    console.log(
      `Wallet funded via Flutterwave: User ID ${userId}, Amount ${amount} NGN`,
    );
  }
}
