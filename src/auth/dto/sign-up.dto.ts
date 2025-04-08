import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({ message: 'First name is required' })
  @ApiProperty({ example: 'John', description: 'First name of user' })
  @IsString({ message: 'First name must be a string' })
  firstName: string;

  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @ApiProperty({ example: 'Doe', description: 'Last name of user' })
  lastName: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @ApiProperty({
    example: '+23480372827354',
    description: 'Phone number of user',
  })
  phoneNumber: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @Transform((email) => email.value.toLowerCase())
  @ApiProperty({ example: 'test@testmail.com', description: 'Email of user' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty({ example: '12345678', description: 'Password of user' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
