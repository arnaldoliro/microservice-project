import { NestFactory } from '@nestjs/core';
import { ServiceUserModule } from './service-user.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(ServiceUserModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3001,
    }
  });
  await app.listen();
  console.log(`User Service is runnin on port ${process.env.USER_SERVICE_PORT}!`)
}
bootstrap();
