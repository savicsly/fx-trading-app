import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from 'src/otps/otp.entity';
import { OtpService } from 'src/otps/otp.service';
import { UtilityService } from 'src/shared/utility/utility.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Otp])],
  providers: [UsersService, OtpService, UtilityService],
  exports: [UsersService],
})
export class UsersModule {}
