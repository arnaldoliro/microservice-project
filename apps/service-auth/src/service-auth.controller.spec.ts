import { Test, TestingModule } from '@nestjs/testing';
import { ServiceAuthController } from './service-auth.controller';
import { ServiceAuthService } from './service-auth.service';

describe('ServiceAuthController', () => {
  let serviceAuthController: ServiceAuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ServiceAuthController],
      providers: [ServiceAuthService],
    }).compile();

    serviceAuthController = app.get<ServiceAuthController>(ServiceAuthController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(serviceAuthController.getHello()).toBe('Hello World!');
    });
  });
});
