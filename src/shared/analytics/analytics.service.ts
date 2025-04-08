import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Analytics } from './analytics.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Analytics)
    private analyticsRepository: Repository<Analytics>,
  ) {}

  async logTrade(
    userId: number,
    baseCurrency: string,
    targetCurrency: string,
    amount: number,
    rate: number,
  ) {
    const tradeLog = this.analyticsRepository.create({
      userId,
      activity: 'Trade',
      baseCurrency,
      targetCurrency,
      amount,
      rate,
    });
    await this.analyticsRepository.save(tradeLog);
  }

  async logUserActivity(userId: number, activity: string) {
    const activityLog = this.analyticsRepository.create({
      userId,
      activity,
    });
    await this.analyticsRepository.save(activityLog);
  }
}
