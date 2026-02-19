import { Controller, Get } from '@nestjs/common';
import { GlobalWeeklyVocabularySetService } from './global-weekly-vocabulary-set.service';

@Controller('global-weekly-vocabulary-set')
export class GlobalWeeklyVocabularySetController {
  constructor(
    private readonly globalWeeklyVocabularySetService: GlobalWeeklyVocabularySetService,
  ) {}

  @Get('/latest')
  latestWeeklyVocabularySet() {
    return this.globalWeeklyVocabularySetService.findLatestSet();
  }

  @Get()
  weeklyVocabularySet() {
    return this.globalWeeklyVocabularySetService.generateWeeklyVocabulary();
  }
}
