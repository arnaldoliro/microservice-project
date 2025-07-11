import { Controller, BadRequestException, Query, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FileSystemService } from './file-system.service';
import { CreateFileDto } from './dto/create-file.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { File } from '../../../libs/common/src/entities/files.entity';
import { Between, ILike, FindOptionsWhere } from 'typeorm';
import * as mime from 'mime-types';

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
    fileEntity.originalFileName = dto.originalFileName;
    fileEntity.mimeType = dto.mimeType;
    fileEntity.lotacao = dto.lotacao;
    fileEntity.conteudo = Buffer.from(dto.conteudo, 'base64');

    return this.fileSystemService.uploadFile(fileEntity);
  }

  @MessagePattern({ cmd: 'list-files' })
  async list(@Payload() data: { search?: string; category?: string; date?: string; page?: number; limit?: number }) {
    const { search, category, date, page = 1, limit = 10 } = data;
    const skip = (page - 1) * limit;

    console.log("[Microserviço] Payload recebido:", data);

    let where: FindOptionsWhere<File>[] = [];

    if (search) {
      const searchConditions: FindOptionsWhere<File>[] = [
        { nome: ILike(`%${search}%`) },
        { descricao: ILike(`%${search}%`) },
      ];

      where = searchConditions.map((cond) => {
        const obj: FindOptionsWhere<File> = { ...cond };
        if (category) obj.categoria = category;
        if (date) {
          const start = new Date(`${date}T00:00:00`);
          const end = new Date(`${date}T23:59:59`);
          obj.criadoEm = Between(start, end);
        }
        return obj;
      });
    } else {
      const obj: FindOptionsWhere<File> = {};
      if (category) obj.categoria = category;
      if (date) {
        const start = new Date(`${date}T00:00:00`);
        const end = new Date(`${date}T23:59:59`);
        obj.criadoEm = Between(start, end);
      }
      where = [obj];
    }

    console.log("[Microserviço] WHERE final:", JSON.stringify(where, null, 2));

    const result = await this.fileSystemService.searchFile(where, skip, limit);

    console.log(`[Microserviço] Retornando ${result.length} arquivos`);

    return result;
  }



  @MessagePattern({ cmd: 'delete-files' })
  async delete(id: number) {
    try {
      const deletedFile = await this.fileSystemService.deleteFile(id)
      return {succces: true, message: `Arquivo deletado com sucesso! ${deletedFile}`}
    } catch (err) {
      console.error(err)
      return {succces: false, message: `Erro interno do servidor: ${err}`}
    }
  }

  @MessagePattern({ cmd: 'delete-all-files'})
  async deleteAll() {
    try {
      return await this.fileSystemService.deleteAllFiles()
    } catch(err) {
      console.log(err)
      return {succes: false, message: `Erro interno do servidor: ${err}`}
    }
  }

  @MessagePattern({ cmd: 'download-arquivo' })
    async downloadArquivo(@Payload() id: number) {
    const file = await this.fileSystemService.findOneFile(id);

    if (!file) throw new NotFoundException('Arquivo não encontrado');

    const mimeType = mime.lookup(file.originalFileName) || 'application/octet-stream';

    return {
      nome: file.originalFileName,
      conteudo: file.conteudo.toString('base64'),
      mimeType,
    };
  }
}
