import { Injectable } from '@nestjs/common';

@Injectable()
export class Utility {
  private static fxRatesCache: {
    rates: Record<string, number>;
    timestamp: number;
  } | null = null;
  private static cacheDuration = 10 * 60 * 1000; // Cache duration: 10 minutes

  static async fetchExchangeRates(): Promise<Record<string, number>> {
    const now = Date.now();

    // Return cached rates if they are still valid
    if (
      this.fxRatesCache &&
      now - this.fxRatesCache.timestamp < this.cacheDuration
    ) {
      return this.fxRatesCache.rates;
    }

    // Fetch new rates from the external API
    const response = await fetch(
      'https://api.exchangerate-api.com/v4/latest/USD',
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

    return data.rates;
  }
}
