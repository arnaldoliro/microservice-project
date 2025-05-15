import { Controller, Get } from '@nestjs/common';
import { ServiceAuthService } from './service-auth.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ServiceAuthController {
  @MessagePattern({ cmd: 'get-auth' })
  async getAuth() {
    return 'Hello from auth-service!';
  }
}
