import { ConflictException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { getWeek, getYear } from 'date-fns';
import { DataSource, Repository } from 'typeorm';
import { GlobalVocabularyItem } from '../vocabulary/entities/global/global-vocabulary-item.entity';
import { SeedVocabularyItemService } from '../vocabulary/seed-vocabulary-item.service';
import { GlobalWeeklyVocabularySet } from './entities';

@Injectable()
export class GlobalWeeklyVocabularySetService {
  constructor(
    private readonly seedVocabularyItemService: SeedVocabularyItemService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
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
          const vocabularyItemSetResponse =
            await this.seedVocabularyItemService.findRandomItemSetFromSeed();

          const createdWeeklyVocabulary = await transactionalEntityManager.save(
            GlobalWeeklyVocabularySet,
            { weekNumber, year },
          );

          const vocabularyItemsToCreate = vocabularyItemSetResponse.map(
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
}
