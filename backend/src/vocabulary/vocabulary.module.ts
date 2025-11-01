import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiService } from './ai.service';
import { VocabularyItem } from './entities/vocabulary-item.entity';
import { WeeklyVocabularySet } from './entities/vocabulary-set.entity';
import { VocabularyController } from './vocabulary.controller';
import { VocabularyService } from './vocabulary.service';

@Module({
  imports: [TypeOrmModule.forFeature([VocabularyItem, WeeklyVocabularySet])],
  controllers: [VocabularyController],
  providers: [VocabularyService, AiService],
})
export class VocabularyModule {}
