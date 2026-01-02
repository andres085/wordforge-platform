import { PartialType } from '@nestjs/mapped-types';
import { UpdateUserVocabularyDto } from '../../../vocabulary/dto';
import { CreateUserWeeklyVocabularySetDto } from './create-user-weekly-vocabulary-set.dto';

export class UpdateUserWeeklyVocabularySetDto extends PartialType(
  CreateUserWeeklyVocabularySetDto,
) {
  items: UpdateUserVocabularyDto[];
}
