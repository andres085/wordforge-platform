import { PartialType } from '@nestjs/mapped-types';
import { CreateWeeklyVocabularySetDto } from './create-weekly-vocabulary-set.dto';

export class UpdateWeeklyVocabularySetDto extends PartialType(CreateWeeklyVocabularySetDto) {}
