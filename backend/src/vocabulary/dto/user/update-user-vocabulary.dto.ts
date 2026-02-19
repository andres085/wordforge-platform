import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserVocabularyDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  term?: string;

  @IsString()
  @IsOptional()
  definition?: string;

  @IsBoolean()
  @IsNotEmpty()
  isCompleted: boolean;
}
