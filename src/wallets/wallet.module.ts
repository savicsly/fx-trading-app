import { RedisModule } from '@nestjs-modules/ioredis';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsModule } from 'src/shared/analytics/analytics.module';
import { UtilityService } from 'src/shared/utils/utility.service';
import { TransactionModule } from 'src/transactions/transaction.module';
import { WalletController } from './wallet.controller';
import { Wallet } from './wallet.entity';
import { WalletService } from './wallet.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    HttpModule.register({}), // Ensure HttpModule is registered
    ConfigModule,
    TransactionModule, // Ensure TransactionModule is imported
    AnalyticsModule, // Ensure AnalyticsModule is imported
    RedisModule,
  ],
  providers: [WalletService, ConfigService, UtilityService], // Remove AnalyticsService from providers as it is provided by AnalyticsModule
  controllers: [WalletController],
  exports: [WalletService, TypeOrmModule],
})
export class WalletModule {}
