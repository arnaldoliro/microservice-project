import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';

describe('AppController', () => {
  let appController: AppController;
  let userServiceClient: ClientProxy;

  beforeEach(async () => {
    const userServiceClientMock = {
      send: jest.fn(() => of('Hello from user-service!')),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: 'USER_SERVICE',
          useValue: userServiceClientMock,
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    userServiceClient = module.get<ClientProxy>('USER_SERVICE');
  });

  it('should call userClient.send with correct pattern', async () => {
    const result = await appController.getUsers();
    expect(userServiceClient.send).toHaveBeenCalledWith({ cmd: 'get-users' }, {});
    expect(result).toBe('Hello from user-service!');
  });
});
