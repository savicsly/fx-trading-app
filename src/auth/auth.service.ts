import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as sgMail from '@sendgrid/mail';
import * as bcrypt from 'bcrypt';
import { OtpService } from 'src/otps/otp.service';
import { UtilityService } from 'src/shared/utility/utility.service';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  private sendGridApiKey: string;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private utilityService: UtilityService,
    private otpService: OtpService,
    private configService: ConfigService,
  ) {
    this.sendGridApiKey = configService.getOrThrow<string>('SENDGRID_API_KEY');
  }

  async signIn(data: SignInDto, ip: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(data.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerifiedAt === null) {
      throw new UnauthorizedException('Email not verified');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    await this.utilityService.logUserLogin(user, ip);

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(data: SignUpDto): Promise<any> {
    const existingUser = await this.usersService.findOneByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    const hashedPassword: string = await bcrypt.hash(data.password, 10);

    try {
      const user = await this.usersService.createUser({
        ...data,
        password: hashedPassword,
      });

      const otp = await this.otpService.createOtp(user);

      if (!otp) {
        throw new BadRequestException('Failed to create OTP');
      }

      sgMail.setApiKey(this.sendGridApiKey);
      const msg = {
        to: user.email, // Change to your recipient
        from: 'victor@etechdynamics.com', // Change to your verified sender
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp.code}. It will expire in 5 minutes.`,
        html: `<strong>Your OTP code is ${otp.code}. It will expire in 5 minutes.</strong>`,
      };

      try {
        await sgMail.send(msg);
        console.log(`OTP email sent to ${user.email}`);
      } catch (error) {
        console.error(`Failed to send OTP email to ${user.email}:`, error);
      }

      console.log(`User registered successfully: ${user.email}`);
      return {
        message: 'User registered successfully',
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
        },
      };
    } catch (error) {
      console.error('Error during user registration:', error);
      throw new BadRequestException('Failed to register user');
    }
  }

  async verifyEmail(data: { code: number }): Promise<any> {
    if (!data.code) {
      throw new BadRequestException('Verification token is required');
    }

    try {
      const otpData = await this.otpService.validateOtp(data.code);

      if (!otpData) {
        throw new NotFoundException('Invalid or expired token');
      }

      if (otpData && otpData.userId) {
        await this.usersService.updateEmailVerifiedAt(Number(otpData.userId));
        console.log(`Email verified for user ID: ${otpData.userId}`);
      } else {
        throw new UnauthorizedException('Invalid or expired token');
      }
    } catch (error) {
      console.error('Error during email verification:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }

    return {
      message: 'Email verified successfully',
    };
  }
}
