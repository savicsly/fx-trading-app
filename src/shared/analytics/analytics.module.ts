import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analytics } from './analytics.entity';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [TypeOrmModule.forFeature([Analytics])], // Register Analytics entity
  providers: [AnalyticsService], // Provide AnalyticsService
  exports: [AnalyticsService, TypeOrmModule], // Export AnalyticsService and TypeOrmModule
})
export class AnalyticsModule {}
