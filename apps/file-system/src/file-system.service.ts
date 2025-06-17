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

  async uploadFile(dto: CreateFileDto) {
    const novo = this.fileRepo.create({
      nome: dto.nome,
      conteudo: Buffer.from(dto.conteudo, 'base64'),
    });

    return await this.fileRepo.save(novo);
  }

  async listFile() {
    return await this.fileRepo.find({
      select: ['id', 'nome', 'criadoEm'],
      order: { criadoEm: 'DESC' },
    });
  }
}
