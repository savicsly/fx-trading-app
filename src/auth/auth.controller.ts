import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthUserID } from 'src/shared/decorator/private-resource.decorator';
import { PublicResource } from 'src/shared/decorator/public-resource.decorator';
import { AuthService } from './auth.service';
import { SignInDto, SignInResponse } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@ApiBearerAuth() // Use the default Bearer token scheme
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicResource()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Authentication data',
    type: SignInResponse,
  })
  signIn(@Body() loginDTO: SignInDto, @Ip() ip: string) {
    return this.authService.signIn(loginDTO, ip);
  }

  @PublicResource()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  signUp(@Body() registerDTO: SignUpDto) {
    return this.authService.signUp(registerDTO);
  }

  @PublicResource()
  @HttpCode(HttpStatus.OK)
  @Post('verify')
  @ApiOperation({ summary: 'Verify user email' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  async verifyEmail(@Body() data: VerifyEmailDto) {
    return this.authService.verifyEmail(data);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  async logout(@AuthUserID() userId: number) {
    return this.authService.logout(userId);
  }

  @PublicResource()
  @HttpCode(HttpStatus.OK)
  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP for email verification' })
  @ApiResponse({ status: 200, description: 'New OTP sent successfully' })
  async resendOtp(@Query('email') email: string) {
    return this.authService.resendOtp(email);
  }
}
