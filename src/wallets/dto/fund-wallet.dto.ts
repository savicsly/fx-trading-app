import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class fundWalletDto {
  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber()
  @IsPositive() // Ensure the amount is positive
  @ApiProperty({
    example: 100,
    description: 'Amount to fund the wallet',
  })
  amount: number;

  @IsNotEmpty({ message: 'Currency is required' })
  @IsString()
  @Length(3, 3) // Ensure valid currency codes (e.g., NGN, USD)
  @ApiProperty({
    example: 'USD',
    description: 'Currency code',
  })
  currency: string;
}
