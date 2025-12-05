import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getWeek, getYear } from 'date-fns';
import { Repository } from 'typeorm';
import { AiService } from '../vocabulary/ai.service';
import { GlobalVocabularyItem } from '../vocabulary/entities/global/global-vocabulary-item.entity';
import { UpdateGlobalWeeklyVocabularySetDto } from './dto/global/update-global-weekly-vocabulary-set.dto';
import { GlobalWeeklyVocabularySet } from './entities';

@Injectable()
export class GlobalWeeklyVocabularySetService {
  constructor(
    private aiService: AiService,
    @InjectRepository(GlobalVocabularyItem)
    private globalVocabularyItemRepository: Repository<GlobalVocabularyItem>,
    @InjectRepository(GlobalWeeklyVocabularySet)
    private globalWeeklyVocabularyRepository: Repository<GlobalWeeklyVocabularySet>,
  ) {}

  async generateWeeklyVocabulary() {
    const vocabularyResponse = await this.aiService.generateVocabulary();

    const now = new Date();
    const weekNumber = getWeek(now);
    const year = getYear(now);

    const createdWeeklyVocabulary =
      await this.globalWeeklyVocabularyRepository.save({
        weekNumber,
        year,
      });

    const vocabularyItemsToCreate = vocabularyResponse.map(
      (vocabularyItem: GlobalVocabularyItem) => ({
        ...vocabularyItem,
        weeklySetId: createdWeeklyVocabulary.id,
      }),
    );

    const createdVocabularyItems =
      await this.globalVocabularyItemRepository.save(vocabularyItemsToCreate);

    return {
      weeklySetId: createdWeeklyVocabulary.id,
      createdVocabularyItems,
    };
  }

  async findLatestSet() {
    const now = new Date();
    const weekNumber = getWeek(now);
    const year = getYear(now);

    return await this.globalWeeklyVocabularyRepository.findOne({
      where: {
        weekNumber,
        year,
      },
    });
  }

  findAll() {
    return `This action returns all weeklyVocabularySet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} weeklyVocabularySet`;
  }

  update(
    id: number,
    updateWeeklyVocabularySetDto: UpdateGlobalWeeklyVocabularySetDto,
  ) {
    return `This action updates a #${id} weeklyVocabularySet`;
  }

  remove(id: number) {
    return `This action removes a #${id} weeklyVocabularySet`;
  }
}
