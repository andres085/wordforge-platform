import { PartialType } from '@nestjs/mapped-types';
import { CreateGlobalWeeklyVocabularySetDto } from './create-global-weekly-vocabulary-set.dto';

export class UpdateGlobalWeeklyVocabularySetDto extends PartialType(
  CreateGlobalWeeklyVocabularySetDto,
) {}
