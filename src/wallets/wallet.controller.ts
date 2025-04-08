import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
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
import { convertCurrencyDto } from './dto/convert-currency.dto';
import { fundWalletDto } from './dto/fund-wallet.dto';
import { WalletService } from './wallet.service';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('wallets')
@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get('')
  @ApiOperation({ summary: 'Get wallet balances' })
  @ApiResponse({ status: 200, description: 'Returns wallet balances' })
  async getWalletBalances(@AuthUserID() userId: number) {
    return this.walletService.getWalletBalances(userId);
  }

  @Post('fund')
  @ApiOperation({ summary: 'Fund a wallet' })
  @ApiResponse({ status: 201, description: 'Wallet funded successfully' })
  fundWallet(@Body() data: fundWalletDto, @AuthUserID() userId: number) {
    const response = this.walletService.fundWallet(data, userId);
    return response;
  }

  @Post('convert')
  @ApiOperation({ summary: 'Convert currency in wallet' })
  @ApiResponse({ status: 200, description: 'Currency converted successfully' })
  convertCurrency(
    @Body() data: convertCurrencyDto,
    @AuthUserID() userId: number,
  ) {
    const response = this.walletService.convertCurrency(data, userId);
    return response;
  }

  @Post('trade')
  @ApiOperation({ summary: 'Trade currency in wallet' })
  @ApiResponse({ status: 200, description: 'Currency traded successfully' })
  tradeCurrency(
    @Body() data: convertCurrencyDto,
    @AuthUserID() userId: number,
  ) {
    const response = this.walletService.tradeCurrency(data, userId);
    return response;
  }

  @Post('fund/flutterwave')
  @ApiOperation({ summary: 'Fund wallet via Flutterwave' })
  @ApiResponse({ status: 201, description: 'Returns payment link for funding' })
  async fundWalletViaFlutterwave(
    @Body() data: fundWalletDto,
    @AuthUserID() userId: number,
  ) {
    return this.walletService.fundWalletViaFlutterwave(data, userId);
  }

  @Post('webhook/flutterwave')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Flutterwave webhook' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async handleFlutterwaveWebhook(@Body() payload: any) {
    await this.walletService.handleFlutterwaveWebhook(payload);
  }
}
