import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OtpModule } from './otps/otp.module';
import { OtpService } from './otps/otp.service';
import { UtilityService } from './shared/utility/utility.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
  controllers: [AppController],
  providers: [AppService, UtilityService, OtpService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
