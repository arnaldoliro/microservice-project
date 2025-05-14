import { NestFactory } from '@nestjs/core';
import { ServiceAuthModule } from './service-auth.module';

async function bootstrap() {
  const app = await NestFactory.create(ServiceAuthModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
