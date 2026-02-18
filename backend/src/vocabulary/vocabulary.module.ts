import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModule } from '../ai/ai.module';
import { GlobalVocabularyItem, UserVocabularyItem } from './entities';
import { SeedVocabularyItem } from './entities/seed/seed-vocabulary-item.entity';
import { VocabularyController } from './vocabulary.controller';
import { VocabularyService } from './vocabulary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GlobalVocabularyItem,
      UserVocabularyItem,
      SeedVocabularyItem,
    ]),
    AiModule,
  ],
  controllers: [VocabularyController],
  providers: [VocabularyService],
  exports: [TypeOrmModule],
})
export class VocabularyModule {}
