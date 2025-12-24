import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { getWeek, getYear } from 'date-fns';
import { DataSource, Repository } from 'typeorm';
import {
  GlobalVocabularyItem,
  UserVocabularyItem,
} from '../vocabulary/entities';
import { UpdateGlobalWeeklyVocabularySetDto } from './dto/global/update-global-weekly-vocabulary-set.dto';
import { GlobalWeeklyVocabularySet, UserWeeklyVocabularySet } from './entities';

@Injectable()
export class UserWeeklyVocabularySetService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(GlobalWeeklyVocabularySet)
    private globalWeeklyVocabularyRepository: Repository<GlobalWeeklyVocabularySet>,
    @InjectRepository(UserWeeklyVocabularySet)
    private userWeeklyVocabularyRepository: Repository<UserWeeklyVocabularySet>,
    @InjectRepository(UserVocabularyItem)
    private userVocabularyItemRepository: Repository<UserVocabularyItem>,
  ) {}

  async findLatestGlobalSet() {
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

  async create(userId: string) {
    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const hasLatest = await this.hasLatestUserSet(userId);
        if (hasLatest)
          throw new BadRequestException(
            "Can't generate a new set without completing the current one",
          );

        const latestGlobalSet = await this.findLatestGlobalSet();

        if (!latestGlobalSet)
          throw new NotFoundException('No active global set found');

        const createdUserSet: UserWeeklyVocabularySet =
          await transactionalEntityManager.save(UserWeeklyVocabularySet, {
            ...latestGlobalSet,
            userId,
          });

        const vocabularyItemsToCreate: UserVocabularyItem[] =
          latestGlobalSet?.items.map(
            (vocabularyItem: GlobalVocabularyItem) => ({
              ...vocabularyItem,
              weeklySetId: createdUserSet.id,
            }),
          ) as UserVocabularyItem[];

        await transactionalEntityManager.save(
          UserVocabularyItem,
          vocabularyItemsToCreate,
        );

        return createdUserSet;
      },
    );
  }

  private async hasLatestUserSet(userId: string): Promise<boolean> {
    const now = new Date();
    const weekNumber = getWeek(now);
    const year = getYear(now);

    const count = await this.userWeeklyVocabularyRepository.count({
      where: { weekNumber, year, userId },
    });

    return count > 0;
  }

  async findLatestUserSet(userId: string) {
    const now = new Date();
    const weekNumber = getWeek(now);
    const year = getYear(now);

    try {
      const latestUserSet = await this.userWeeklyVocabularyRepository.findOne({
        where: {
          weekNumber,
          year,
          userId,
        },
        relations: { items: true },
      });

      if (!latestUserSet)
        throw new NotFoundException('User latest set not found');

      return latestUserSet;
    } catch (error) {
      throw error;
    }
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
