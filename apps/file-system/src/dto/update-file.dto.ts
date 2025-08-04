import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsBase64, IsOptional, isNotEmpty, IsBoolean } from 'class-validator';

export class UpdatweFileDto {
  @IsNotEmpty({ message: 'O ID do arquivo é obrigatório' })
  @IsString({ message: 'O ID deve ser uma string' })
  id: string;
  
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'O nome deve ser uma string' })
  nome: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  descricao?: string;
}
