import { Controller, BadRequestException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FileSystemService } from './file-system.service';
import { CreateFileDto } from './dto/create-file.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { File } from '../../../libs/common/src/entities/files.entity';

@Controller()
export class FileSystemController {
  constructor(private readonly fileSystemService: FileSystemService) {}

  @MessagePattern({ cmd: 'upload-file' })
  async upload(@Payload() data: CreateFileDto) {
    const dto = plainToInstance(CreateFileDto, data);

    const errors = await validate(dto);

    if (errors.length > 0) {
      const messages = errors
        .map(e => Object.values(e.constraints ?? {}))
        .flat();
      throw new BadRequestException(messages);
    }

    const fileEntity = new File();
    fileEntity.nome = dto.nome;
    fileEntity.descricao = dto.descricao;
    fileEntity.categoria = dto.categoria;
    fileEntity.lotacao = dto.lotacao;
    fileEntity.conteudo = Buffer.from(dto.conteudo, 'base64');

    return this.fileSystemService.uploadFile(fileEntity);
  }

  @MessagePattern({ cmd: 'list-files' })
  async list() {
    return this.fileSystemService.listFile();
  }
}
