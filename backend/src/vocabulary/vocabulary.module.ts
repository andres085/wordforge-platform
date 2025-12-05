import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiService } from './ai.service';
import { GlobalVocabularyItem, UserVocabularyItem } from './entities';
import { VocabularyController } from './vocabulary.controller';
import { VocabularyService } from './vocabulary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GlobalVocabularyItem, UserVocabularyItem]),
  ],
  controllers: [VocabularyController],
  providers: [VocabularyService, AiService],
  exports: [AiService, TypeOrmModule],
})
export class VocabularyModule {}
