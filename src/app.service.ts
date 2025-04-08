import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Welcome to the FX Trading App API Service!',
      status: 'success',
      timestamp: new Date().toISOString(),
    };
  }
}
