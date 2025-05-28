import { Module } from '@nestjs/common';
import { ServiceUserController } from './service-user.controller';
import { DatabaseModule } from '@app/database';
import { ConfigModule } from '@nestjs/config';
import { ServiceUserService } from './service-user.service';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    DatabaseModule,
  ],
  controllers: [ServiceUserController],
  providers: [ServiceUserService]
})
export class ServiceUserModule {}
