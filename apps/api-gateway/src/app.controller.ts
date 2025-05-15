import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices'

@Controller()
export class AppController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy
  ) {}

  @Get('users')
  async getUsers() {
    return this.userClient.send({ cmd: 'get-users'}, {});
  }
}
