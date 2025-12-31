import { PartialType } from '@nestjs/mapped-types';
import { UserVocabularyItem } from '../../../vocabulary/entities';
import { CreateUserWeeklyVocabularySetDto } from './create-user-weekly-vocabulary-set.dto';

export class UpdateUserWeeklyVocabularySetDto extends PartialType(
  CreateUserWeeklyVocabularySetDto,
) {
  items: UserVocabularyItem[];
}
