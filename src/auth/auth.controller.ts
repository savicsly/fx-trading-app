import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicResource } from 'src/shared/decorator/public-resource.decorator';
import { AuthService } from './auth.service';
import { SignInDto, SignInResponse } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@ApiBearerAuth()
@ApiTags('auth')
// @ApiResponse({
//   status: HttpStatus.UNAUTHORIZED,
//   description: 'Unauthorized',
// })
// @UseGuards(AuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicResource()
  @HttpCode(HttpStatus.OK)
  @Post('login')
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
  signUp(@Body() registerDTO: SignUpDto) {
    return this.authService.signUp(registerDTO);
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('refresh')
  // refreshToken(@Body() refreshTokenDTO: Record<string, any>) {
  //   return this.authService.refreshToken(refreshTokenDTO);
  // }

  // @HttpCode(HttpStatus.OK)
  // @Post('logout')
  // logout(@Body() logoutDTO: Record<string, any>) {
  //   return this.authService.logout(logoutDTO);
  // }

  @HttpCode(HttpStatus.OK)
  @Post('verify')
  async verifyEmail(@Body() data: VerifyEmailDto) {
    return this.authService.verifyEmail(data);
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('forgot-password')
  // forgotPassword(@Body() forgotPasswordDTO: Record<string, any>) {
  //   return this.authService.forgotPassword(forgotPasswordDTO);
  // }

  // @HttpCode(HttpStatus.OK)
  // @Post('reset-password')
  // resetPassword(@Body() resetPasswordDTO: Record<string, any>) {
  //   return this.authService.resetPassword(resetPasswordDTO);
  // }
}
