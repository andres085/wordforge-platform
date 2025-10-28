import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { VocabularyController } from './vocabulary.controller';
import { VocabularyService } from './vocabulary.service';

@Module({
  controllers: [VocabularyController],
  providers: [VocabularyService, AiService],
})
export class VocabularyModule {}
