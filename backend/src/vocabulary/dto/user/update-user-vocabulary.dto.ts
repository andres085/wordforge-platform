import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserVocabularyDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsBoolean()
  @IsNotEmpty()
  isCompleted: boolean;
}
