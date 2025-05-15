import { Test, TestingModule } from '@nestjs/testing';
import { ServiceUserController } from './service-user.controller';

describe('ServiceUserController', () => {
  let controller: ServiceUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceUserController],
    }).compile();

    controller = module.get<ServiceUserController>(ServiceUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return "Hello from user-service!" when getUsers is called', () => {
    const result = controller.getUsers();
    expect(result).toBe('Hello from user-service!');
  });
});
