import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class VerifyEmailDto {
  @IsNotEmpty({ message: 'OTP code is required' })
  @IsNumber()
  @ApiProperty({
    example: 123455,
    description: 'Login token',
  })
  code: number;
}

export class VerifyEmailResponse {
  @ApiProperty({
    example: 123456,
    description: 'Login token',
  })
  token: number;

  @ApiProperty()
  user: any;
}
