import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModule } from '../ai/ai.module';
import { GlobalVocabularyItem, UserVocabularyItem } from './entities';
import { VocabularyController } from './vocabulary.controller';
import { VocabularyService } from './vocabulary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GlobalVocabularyItem, UserVocabularyItem]),
    AiModule,
  ],
  controllers: [VocabularyController],
  providers: [VocabularyService],
  exports: [TypeOrmModule],
})
export class VocabularyModule {}
