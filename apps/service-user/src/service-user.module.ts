import { Module } from '@nestjs/common';
import { ServiceUserController } from './service-user.controller';
import { ServiceUserService } from './service-user.service';

@Module({
  imports: [],
  controllers: [ServiceUserController],
  providers: [ServiceUserService],
})
export class ServiceUserModule {}
