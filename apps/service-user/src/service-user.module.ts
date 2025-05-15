import { Module } from '@nestjs/common';
import { ServiceUserController } from './service-user.controller';

@Module({
  controllers: [ServiceUserController],
})
export class ServiceUserModule {}
