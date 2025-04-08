import { Injectable } from '@nestjs/common';
import { UtilityService } from 'src/shared/utils/utility.service';

@Injectable()
export class FxService {
  constructor(private readonly utilityService: UtilityService) {}

  async getFxRates(
    baseCurrency: string = 'USD',
    targetCurrency?: string,
  ): Promise<Record<string, number> | number> {
    return this.utilityService.fetchExchangeRates(baseCurrency, targetCurrency);
  }
}
