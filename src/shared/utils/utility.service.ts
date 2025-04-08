import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilityService {
  private fxRatesCache: {
    rates: Record<string, number>;
    timestamp: number;
  } | null = null;
  private cacheDuration = 10 * 60 * 1000; // Cache duration: 10 minutes

  async fetchExchangeRates(
    baseCurrency: string = 'USD',
    targetCurrency?: string,
  ): Promise<Record<string, number> | number> {
    const now = Date.now();

    // Return cached rates if they are still valid
    if (
      this.fxRatesCache &&
      now - this.fxRatesCache.timestamp < this.cacheDuration
    ) {
      if (targetCurrency) {
        return this.fxRatesCache.rates[targetCurrency];
      }
      return this.fxRatesCache.rates;
    }

    // Fetch new rates from the external API
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch FX rates');
    }
    const data = await response.json();

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
