import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getWeek, getYear } from 'date-fns';
import { Repository } from 'typeorm';
import { AiService } from './ai.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { VocabularyItem } from './entities/vocabulary-item.entity';
import { WeeklyVocabularySet } from './entities/vocabulary-set.entity';

@Injectable()
export class VocabularyService {
  constructor(
    private aiService: AiService,
    @InjectRepository(VocabularyItem)
    private vocabularyItemRepository: Repository<VocabularyItem>,
    @InjectRepository(WeeklyVocabularySet)
    private weeklyVocabularyRepository: Repository<WeeklyVocabularySet>,
  ) {}

  async generateWeeklyVocabulary() {
    const vocabularyResponse = await this.aiService.generateVocabulary();

    const now = new Date();
    const weekNumber = getWeek(now);
    const year = getYear(now);

    const createdWeeklyVocabulary = await this.weeklyVocabularyRepository.save({
      weekNumber,
      year,
    });

    const vocabularyItemsToCreate = vocabularyResponse.map(
      (vocabularyItem: VocabularyItem) => ({
        ...vocabularyItem,
        weeklySetId: createdWeeklyVocabulary.id,
      }),
    );

    const createdVocabularyItems = await this.vocabularyItemRepository.save(
      vocabularyItemsToCreate,
    );

    return {
      weeklySetId: createdWeeklyVocabulary.id,
      createdVocabularyItems,
    };
  }

  create(createVocabularyDto: CreateVocabularyDto) {
    return 'This action adds a new vocabulary';
  }

  findAll() {
    return `This action returns all vocabulary`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vocabulary`;
  }

  update(id: number, updateVocabularyDto: UpdateVocabularyDto) {
    return `This action updates a #${id} vocabulary`;
  }

  remove(id: number) {
    return `This action removes a #${id} vocabulary`;
  }
}
