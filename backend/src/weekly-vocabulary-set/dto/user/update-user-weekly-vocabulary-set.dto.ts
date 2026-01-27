import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { UpdateUserVocabularyDto } from '../../../vocabulary/dto';
import { CreateUserWeeklyVocabularySetDto } from './create-user-weekly-vocabulary-set.dto';

export class UpdateUserWeeklyVocabularySetDto extends PartialType(
  CreateUserWeeklyVocabularySetDto,
) {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateUserVocabularyDto)
  items: UpdateUserVocabularyDto[];
}
