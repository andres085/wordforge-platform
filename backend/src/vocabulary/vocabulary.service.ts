import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiService } from '../ai/ai.service';
import { UpdateGlobalVocabularyDto } from './dto/global/update-global-vocabulary.dto';
import { UserVocabularyItem } from './entities';
import { GlobalVocabularyItem } from './entities/global/global-vocabulary-item.entity';
import { SeedVocabularyItem } from './entities/seed/seed-vocabulary-item.entity';

@Injectable()
export class VocabularyService {
  constructor(
    private readonly aiService: AiService,
    @InjectRepository(GlobalVocabularyItem)
    private vocabularyItemRepository: Repository<GlobalVocabularyItem>,
    @InjectRepository(SeedVocabularyItem)
    private seedVocabularyItem: Repository<SeedVocabularyItem>,
  ) {}

  async findRandomItemSetFromSeed() {
    return await this.seedVocabularyItem
      .createQueryBuilder('seed_vocabulary_item')
      .select('DISTINCT ON(seed_vocabulary_item.category) *')
      .orderBy('category, RANDOM()')
      .getRawMany();
  }

  async findOne(id: string) {
    const foundItem = await this.vocabularyItemRepository.findOne({
      where: { id },
    });

    if (!foundItem) throw new NotFoundException('VocabularyItem not found');

    return foundItem;
  }

  async update(id: string, updateVocabularyDto: UpdateGlobalVocabularyDto) {
    const foundItem = (await this.findOne(id)) as UserVocabularyItem;

    if (foundItem.regenerationCount >= 3)
      throw new BadRequestException(
        "Can't generate more than three vocabulary items",
      );

    const newVocabularyItem =
      await this.aiService.generateVocabularyItem(updateVocabularyDto);

    foundItem.category = newVocabularyItem.category;
    foundItem.term = newVocabularyItem.term;
    foundItem.definition = newVocabularyItem.definition;
    foundItem.example = newVocabularyItem.example;
    foundItem.regenerationCount += 1;

    return await this.vocabularyItemRepository.save(foundItem);
  }

  async updateStatus(id: string, status: boolean) {
    const foundItem = (await this.findOne(id)) as UserVocabularyItem;

    foundItem.isCompleted = status;
    if (status) {
      foundItem.completedAt = new Date();
    } else {
      foundItem.completedAt = null;
    }

    return await this.vocabularyItemRepository.save(foundItem);
  }
}
