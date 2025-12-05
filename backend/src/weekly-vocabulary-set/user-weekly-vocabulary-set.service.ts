import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getWeek, getYear } from 'date-fns';
import { Repository } from 'typeorm';
import { AiService } from '../vocabulary/ai.service';
import { GlobalVocabularyItem } from '../vocabulary/entities/global/global-vocabulary-item.entity';
import { UpdateGlobalWeeklyVocabularySetDto } from './dto/global/update-global-weekly-vocabulary-set.dto';
import { GlobalWeeklyVocabularySet, UserWeeklyVocabularySet } from './entities';

@Injectable()
export class UserWeeklyVocabularySetService {
  constructor(
    private aiService: AiService,
    @InjectRepository(GlobalVocabularyItem)
    private globalVocabularyItemRepository: Repository<GlobalVocabularyItem>,
    @InjectRepository(GlobalWeeklyVocabularySet)
    private globalWeeklyVocabularyRepository: Repository<GlobalWeeklyVocabularySet>,
    @InjectRepository(GlobalWeeklyVocabularySet)
    private userWeeklyVocabularyRepository: Repository<UserWeeklyVocabularySet>,
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
    try {
      const latestGlobalSet = await this.findLatestGlobalSet();

      //Create new Set for User attach to User
      //If success, create the list of items

      console.log(latestGlobalSet);
    } catch (error) {
      console.error(error);
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
