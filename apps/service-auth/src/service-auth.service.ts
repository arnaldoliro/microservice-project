import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceAuthService {
  getHello(): string {
    return 'Hello World!';
  }
}
