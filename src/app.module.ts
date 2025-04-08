import { RedisModule } from '@nestjs-modules/ioredis';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FxModule } from './fx/fx.module';
import { OtpModule } from './otps/otp.module';
import { OtpService } from './otps/otp.service';
import { UtilityService } from './shared/utility/utility.service';
import { Utility } from './shared/utils/utility';
import { TransactionModule } from './transactions/transaction.module';
import { UsersModule } from './users/users.module';
import { WalletModule } from './wallets/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule.register({}), // Register HttpModule globally
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.getOrThrow<string>('REDIS_URL'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow<string>('DB_HOST', 'localhost'),
        port: configService.getOrThrow<number>('DB_PORT', 3306),
        username: configService.getOrThrow<string>('DB_USERNAME', 'root'),
        password: configService.getOrThrow<string>('DB_PASSWORD', ''),
        database: configService.getOrThrow<string>('DB_NAME', 'fx_trading_app'),
        autoLoadEntities: true,
        synchronize:
          configService.getOrThrow<string>('NODE_ENV') !== 'production'
            ? true
            : false,
      }),
    }),
    AuthModule,
    UsersModule,
    OtpModule,
    WalletModule,
    TransactionModule,
    FxModule,
  ],
  controllers: [AppController],
  providers: [AppService, UtilityService, OtpService, Utility],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
