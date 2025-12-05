import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabularyModule } from '../vocabulary/vocabulary.module';
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
  ],
  controllers: [
    GlobalWeeklyVocabularySetController,
    UserWeeklyVocabularySetController,
  ],
  providers: [GlobalWeeklyVocabularySetService, UserWeeklyVocabularySetService],
})
export class WeeklyVocabularySetModule {}
