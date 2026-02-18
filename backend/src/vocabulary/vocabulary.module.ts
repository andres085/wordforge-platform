import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalVocabularyItem, UserVocabularyItem } from './entities';
import { SeedVocabularyItem } from './entities/seed/seed-vocabulary-item.entity';
import { SeedVocabularyItemService } from './seed-vocabulary-item.service';
import { VocabularyController } from './user-vocabulary-item.controller';
import { UserVocabularyItemService } from './user-vocabulary-item.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GlobalVocabularyItem,
      UserVocabularyItem,
      SeedVocabularyItem,
    ]),
  ],
  controllers: [VocabularyController],
  providers: [UserVocabularyItemService, SeedVocabularyItemService],
  exports: [TypeOrmModule],
})
export class VocabularyModule {}
