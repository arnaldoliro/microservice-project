import { Injectable, NotFoundException } from '@nestjs/common';
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

 async searchFile(whereClause: FindOptionsWhere<File>[], skip: number, limit: number) {
  return await this.fileRepo.find({
    where: whereClause,
    select: ['id', 'nome', 'descricao', 'categoria', 'lotacao', 'criadoEm'],
    order: { criadoEm: 'DESC' },
    skip,
    take: limit,
  });
}

  async findOneFile(id: number) { 
    return await this.fileRepo.findOne({where: { id: id }})
  }

  async deleteFile(id: number) {
    const deletedFiles = await this.fileRepo.delete(id)
    if(deletedFiles.affected === 0) {
      throw new NotFoundException(`Arquivod com id ${id} não encontrado`)
    }
    return { message: 'Arquivo deletado com sucesso' };
  }

  async deleteAllFiles() {
    await this.fileRepo.clear()
    return { message: 'Arquivos deletados com sucesso' };
  }

  async fixFile(id, fixedFile){
    console.log('Entrando no service')
    await this.fileRepo.update(id, {fixado: fixedFile})
    console.log('Salvo com sucesso')

    return { message: 'Arquivo salvo com sucesso!', fixedFile}
  }
}

