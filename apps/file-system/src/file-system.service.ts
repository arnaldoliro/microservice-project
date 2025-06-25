import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from '../../../libs/common/src/entities/files.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
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
    select: ['id', 'nome', 'descricao', 'categoria', 'lotacao', 'criadoEm'],
    order: { criadoEm: 'DESC' },
    take: 100,
  });
  }

 async searchFile(whereClause: FindOptionsWhere<File>[]) {
  return await this.fileRepo.find({
    where: whereClause,
    select: ['id', 'nome', 'descricao', 'categoria', 'lotacao', 'criadoEm'],
    order: { criadoEm: 'DESC' },
    take: 100, // Também limita a 100 resultados filtrados
  });
}
  async findOneFile(file: File) {
    return await this.fileRepo.findOne({where: { nome: file.nome }})
  }

  async deleteFile() {
    return await this.fileRepo.delete({
      
    })
  }
}

