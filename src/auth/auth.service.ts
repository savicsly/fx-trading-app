import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(data: SignInDto): Promise<{ access_token: string }> {
    // Use extracted validation

    const user = await this.usersService.findOneByEmail(data.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(data: SignUpDto): Promise<{
    message: string;
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    };
  }> {
    const existingUser = await this.usersService.findOneByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    const hashedPassword: string = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.createUser({
      ...data,
      password: hashedPassword,
    });

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
  }
}
