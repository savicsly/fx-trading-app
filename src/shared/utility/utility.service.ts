import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UtilityService {
  constructor(private readonly usersService: UsersService) {}

  generateOtp(): Promise<number> {
    const code = Math.floor(100000 + Math.random() * 900000);
    return Promise.resolve(code);
  }

  async verifyOtp(otp: number): Promise<boolean> {
    // Simulate OTP verification logic
    const isValid = otp === 123456; // Replace with actual OTP verification logic
    return Promise.resolve(isValid);
  }

  async logUserLogin(user: { id: number }, ip: string): Promise<void> {
    const { id } = user;
    await this.usersService.update(id, {
      lastLoginAt: new Date(),
      lastLoginIp: ip,
    });
  }
}
