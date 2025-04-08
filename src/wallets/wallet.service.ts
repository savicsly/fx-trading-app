import { InjectRedis } from '@nestjs-modules/ioredis';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
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
  ) {}

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

    return wallet.balances;
  }

  async fundWallet(
    data: fundWalletDto,
    userId: number,
  ): Promise<Record<string, number>> {
    const wallet = await this.walletRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    wallet.balances[data.currency] =
      (wallet.balances[data.currency] || 0) + data.amount;

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

    await this.analyticsService.logUserActivity(
      userId,
      `Funded wallet with ${data.amount} ${data.currency}`,
    );

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
}
