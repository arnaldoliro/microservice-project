import { Body, Controller, Delete, Get, Inject, Post, Put } from '@nestjs/common';
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

  @Post('/user/register')
  async register(@Body() data: CreateUserDto) {
    console.log('Rota /user/register acessada');
    const response$ = this.userServiceClient.send({ cmd: 'post-user'}, data)
    const user = await lastValueFrom(response$)
    return {
      statusCode: 201,
      message: 'Usuário criado com sucesso!',
      data: user
    }
  }

  @Put('/user/update')
  async update(@Body() data: any) {
    console.log('Rota /user/update acessada');
    const response$ = this.userServiceClient.send({ cmd: 'put-user'}, data)
    const user = await lastValueFrom(response$)
    return {
      statusCode: 200,
      message: 'Usuário atualizado com sucesso!',
      data: user
    } 
  }

  @Delete('/user/delete')
  async delete(@Body() data: any) {
    console.log('Rota /user/delete acessada');
    const response$ = this.userServiceClient.send({ cmd: 'delete-user'}, data)
    const user = await lastValueFrom(response$)
    return {
      statusCode: 200,
      message: 'Usuário deletado com sucesso!',
      data: user
    }
  }
}
