import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class convertCurrencyDto {
  @IsString()
  @Length(3, 3) // Ensure valid currency codes
  @IsNotEmpty({ message: 'Base currency is required' })
  @ApiProperty({
    example: 'USD',
    description: 'Currency code to convert from',
  })
  baseCurrency: string;

  @IsString()
  @Length(3, 3) // Ensure valid currency codes
  @IsNotEmpty({ message: 'Target currency is required' })
  @ApiProperty({
    example: 'NGN',
    description: 'Currency code to convert to',
  })
  targetCurrency: string;

  @IsNumber()
  @IsPositive() // Ensure the amount is positive
  @IsNotEmpty({ message: 'Amount is required' })
  @ApiProperty({
    example: 1000,
    description: 'Amount to convert',
  })
  amount: number;
}

export class convertCurrencyResponseDto {
  @ApiProperty({
    example: 1000,
    description: 'Converted amount',
  })
  convertedAmount: number;

  @ApiProperty({
    example: 'USD',
    description: 'Currency code to convert from',
  })
  baseCurrency: string;

  @ApiProperty({
    example: 'NGN',
    description: 'Currency code to convert to',
  })
  targetCurrency: string;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Timestamp of the conversion',
  })
  timestamp: string;
}
