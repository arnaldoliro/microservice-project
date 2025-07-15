import { IsNotEmpty, IsString, IsBase64, IsOptional, isNotEmpty, IsBoolean } from 'class-validator';

export class CreateFileDto {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'O nome deve ser uma string' })
  nome: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  descricao?: string;

  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  @IsString({ message: 'A categoria deve ser uma string' })
  categoria: string;

  @IsNotEmpty({ message: 'O nome original é obrigatório' })
  @IsString({ message: 'O nome original deve ser uma string' })
  originalFileName: string;

  @IsNotEmpty({ message: 'A lotação é obrigatória' })
  @IsString({ message: 'A lotação deve ser uma string' })
  lotacao: string;

  @IsNotEmpty({ message: 'O conteúdo do arquivo é obrigatório' })
  @IsBase64()
  conteudo: string;

  @IsOptional()
  mimeType?: string;

  @IsNotEmpty({ message: 'O status de fixado precisa existir'})
  @IsBoolean()
  isPinned: boolean
}
