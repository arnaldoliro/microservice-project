import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices'
import { CreateUserDto } from 'apps/service-user/dto/create-user.dto';
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

  @Post('/user')
  async register(@Body() data: CreateUserDto) {
    console.log('Rota /user acessada');
    const response$ = this.userServiceClient.send({ cmd: 'post-user'}, data)
    const user = await lastValueFrom(response$)
    return {
      statusCode: 201,
      message: 'Usuário criado com sucesso!',
      data: user
    }
  }

  @Get('/auth')
  async getAuth() {
    console.log('Rota /auth acessada')
    const response$ = this.authServiceClient.send({ cmd: 'get-auth' }, {});
    return await lastValueFrom(response$);
  }
}
