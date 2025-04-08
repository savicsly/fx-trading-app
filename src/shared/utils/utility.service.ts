import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilityService {
  private readonly exchangeRateBaseUrl: string =
    'https://api.exchangerate-api.com/v4/latest';

  private fxRatesCache: {
    rates: Record<string, number>;
    timestamp: number;
  } | null = null;
  private cacheDuration = 10 * 60 * 1000;

  async fetchExchangeRates(
    baseCurrency: string = 'USD',
    targetCurrency?: string,
  ): Promise<Record<string, number> | number> {
    const now = Date.now();

    if (
      this.fxRatesCache &&
      now - this.fxRatesCache.timestamp < this.cacheDuration
    ) {
      if (targetCurrency) {
        return this.fxRatesCache.rates[targetCurrency];
      }
      return this.fxRatesCache.rates;
    }

    const response = await fetch(`${this.exchangeRateBaseUrl}/${baseCurrency}`);
    if (!response.ok) {
      throw new Error('Failed to fetch FX rates');
    }
    interface ExchangeRateResponse {
      rates: Record<string, number>;
      [key: string]: unknown;
    }
    const data = (await response.json()) as ExchangeRateResponse;

    // Cache the fetched rates
    this.fxRatesCache = {
      rates: data.rates,
      timestamp: now,
    };

    if (targetCurrency) {
      return data.rates[targetCurrency];
    }
    return data.rates;
  }
}
