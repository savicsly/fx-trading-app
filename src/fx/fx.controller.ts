import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FxService } from './fx.service';

@ApiTags('fx')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('fx')
export class FxController {
  constructor(private readonly fxService: FxService) {}

  @Get('rates')
  @ApiOperation({ summary: 'Get current FX rates' })
  @ApiResponse({ status: 200, description: 'Returns current FX rates' })
  async getFxRates() {
    return this.fxService.getFxRates();
  }
}
