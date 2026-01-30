import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModule } from '../ai/ai.module';
import { VocabularyModule } from '../vocabulary/vocabulary.module';
import { VocabularyService } from '../vocabulary/vocabulary.service';
import { GlobalWeeklyVocabularySet, UserWeeklyVocabularySet } from './entities';
import { GlobalWeeklyVocabularySetController } from './global-weekly-vocabulary-set.controller';
import { GlobalWeeklyVocabularySetService } from './global-weekly-vocabulary-set.service';
import { UserWeeklyVocabularySetController } from './user-weekly-vocabulary-set.controller';
import { UserWeeklyVocabularySetService } from './user-weekly-vocabulary-set.service';

@Module({
  imports: [
    VocabularyModule,
    TypeOrmModule.forFeature([
      GlobalWeeklyVocabularySet,
      UserWeeklyVocabularySet,
    ]),
    AiModule,
  ],
  controllers: [
    GlobalWeeklyVocabularySetController,
    UserWeeklyVocabularySetController,
  ],
  providers: [
    GlobalWeeklyVocabularySetService,
    UserWeeklyVocabularySetService,
    VocabularyService,
  ],
})
export class WeeklyVocabularySetModule {}
