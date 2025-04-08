import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilityService } from 'src/shared/utility/utility.service';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';
import { Otp } from './otp.entity';
import { OtpService } from './otp.service';

@Module({
  imports: [TypeOrmModule.forFeature([Otp, User]), UsersModule],
  providers: [OtpService, UtilityService],
  exports: [OtpService, TypeOrmModule],
})
export class OtpModule {}
