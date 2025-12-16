import { ConflictException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { getWeek, getYear } from 'date-fns';
import { DataSource, Repository } from 'typeorm';
import { AiService } from '../vocabulary/ai.service';
import { GlobalVocabularyItem } from '../vocabulary/entities/global/global-vocabulary-item.entity';
import { UpdateGlobalWeeklyVocabularySetDto } from './dto/global/update-global-weekly-vocabulary-set.dto';
import { GlobalWeeklyVocabularySet } from './entities';

@Injectable()
export class GlobalWeeklyVocabularySetService {
  constructor(
    private readonly aiService: AiService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(GlobalVocabularyItem)
    private readonly globalVocabularyItemRepository: Repository<GlobalVocabularyItem>,
    @InjectRepository(GlobalWeeklyVocabularySet)
    private readonly globalWeeklyVocabularyRepository: Repository<GlobalWeeklyVocabularySet>,
  ) {}

  async generateWeeklyVocabulary() {
    const now = new Date();
    const weekNumber = getWeek(now);
    const year = getYear(now);

    try {
      return await this.dataSource.manager.transaction(
        async (transactionalEntityManager) => {
          const vocabularyResponse = await this.aiService.generateVocabulary();

          const createdWeeklyVocabulary = await transactionalEntityManager.save(
            GlobalWeeklyVocabularySet,
            { weekNumber, year },
          );

          const vocabularyItemsToCreate = vocabularyResponse.map(
            (vocabularyItem: GlobalVocabularyItem) => ({
              ...vocabularyItem,
              weeklySetId: createdWeeklyVocabulary.id,
            }),
          );

          const createdVocabularyItems = await transactionalEntityManager.save(
            GlobalVocabularyItem,
            vocabularyItemsToCreate,
          );

          return {
            weeklySetId: createdWeeklyVocabulary.id,
            createdVocabularyItems,
          };
        },
      );
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `Weekly set for week ${weekNumber} of year ${year} already exists`,
        );
      }
      throw error;
    }
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
