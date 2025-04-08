import { RedisModule } from '@nestjs-modules/ioredis';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnalyticsService } from 'src/shared/analytics/analytics.service';
import { TransactionService } from 'src/transactions/transaction.service';
import { DataSource, Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { WalletService } from './wallet.service';

describe('WalletService', () => {
  let walletService: WalletService;
  let walletRepository: Repository<Wallet>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot(),
        RedisModule.forRoot({ type: 'single', url: 'redis://localhost:6379' }),
      ],
      providers: [
        WalletService,
        TransactionService,
        AnalyticsService,
        {
          provide: getRepositoryToken(Wallet),
          useClass: Repository,
        },
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    walletService = module.get<WalletService>(WalletService);
    walletRepository = module.get<Repository<Wallet>>(
      getRepositoryToken(Wallet),
    );
  });

  describe('getWalletBalances', () => {
    it('should return wallet balances', async () => {
      const userId = 1;
      const mockWallet = {
        id: 1,
        balances: { NGN: 5000, USD: 100 },
      };
      jest
        .spyOn(walletRepository, 'findOne')
        .mockResolvedValue(mockWallet as Wallet);

      const balances = await walletService.getWalletBalances(userId);
      expect(balances).toEqual(mockWallet.balances);
    });

    it('should throw NotFoundException if wallet is not found', async () => {
      const userId = 1;
      jest.spyOn(walletRepository, 'findOne').mockResolvedValue(null);

      await expect(walletService.getWalletBalances(userId)).rejects.toThrow(
        'Wallet not found',
      );
    });
  });

  describe('convertCurrency', () => {
    it('should convert currency and update balances', async () => {
      const userId = 1;
      const mockWallet = {
        id: 1,
        balances: { NGN: 5000, USD: 0 },
        user: { id: userId },
      };
      const mockRates = { USD: 0.002 };
      const convertData = {
        baseCurrency: 'NGN',
        targetCurrency: 'USD',
        amount: 1000,
      };

      jest
        .spyOn(walletRepository, 'findOne')
        .mockResolvedValue(mockWallet as Wallet);
      jest
        .spyOn(walletService, 'getExchangeRates')
        .mockResolvedValue(mockRates);
      jest
        .spyOn(walletRepository, 'save')
        .mockImplementation(async (wallet) => {
          wallet.balances.NGN -= convertData.amount;
          wallet.balances.USD += convertData.amount * mockRates.USD;
          return wallet;
        });

      const balances = await walletService.convertCurrency(convertData, userId);
      expect(balances).toEqual({ NGN: 4000, USD: 2 });
    });

    it('should throw BadRequestException if insufficient balance', async () => {
      const userId = 1;
      const mockWallet = {
        id: 1,
        balances: { NGN: 500 },
        user: { id: userId },
      };
      const convertData = {
        baseCurrency: 'NGN',
        targetCurrency: 'USD',
        amount: 1000,
      };

      jest
        .spyOn(walletRepository, 'findOne')
        .mockResolvedValue(mockWallet as Wallet);

      await expect(
        walletService.convertCurrency(convertData, userId),
      ).rejects.toThrow('Insufficient balance');
    });
  });

  describe('processCurrencyTransaction', () => {
    it('should handle transactions atomically', async () => {
      const userId = 1;
      const mockWallet = {
        balances: { NGN: 5000, USD: 0 },
        user: { id: userId },
      };
      const mockRates = { USD: 0.002 };
      const transactionData = {
        baseCurrency: 'NGN',
        targetCurrency: 'USD',
        amount: 1000,
      };

      jest
        .spyOn(walletRepository, 'findOne')
        .mockResolvedValue(mockWallet as Wallet);
      jest
        .spyOn(walletService, 'getExchangeRates')
        .mockResolvedValue(mockRates);
      jest
        .spyOn(walletRepository, 'save')
        .mockImplementation(async (wallet) => {
          wallet.balances.NGN -= transactionData.amount;
          wallet.balances.USD += transactionData.amount * mockRates.USD;
          return wallet;
        });

      const balances = await walletService['processCurrencyTransaction'](
        transactionData,
        userId,
        'convert',
      );
      expect(balances).toEqual({ NGN: 4000, USD: 2 });
    });
  });
});
