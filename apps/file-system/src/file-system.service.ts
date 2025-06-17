import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from '../../../libs/common/src/entities/files.entity';
import { Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FileSystemService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
  ) {}

  async uploadFile(file: File) {
    return await this.fileRepo.save(file);
  }

  async listFile() {
    return await this.fileRepo.find({
      select: ['id', 'nome', 'criadoEm'],
      order: { criadoEm: 'DESC' },
    });
  }
}

