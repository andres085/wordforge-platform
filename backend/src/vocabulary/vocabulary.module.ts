import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiService } from './ai.service';
import { VocabularyItem } from './entities/vocabulary-item.entity';
import { VocabularyController } from './vocabulary.controller';
import { VocabularyService } from './vocabulary.service';

@Module({
  imports: [TypeOrmModule.forFeature([VocabularyItem])],
  controllers: [VocabularyController],
  providers: [VocabularyService, AiService],
  exports: [AiService, TypeOrmModule],
})
export class VocabularyModule {}
