import { Controller, Get } from '@nestjs/common';
import { ServiceAuthService } from './service-auth.service';

@Controller()
export class ServiceAuthController {
  constructor(private readonly serviceAuthService: ServiceAuthService) {}

  @Get()
  getHello(): string {
    return this.serviceAuthService.getHello();
  }
}
