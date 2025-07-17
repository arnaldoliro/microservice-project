import { BadRequestException, Body, Controller, Delete, Get, Inject, InternalServerErrorException, NotFoundException, Param, Patch, Post, Put, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices'
import { CreateFileDto } from 'apps/file-system/src/dto/create-file.dto';
import { CreateUserDto } from 'apps/service-user/dto/create-user.dto';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { Response } from 'express';
import mime from 'mime';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller()
export class AppController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
    @Inject('FILE_SYSTEM') private readonly fileService: ClientProxy
  ) {}

  // Rotas do usuário
  @Get('/users')
  async getUsers() {
    console.log('Rota /users acessada');
    const response$ = this.userServiceClient.send({ cmd: 'get-users' }, {});
    return await lastValueFrom(response$);
  }

  @Post('/user/register')
  async register(@Body() data: CreateUserDto) {
    console.log('Rota /user/register acessada');
    const response$ = this.userServiceClient.send({ cmd: 'post-user'}, data)
    const user = await lastValueFrom(response$)
    return {
      statusCode: 201,
      message: 'Usuário criado com sucesso!',
      data: user
    }
  }

  @Put('/user/update')
  async update(@Body() data: any) {
    console.log('Rota /user/update acessada');
    const response$ = this.userServiceClient.send({ cmd: 'put-user'}, data)
    const user = await lastValueFrom(response$)
    return {
      statusCode: 200,
      message: 'Usuário atualizado com sucesso!',
      data: user
    } 
  }

  @Delete('/user/delete')
  async delete(@Body() data: any) {
    console.log('Rota /user/delete acessada');
    const response$ = this.userServiceClient.send({ cmd: 'delete-user'}, data)
    const user = await lastValueFrom(response$)
    return {
      statusCode: 200,
      message: 'Usuário deletado com sucesso!',
      data: user
    }
  }

  // Rotas do Sistema de Arquivos
 @Post('upload')
  async upload(@Body() dto: CreateFileDto) {
    return this.fileService.send({ cmd: 'upload-file' }, dto).toPromise();
  }

  @Get('/files')
  async listar(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('date') date?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ){
    const payload: Record<string, any> = {
      page: Number(page),
      limit: Number(limit),
    }

    if (search?.trim()) payload.search = search.trim()
    if (category && category !== "" && category !== "Todas as categorias") payload.category = category
    if (date && !isNaN(Date.parse(date))) payload.date = date

    console.log('[Gateway] Enviando para microserviço:', payload)

    try {
      const result = await firstValueFrom(
        this.fileService.send({ cmd: 'list-files' }, payload)
      )

      return result
    } catch (err) {
      console.error('[Gateway] Erro ao chamar microserviço:', err)
      throw new InternalServerErrorException('Erro ao buscar arquivos')
    }
  }

  @Get('/files/:id/download')
  async download(@Param('id') id: number, @Res() res: Response): Promise<void> {
    const response = await firstValueFrom(
      this.fileService.send({ cmd: 'download-arquivo' }, +id)
    );

    if (!response?.conteudo) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    const buffer = Buffer.from(response.conteudo, 'base64');
    const mimeType = response.mimeType || 'application/octet-stream';

    let fileName = response.nome;
    if (!fileName.includes('.')) {
      const ext = mime.extension(mimeType);
      if (ext) fileName += '.' + ext;
    }

    console.log(`Baixando arquivo: ${fileName}, Tipo: ${mimeType}`);

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename=\"${fileName}\"`);

    res.send(buffer);
  }

  @Delete('files/:id')
  async deleteOneFile(@Param('id') id: string){
    const response = await firstValueFrom(
      this.fileService.send({ cmd: 'delete-files'}, +id)
    )
    return response
  }

  @Delete('files')
  async deleteAllFiles(){
    const response = await firstValueFrom(
      this.fileService.send({cmd: 'delete-all-files'}, {})
    )
    return response
  }
  
  @Patch('files/:id/fix')
  async fixFile(@Param('id') id: number) {
    const response = await firstValueFrom(
      this.fileService.send({ cmd: 'fix-files'}, +id)
    )
    return response
  }
}

