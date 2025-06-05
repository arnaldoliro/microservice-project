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
      const userFinded = await repository
          .createQueryBuilder('user')
          .where('user.matricula = :matricula', { matricula })
          .andWhere('ROWNUM = 1')
          .getOne();
      return userFinded
    }catch(error) {
      console.error(error)
      throw new InternalServerErrorException('Erro ao procurar pela matricula')
    }
  }

  async createUser(data: CreateUserDto): Promise<User> {
    try{
      const repository = this.dbService.getDataSource().getRepository(User)
      const user = repository.create(data)
      return await repository.save(user)
    } catch(error) {
      console.log(error)
      throw new InternalServerErrorException('Erro ao criar usuário')
    }
  }
}
