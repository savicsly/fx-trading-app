import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilityService } from 'src/shared/utility/utility.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Otp } from './otp.entity';
import { OtpService } from './otp.service';

@Module({
  imports: [TypeOrmModule.forFeature([Otp, User])], // Register Otp and User entities
  providers: [OtpService, UtilityService, UsersService], // Provide OtpService, UtilityService, and UsersService
  exports: [OtpService, TypeOrmModule], // Export OtpService and TypeOrmModule for use in other modules
})
export class OtpModule {}
