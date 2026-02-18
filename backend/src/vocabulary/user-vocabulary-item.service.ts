import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserVocabularyDto } from './dto';
import { UserVocabularyItem } from './entities';
import { GlobalVocabularyItem } from './entities/global/global-vocabulary-item.entity';
import { SeedVocabularyItemService } from './seed-vocabulary-item.service';

@Injectable()
export class UserVocabularyItemService {
  constructor(
    @InjectRepository(UserVocabularyItem)
    private userVocabularyItemRepository: Repository<GlobalVocabularyItem>,
    private readonly seedVocabularyItemService: SeedVocabularyItemService,
  ) {}

  async findOne(id: string) {
    const foundItem = await this.userVocabularyItemRepository.findOne({
      where: { id },
    });

    if (!foundItem) throw new NotFoundException('UserVocabularyItem not found');

    return foundItem;
  }

  async update(id: string, updateVocabularyDto: UpdateUserVocabularyDto) {
    const foundItem = (await this.findOne(id)) as UserVocabularyItem;

    if (foundItem.regenerationCount >= 3)
      throw new BadRequestException(
        "Can't generate more than three vocabulary items",
      );

    const newVocabularyItem =
      await this.seedVocabularyItemService.generateVocabularyItemFromSeed(
        updateVocabularyDto,
      );

    foundItem.category = newVocabularyItem!.category;
    foundItem.term = newVocabularyItem!.term;
    foundItem.definition = newVocabularyItem!.definition;
    foundItem.example = newVocabularyItem!.example;
    foundItem.regenerationCount += 1;

    return await this.userVocabularyItemRepository.save(foundItem);
  }

  async updateStatus(id: string, status: boolean) {
    const foundItem = (await this.findOne(id)) as UserVocabularyItem;

    foundItem.isCompleted = status;
    if (status) {
      foundItem.completedAt = new Date();
    } else {
      foundItem.completedAt = null;
    }

    return await this.userVocabularyItemRepository.save(foundItem);
  }
}
