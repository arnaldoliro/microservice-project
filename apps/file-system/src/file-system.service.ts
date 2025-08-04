import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from '../../../libs/common/src/entities/files.entity';
import { Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { fileTypeFromBuffer } from 'file-type';
import { RpcException } from '@nestjs/microservices';
import isMimeTypeValidForCategory from './utils/validationCategory';

@Injectable()
export class FileSystemService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
  ) {}

  async uploadFile(dto: CreateFileDto) {
    const categoriasValidas = ['documento', 'imagem', 'planilha', 'apresentação', 'outros'];
    if (!categoriasValidas.includes(dto.categoria.toLowerCase())) {
      throw new RpcException(`Categoria inválida: "${dto.categoria}". Categorias permitidas: ${categoriasValidas.join(', ')}`);
    }

    const buffer = Buffer.from(dto.conteudo, 'base64');
    
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (buffer.length > MAX_FILE_SIZE) {
      throw new RpcException('Arquivo excede o tamanho máximo permitido de 10MB.');
    }

    // Detecta o tipo MIME real do conteúdo
    const fileType = await fileTypeFromBuffer(buffer);
    if (!fileType) {
      throw new RpcException('Não foi possível detectar o tipo do arquivo.');
    }

    const realMime = fileType.mime;

    // Valida se o tipo MIME bate com a categoria fornecida
    if (!isMimeTypeValidForCategory(realMime, dto.categoria)) {
      throw new RpcException(
        `Tipo de arquivo não é permitido para a categoria ${dto.categoria}.`
      );
    }

    // Cria entidade para salvar no banco
    const fileEntity = new File();
    fileEntity.nome = dto.nome;
    fileEntity.descricao = dto.descricao;
    fileEntity.categoria = dto.categoria;
    fileEntity.originalFileName = dto.originalFileName;
    fileEntity.mimeType = realMime;
    fileEntity.lotacao = dto.lotacao;
    fileEntity.fixado = dto.isPinned;
    fileEntity.conteudo = buffer;

    // Salva e retorna
    const saved = await this.fileRepo.save(fileEntity);
    return this.fileRepo.findOne({ where: { id: saved.id } });
  }

  async listFile() {
    return await this.fileRepo.find({
      select: ['id', 'nome', 'descricao', 'categoria', 'lotacao', 'criadoEm'],
      order: { criadoEm: 'DESC' },
      take: 100,
    });
  }

  async searchFile(
    filters: { search?: string; category?: string; date?: string; skip?: number; limit?: number }
  ) {
    const { search, category, date, skip = 0, limit = 10 } = filters;
    const qb = this.fileRepo.createQueryBuilder('file');

    if (search) {
      qb.andWhere('(file.nome ILIKE :search OR file.descricao ILIKE :search)', { search: `%${search}%` });
    }
    if (category) {
      qb.andWhere('file.categoria = :category', { category });
    }
    if (date) {
      const start = new Date(`${date}T00:00:00`);
      const end = new Date(`${date}T23:59:59`);
      qb.andWhere('file.criadoEm BETWEEN :start AND :end', { start, end });
    }
    qb.orderBy('file.criadoEm', 'DESC');
    qb.skip(skip);
    qb.take(limit);
    qb.select([
      'file.id',
      'file.nome',
      'file.descricao',
      'file.categoria',
      'file.lotacao',
      'file.criadoEm',
      'file.fixado',
    ]);
    return qb.getMany();
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

  async updateFile(dto: CreateFileDto, id: number) {
    try {
      const file = await this.fileRepo.findOne({ where: { id: dto.id } });
    if (!file) {
      throw new NotFoundException(`Arquivo com id ${dto.id} não encontrado`);
    }

    file.nome = dto.nome;
    file.descricao = dto.descricao;
    file.categoria = dto.categoria;
    file.originalFileName = dto.originalFileName;
    file.mimeType = dto.mimeType;
    file.lotacao = dto.lotacao;
    file.fixado = dto.isPinned;

    await this.fileRepo.save(file);
    return file;
    } catch (err) {
      console.error('Erro ao atualizar arquivo:', err);
      throw new RpcException('Erro ao atualizar arquivo');
    }
  }
}
