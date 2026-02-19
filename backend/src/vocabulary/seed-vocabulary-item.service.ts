import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UpdateUserVocabularyDto } from './dto';
import { SeedVocabularyItem } from './entities/seed/seed-vocabulary-item.entity';

@Injectable()
export class SeedVocabularyItemService {
  constructor(
    @InjectRepository(SeedVocabularyItem)
    private seedVocabularyItemRepository: Repository<SeedVocabularyItem>,
  ) {}

  async findRandomItemSetFromSeed() {
    return await this.seedVocabularyItemRepository
      .createQueryBuilder('seed_vocabulary_item')
      .select('DISTINCT ON(seed_vocabulary_item.category) *')
      .orderBy('category, RANDOM()')
      .getRawMany();
  }

  async findRandomItemFromSeed(searchCondition: {
    position: number;
    term: string;
    definition: string;
  }) {
    return await this.seedVocabularyItemRepository.findOne({
      where: {
        position: searchCondition.position,
        term: Not(searchCondition.term),
        definition: Not(searchCondition.definition),
      },
    });
  }

  async generateVocabularyItemFromSeed(
    userVocabularyItemDto: UpdateUserVocabularyDto,
  ) {
    return this.seedVocabularyItemRepository.findOne({
      where: {
        term: userVocabularyItemDto.term,
        definition: userVocabularyItemDto.definition,
      },
    });
  }
}
