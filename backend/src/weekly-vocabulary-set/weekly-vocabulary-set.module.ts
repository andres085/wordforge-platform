import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabularyModule } from '../vocabulary/vocabulary.module';
import { WeeklyVocabularySet } from './entities/weekly-vocabulary-set.entity';
import { WeeklyVocabularySetController } from './weekly-vocabulary-set.controller';
import { WeeklyVocabularySetService } from './weekly-vocabulary-set.service';

@Module({
  imports: [VocabularyModule, TypeOrmModule.forFeature([WeeklyVocabularySet])],
  controllers: [WeeklyVocabularySetController],
  providers: [WeeklyVocabularySetService],
})
export class WeeklyVocabularySetModule {}
