import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiService } from './ai.service';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { VocabularyItem } from './entities/vocabulary-item.entity';

@Injectable()
export class VocabularyService {
  constructor(
    private readonly aiService: AiService,
    @InjectRepository(VocabularyItem)
    private vocabularyItemRepository: Repository<VocabularyItem>,
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

  async update(id: string, updateVocabularyDto: UpdateVocabularyDto) {
    const foundItem = await this.findOne(id);

    if (foundItem.regenerationCount >= 3)
      throw new BadRequestException(
        "Can't generate more than three vocabulary items",
      );

    const newVocabularyItem =
      await this.aiService.generateVocabularyItem(updateVocabularyDto);

    foundItem.category = newVocabularyItem.category;
    foundItem.term = newVocabularyItem.term;
    foundItem.definition = newVocabularyItem.definition;
    foundItem.example = newVocabularyItem.example;
    foundItem.regenerationCount += 1;

    return await this.vocabularyItemRepository.save(foundItem);
  }

  async updateStatus(id: string, status: boolean) {
    const foundItem = await this.findOne(id);

    foundItem.isUsed = status;
    if (status) {
      foundItem.usedAt = new Date();
    } else {
      foundItem.usedAt = null;
    }

    return await this.vocabularyItemRepository.save(foundItem);
  }
}
