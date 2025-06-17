import { NestFactory } from '@nestjs/core';
import { FileSystemModule } from './file-system.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(FileSystemModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3005, 
    },
  });

  await app.listen();
}
bootstrap();
