import { BadGatewayException, ConflictException, Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ServiceUserService } from './service-user.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller()
export class ServiceUserController {
  constructor(private readonly userService: ServiceUserService) {}

  @MessagePattern({ cmd: 'get-users' })
  async getUsers() {
    return this.userService.findUsers()
  }

  @MessagePattern({ cmd: 'post-user'})
  async registerUser(data: CreateUserDto) {
    try {
      console.log('Controller Iniciado')
      if(!data || !data.email || !data.name || !data.password || !data.matricula) {
        console.log('Parametros Não Informados Corretamente')
        throw new BadGatewayException('Parametros não informados')
      }

      console.log('Requisição Recebida!')

      const matricula = data.matricula;

      console.log(`O matricula do usuário é ${matricula}`)

      const user = await this.userService.findUserByMatricula(matricula);

      if(user != null) {
        console.log('Usuário já possui cadastro')
        throw new ConflictException('Usuário já possui uma conta')
      }

      console.log('Usuário não possui cadastro!')

      const userCreated = await this.userService.createUser(data)

      if(!userCreated) {
        console.log("Não foi possivel criar o usuário")
        throw new InternalServerErrorException('Não foi possivel criar o usuário')
      }

      return userCreated

    }catch(error) {
      console.log(error)
      throw new InternalServerErrorException()
    }
  }
}
