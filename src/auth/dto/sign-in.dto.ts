import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { User } from 'src/users/user.entity';

export class SignInDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform((email) => email.value.toLowerCase())
  @ApiProperty({ example: 'test@testmail.com', description: 'Email of user' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty({ example: '123456', description: 'Password of user' })
  password: string;
}

export class SignInResponse {
  @ApiProperty({
    example: 'dummyToken',
    description: 'Login token',
  })
  token: string;

  @ApiProperty()
  user: User;
}
