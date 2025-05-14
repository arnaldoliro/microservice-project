import { Module } from '@nestjs/common';
import { ServiceAuthController } from './service-auth.controller';
import { ServiceAuthService } from './service-auth.service';

@Module({
  imports: [],
  controllers: [ServiceAuthController],
  providers: [ServiceAuthService],
})
export class ServiceAuthModule {}
