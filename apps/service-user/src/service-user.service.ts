import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@app/database';
import { User } from '@app/common';

@Injectable()
export class ServiceUserService {
  constructor(private readonly dbService: DatabaseService) {}

  async findUsers(): Promise<User[]> {
    const repository = this.dbService.getDataSource().getRepository(User);
    return repository.find();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
