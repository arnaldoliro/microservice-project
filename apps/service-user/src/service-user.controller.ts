import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ServiceUserService } from './service-user.service';

@Controller()
export class ServiceUserController {
  @MessagePattern({ cmd: 'get-users' })
  async getUsers() {
    return 'Hello from user-service!'
  }
}
