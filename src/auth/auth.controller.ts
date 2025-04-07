import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicResource } from 'src/shared/decorator/public-resource.decorator';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@ApiBearerAuth()
@ApiTags('auth')
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Unauthorized',
})
// @UseGuards(AuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicResource()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  signIn(@Body() loginDTO: SignInDto) {
    return this.authService.signIn(loginDTO);
  }

  @PublicResource()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
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

  // @HttpCode(HttpStatus.OK)
  // @Post('verify')
  // verify(@Body() verifyDTO: Record<string, any>) {
  //   return this.authService.verify(verifyDTO);
  // }

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
