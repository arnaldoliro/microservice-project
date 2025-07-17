import { Controller, NotFoundException, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FileSystemService } from './file-system.service';
import { CreateFileDto } from './dto/create-file.dto';

import * as mime from 'mime-types';


@Controller()
export class FileSystemController {
  constructor(private readonly fileSystemService: FileSystemService) {}

  @MessagePattern({ cmd: 'upload-file' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async upload(@Payload() dto: CreateFileDto) {
  // Apenas delega para o service
  return this.fileSystemService.uploadFile(dto);
  }


  @MessagePattern({ cmd: 'list-files' })
  async list(@Payload() data: { search?: string; category?: string; date?: string; page?: number; limit?: number }) {
    const { search, category, date, page = 1, limit = 10 } = data;
    const skip = (page - 1) * limit;
    // Apenas delega para o service, sem lógica de filtro aqui
    return this.fileSystemService.searchFile({ search, category, date, skip, limit });
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
      return {success: false, message: `Erro interno do servidor: ${err}`}
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

  @MessagePattern({cmd: 'fix-files'})
    async fixFiles(@Payload() id: number) {
      try{
        // console.log('Rota acionada...')
        // console.log(`Payload recebido: ${data}`)

        const file = await this.fileSystemService.findOneFile(id)

      if(!file) {
        throw new NotFoundException('Arquivo não encontrado!')
      }

      // console.log('O file existe', file)

      let fixedFile = !file.fixado

      // console.log(`O valor de do file: ${file.fixado} sempre vai ser ao contrario fixedFile: ${fixedFile}`)
      
      return this.fileSystemService.fixFile(id, fixedFile)
 
      } catch(err) {
        console.log(err)
        return {success: false, message: "Falha Interna do Servidor"}
      }
    }
}
