import { PartialType } from '@nestjs/mapped-types';
import { CreateGlobalVocabularyDto } from './create-global-vocabulary.dto';

export class UpdateGlobalVocabularyDto extends PartialType(
  CreateGlobalVocabularyDto,
) {
  isUsed: boolean;
}
