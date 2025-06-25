import { Test, TestingModule } from '@nestjs/testing';
import { FileSystemController } from './file-system.controller';
import { FileSystemService } from './file-system.service';

describe('FileSystemController', () => {
  let fileSystemController: FileSystemController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FileSystemController],
      providers: [FileSystemService],
    }).compile();

    fileSystemController = app.get<FileSystemController>(FileSystemController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(fileSystemController.getHello()).toBe('Hello World!');
    });
  });
});
