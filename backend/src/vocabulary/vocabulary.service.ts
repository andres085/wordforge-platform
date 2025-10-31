import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiService } from './ai.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { VocabularyItem } from './entities/vocabulary-item.entity';

@Injectable()
export class VocabularyService {
  constructor(
    private aiService: AiService,
    @InjectRepository(VocabularyItem)
    private vocabularyItemRepository: Repository<VocabularyItem>,
  ) {}

  async generateWeeklyVocabulary() {
    const vocabularyResponse = await this.aiService.generateVocabulary();

    const createPromises: any = [];
    for (let vocabularyItem of vocabularyResponse) {
      const newVocabularyItem = this.vocabularyItemRepository.create({
        ...vocabularyItem,
      });

      createPromises.push(
        this.vocabularyItemRepository.save(newVocabularyItem),
      );
    }

    await Promise.all(createPromises);

    return 'Items stored';
  }

  create(createVocabularyDto: CreateVocabularyDto) {
    return 'This action adds a new vocabulary';
  }

  findAll() {
    return `This action returns all vocabulary`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vocabulary`;
  }

  update(id: number, updateVocabularyDto: UpdateVocabularyDto) {
    return `This action updates a #${id} vocabulary`;
  }

  remove(id: number) {
    return `This action removes a #${id} vocabulary`;
  }
}
