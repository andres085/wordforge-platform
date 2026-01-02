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
import { UpdateUserWeeklyVocabularySetDto } from './dto/user/update-user-weekly-vocabulary-set.dto';
import { GlobalWeeklyVocabularySet, UserWeeklyVocabularySet } from './entities';
import { UserWeeklyVocabularySetStatus } from './entities/user/user-weekly-vocabulary-set.entity';

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

  async update(
    id: string,
    updateWeeklyVocabularySetDto: UpdateUserWeeklyVocabularySetDto,
  ) {
    let activeSet = await this.userWeeklyVocabularyRepository.findOneBy({
      id,
    });

    if (!activeSet?.isActive)
      throw new NotFoundException('Set to update not found or completed');

    const userVocabularyItems = updateWeeklyVocabularySetDto.items.map(
      (item) => ({
        ...item,
        completedAt: item.isCompleted ? new Date() : null,
      }),
    );

    const updatedItems =
      await this.userVocabularyItemRepository.save(userVocabularyItems);

    const isSetComplete = updatedItems.every((item) => item.isCompleted);

    if (isSetComplete && userVocabularyItems.length === 6) {
      activeSet = await this.userWeeklyVocabularyRepository.save({
        ...updateWeeklyVocabularySetDto,
        completedAt: new Date(),
        status: UserWeeklyVocabularySetStatus.COMPLETE,
        isActive: false,
      });
    }

    // Outputs the entire data
    return { ...activeSet, items: updatedItems };
  }

  remove(id: number) {
    return `This action removes a #${id} weeklyVocabularySet`;
  }
}
