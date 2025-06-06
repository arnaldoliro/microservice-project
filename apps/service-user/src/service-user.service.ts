import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '@app/database';
import { User } from '@app/common';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class ServiceUserService {
  constructor(private readonly dbService: DatabaseService) {}

  async findUsers(): Promise<User[]> {
    try {
      const repository = this.dbService.getDataSource().getRepository(User);
      return await repository.find();
    }catch(error) {
      console.error(error)
      throw new InternalServerErrorException('Erro ao procurar usuários')
    }
  }

  async findUserByMatricula(matricula: string): Promise<User | null> {
    try {
      const repository = this.dbService.getDataSource().getRepository(User);
      const userFinded = await repository.findOne({where: {matricula: matricula}})
          // Query Para o Oracle
          // .createQueryBuilder('user')
          // .where('user.matricula = :matricula', { matricula })
          // .andWhere('ROWNUM = 1')
          // .getOne();
      return userFinded
    }catch(error) {
      console.error(error)
      throw new InternalServerErrorException('Erro ao procurar pela matricula')
    }
  }

  async createUser(data: CreateUserDto): Promise<User> {
    try{
      const repository = this.dbService.getDataSource().getRepository(User)
      const user = await repository.create({
        nome: data.name, 
        email: data.email,
        senha: data.password, 
        matricula: data.matricula
      })
      return await repository.save(user)
    } catch(error) {
      console.log(error)
      throw new InternalServerErrorException('Erro ao criar usuário')
    }
  }

  async updateUser(data: any): Promise<User | null> {
    try {
      const repository = this.dbService.getDataSource().getRepository(User)
      const user = await repository.update(
        {matricula: data.matricula},
        {
          nome: data.name, 
          email: data.email,
          senha: data.password
        })
      const updatedUser = await repository.findOne({ where: { matricula: data.matricula } });
      return updatedUser
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Erro ao atualizar usuário')
    }
  }

  async deleteUser(user: User) {
    try {
      const repository = this.dbService.getDataSource().getRepository(User)
      return await repository.delete(user)
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException('Não foi possivel deletar o usuário')
    }
  }
}
