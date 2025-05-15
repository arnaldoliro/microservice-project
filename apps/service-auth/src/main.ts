import { NestFactory } from '@nestjs/core';
import { ServiceAuthModule } from './service-auth.module';
import { Transport, MicroserviceOptions  } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ServiceAuthModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3002,
    },
  });
  await app.listen();
  console.log('User microservice running on TCP port 3002');
}
bootstrap();
