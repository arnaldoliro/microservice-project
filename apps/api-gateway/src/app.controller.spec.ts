import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ClientProxy } from '@nestjs/microservices';

describe('AppController', () => {
  let appController: AppController;
  let mockClientProxy: Partial<ClientProxy>;

  beforeEach(async () => {
    mockClientProxy = {
      send: jest.fn().mockReturnValue('mocked response'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: 'USER_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  describe('getUsers', () => {
    it('should call userClient.send with correct pattern', async () => {
      const result = await appController.getUsers();

      expect(mockClientProxy.send).toHaveBeenCalledWith({ cmd: 'get-users' }, {});
      expect(result).toBe('mocked response');
    });
  });
});
