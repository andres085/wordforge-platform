import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiService } from '../ai/ai.service';
import { UpdateUserVocabularyItemDto } from './dto/user/update-user-vocabulary-item.dto';
import { UserVocabularyItem } from './entities';

@Injectable()
export class VocabularyService {
  constructor(
    private readonly aiService: AiService,
    @InjectRepository(UserVocabularyItem)
    private vocabularyItemRepository: Repository<UserVocabularyItem>,
  ) {}

  findAll() {
    return `This action returns all vocabulary`;
  }

  async findOne(id: string) {
    const foundItem = await this.vocabularyItemRepository.findOne({
      where: { id },
    });

    if (!foundItem) throw new NotFoundException('VocabularyItem not found');

    return foundItem;
  }

  async update(updateUserVocabularyDto: UpdateUserVocabularyItemDto) {
    const foundItem = (await this.findOne(
      updateUserVocabularyDto.id,
    )) as UserVocabularyItem;

    if (foundItem.regenerationCount >= 3)
      throw new BadRequestException(
        "Can't generate more than three vocabulary items",
      );

    const newVocabularyItem = await this.aiService.generateVocabularyItem(
      updateUserVocabularyDto,
    );

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
