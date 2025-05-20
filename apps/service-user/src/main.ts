import { NestFactory } from '@nestjs/core';
import { ServiceUserModule } from './service-user.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(ServiceUserModule, {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3003,
      },
    });
    await app.listen();
    console.log('User microservice running on TCP port 3001');
}

bootstrap();
