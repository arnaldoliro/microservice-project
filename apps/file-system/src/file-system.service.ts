import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from '../../../libs/common/src/entities/files.entity';
import { Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { fileTypeFromBuffer } from 'file-type';
import { RpcException } from '@nestjs/microservices';
import isMimeTypeValidForCategory from './utils/validationCategory';
import { UpdateFileDto } from './dto/update-file.dto';

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
    fileEntity.fixado = dto.isPinned ? 'S' : 'N';
    fileEntity.conteudo = buffer;

    // Salva e retorna
    const saved = await this.fileRepo.save(fileEntity);

    const file = await this.fileRepo.createQueryBuilder('File')
      .where('File.CD_ARQUIVO = :id', { id: saved.id })
      .andWhere('ROWNUM = 1')
      .getOne();

    return file;
  }

  async listFile() {
    return await this.fileRepo.find({
      select: ['id', 'nome', 'descricao', 'categoria', 'lotacao', 'criadoEm'],
      order: { criadoEm: 'DESC' },
      take: 100,
    });
  }

  async searchFile({ search, category, date, skip = 0, limit = 12 }: 
    { search?: string; category?: string; date?: string; skip?: number; limit?: number }) {

    let whereClause = '';
    const params: any = {};

    if (search) {
      whereClause += ` AND (LOWER("NM_ARQUIVO") LIKE LOWER(:search) OR LOWER("DS_ARQUIVO") LIKE LOWER(:search))`;
      params.search = `%${search}%`;
    }

    if (category) {
      whereClause += ` AND "CD_TIPO_ARQUIVO" = :category`;
      params.category = category;
    }

    if (date && !isNaN(Date.parse(date))) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      whereClause += ` AND "DT_PUBLICACAO" BETWEEN :start AND :end`;
      params.start = start;
      params.end = end;
    }

    const maxRow = skip + limit;
    params.maxRow = maxRow;
    params.skip = skip;

    const query = `
      SELECT * FROM (
        SELECT inner_query.*, ROWNUM rn FROM (
          SELECT
            "CD_ARQUIVO" AS "id",
            "NM_ARQUIVO" AS "nome",
            "DS_ARQUIVO" AS "descricao",
            "DT_PUBLICACAO" AS "criadoEm",
            "CD_TIPO_ARQUIVO" AS "categoria",
            CASE WHEN "SN_FIXADO" = 'S' THEN 1 ELSE 0 END AS "fixado"
          FROM "ARQUIVO_PORTAL_TEST"
          WHERE 1=1 ${whereClause}
          ORDER BY "DT_PUBLICACAO" DESC
        ) inner_query
        WHERE ROWNUM <= :maxRow
      )
      WHERE rn > :skip
    `;

    const files = await this.fileRepo.query(query, params);

    return files.map(file => ({
      ...file,
      fixado: file.fixado === 1
    }));
  }

  async findOneFile(id: number) {
    return await this.fileRepo
      .createQueryBuilder('file')
      .where('file.id = :id', { id })
      .getOne();
  }


  async deleteFile(id: number) {
    const deletedFiles = await this.fileRepo.delete(id)
    if(deletedFiles.affected === 0) {
      throw new NotFoundException(`Arquivod com id ${id} não encontrado`)
    }
    return { message: 'Arquivo deletado com sucesso' };
  }

//   async deleteAllFiles() {
//     await this.fileRepo.clear()
//     return { message: 'Arquivos deletados com sucesso' };
//   }

  async fixFile(id: number, fixedFile: boolean) {

  const fixadoValue = fixedFile ? 'S' : 'F';
  
  await this.fileRepo.update(id, { fixado: fixadoValue });

  return { message: 'Arquivo salvo com sucesso!', fixedFile };
}

  async updateFile(dto: UpdateFileDto) {
    try {
      const file = await this.findOneFile(dto.id)

      if (!file) {
        console.log('Arquivo não encontrado');
        throw new NotFoundException(`Arquivo com id ${dto.id} não encontrado`);
      }

      file.nome = dto.nome;
      file.descricao = dto.descricao;

      await this.fileRepo.save(file);

      return file;
    } catch (err) {
      console.error('Erro ao atualizar arquivo:', err);
      throw new RpcException('Erro ao atualizar arquivo');
    }
  }
}
