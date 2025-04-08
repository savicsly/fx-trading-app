import { Module } from '@nestjs/common';
import { UtilityService } from 'src/shared/utils/utility.service';
import { FxController } from './fx.controller';
import { FxService } from './fx.service';

@Module({
  controllers: [FxController],
  providers: [FxService, UtilityService],
  exports: [FxService],
})
export class FxModule {}
