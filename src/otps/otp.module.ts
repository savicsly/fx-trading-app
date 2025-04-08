import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilityService } from 'src/shared/utility/utility.service';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';
import { Otp } from './otp.entity';
import { OtpService } from './otp.service';

@Module({
  imports: [TypeOrmModule.forFeature([Otp, User]), UsersModule], // Register Otp and User entities and import UsersModule
  providers: [OtpService, UtilityService], // Provide OtpService and UtilityService
  exports: [OtpService, TypeOrmModule], // Export OtpService and TypeOrmModule for use in other modules
})
export class OtpModule {}
