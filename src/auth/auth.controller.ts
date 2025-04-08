import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PublicResource } from 'src/shared/decorator/public-resource.decorator';
import { AuthService } from './auth.service';
import { SignInDto, SignInResponse } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@ApiBearerAuth()
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
    const response = this.authService.signIn(loginDTO, ip);
    return response;
  }

  @PublicResource()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  signUp(@Body() registerDTO: SignUpDto) {
    return this.authService.signUp(registerDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify')
  @ApiOperation({ summary: 'Verify user email' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  async verifyEmail(@Body() data: VerifyEmailDto) {
    return this.authService.verifyEmail(data);
  }
}
