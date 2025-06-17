import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FileSystemService } from './file-system.service';
import { CreateFileDto } from './dto/create-file.dto';

@Controller()
export class FileSystemController {
  constructor(private readonly fileSystemService: FileSystemService) {}

  @MessagePattern({ cmd: 'upload-file' })
  async upload(@Payload() data: CreateFileDto) {
    return this.fileSystemService.uploadFile(data);
  }

  @MessagePattern({ cmd: 'list-file' })
  async list() {
    return this.fileSystemService.listFile();
  }
}
