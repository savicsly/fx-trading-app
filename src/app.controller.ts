import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get a welcome message' })
  @ApiResponse({ status: 200, description: 'Returns a welcome message' })
  getHello() {
    return this.appService.getHello();
  }
}
