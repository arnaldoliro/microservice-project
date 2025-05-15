import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy
  ) {}

  @Get('/users')
  async getUsers() {
    console.log('Rota /users acessada');
    const response$ = this.userServiceClient.send({ cmd: 'get-users' }, {});
    return await lastValueFrom(response$);
  }

  @Get('/auth')
  async getAuth() {
    console.log('Rota /auth acessada')
    const response$ = this.authServiceClient.send({ cmd: 'get-auth' }, {});
    return await lastValueFrom(response$);
  }
}
