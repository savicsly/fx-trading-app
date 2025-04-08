import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthUserID } from 'src/shared/decorator/private-resource.decorator';
import { TransactionService } from './transaction.service';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get('')
  @ApiOperation({ summary: 'Get transaction history' })
  @ApiResponse({ status: 200, description: 'Returns transaction history' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit the number of transactions',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Offset for pagination',
  })
  async getTransactionHistory(
    @AuthUserID() userId: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.transactionService.getTransactionHistory(userId, {
      limit,
      offset,
    });
  }
}
