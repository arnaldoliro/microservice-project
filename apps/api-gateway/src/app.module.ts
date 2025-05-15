import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER-SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.HOST,
          port: Number(process.env.USER_SERVICE_PORT),
        },
      }
    ])
  ],
  controllers: [AppController],
})
export class AppModule {}
