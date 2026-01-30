import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserVocabularyItemDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsString()
  category: string;

  @IsString()
  term: string;

  @IsString()
  definition: string;
}
