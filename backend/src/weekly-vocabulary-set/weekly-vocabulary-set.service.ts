import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getWeek, getYear } from 'date-fns';
import { Repository } from 'typeorm';
import { AiService } from '../vocabulary/ai.service';
import { VocabularyItem } from '../vocabulary/entities/vocabulary-item.entity';
import { CreateWeeklyVocabularySetDto } from './dto/create-weekly-vocabulary-set.dto';
import { UpdateWeeklyVocabularySetDto } from './dto/update-weekly-vocabulary-set.dto';
import { WeeklyVocabularySet } from './entities/weekly-vocabulary-set.entity';

@Injectable()
export class WeeklyVocabularySetService {
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

  async findLatestSet() {
    const now = new Date();
    const weekNumber = getWeek(now);
    const year = getYear(now);

    return await this.weeklyVocabularyRepository.findOne({
      where: {
        weekNumber,
        year,
      },
    });
  }

  create(createWeeklyVocabularySetDto: CreateWeeklyVocabularySetDto) {
    return 'This action adds a new weeklyVocabularySet';
  }

  findAll() {
    return `This action returns all weeklyVocabularySet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} weeklyVocabularySet`;
  }

  update(
    id: number,
    updateWeeklyVocabularySetDto: UpdateWeeklyVocabularySetDto,
  ) {
    return `This action updates a #${id} weeklyVocabularySet`;
  }

  remove(id: number) {
    return `This action removes a #${id} weeklyVocabularySet`;
  }
}
