import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpModule } from 'src/otps/otp.module'; // Import OtpModule
import { UtilityService } from 'src/shared/utility/utility.service';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { WalletModule } from 'src/wallets/wallet.module'; // Import WalletModule
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), // Register Passport with 'jwt' strategy
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    TypeOrmModule.forFeature([User]),
    WalletModule, // Import WalletModule to make WalletService available
    OtpModule,
    UsersModule, // Import UsersModule to make UsersService available
  ],
  providers: [AuthService, UsersService, UtilityService, JwtStrategy], // Provide JwtStrategy and HeaderApiKeyStrategy
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
