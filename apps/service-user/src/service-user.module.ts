import { Module } from '@nestjs/common';
import { ServiceUserController } from './service-user.controller';
import { DatabaseModule } from '@app/database';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    DatabaseModule,
  ],
  controllers: [ServiceUserController],
})
export class ServiceUserModule {}
