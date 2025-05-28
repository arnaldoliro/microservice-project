import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ServiceUserService } from './service-user.service';

@Controller()
export class ServiceUserController {
  constructor(private readonly userService: ServiceUserService) {}

  @MessagePattern({ cmd: 'get-users' })
  async getUsers() {
    return this.userService.findUsers()
  }
}
