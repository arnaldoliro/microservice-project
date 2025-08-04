import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsBase64, IsOptional, isNotEmpty, IsBoolean, IsNumber } from 'class-validator';

export class UpdateFileDto {
  @IsNotEmpty({message: 'O ID é obrigatório'})
  @IsNumber()
  id: number

  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'O nome deve ser uma string' })
  nome: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  descricao?: string;
}
