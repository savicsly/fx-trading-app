import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilityService } from 'src/shared/utility/utility.service';
import { Repository } from 'typeorm';
import { Otp } from './otp.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
    private utilityService: UtilityService,
  ) {}

  async createOtp(user: { id: number }): Promise<Otp> {
    const code = await this.utilityService.generateOtp();

    const otpEntity = this.otpRepository.create({
      userId: Number(user.id),
      code: Number(code),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    return this.otpRepository.save(otpEntity);
  }

  async validateOtp(code: number): Promise<any> {
    const otpEntity = await this.otpRepository.findOne({
      where: { code },
    });

    if (!otpEntity || otpEntity.expiresAt < new Date()) {
      return false;
    }

    return otpEntity;
  }
}
