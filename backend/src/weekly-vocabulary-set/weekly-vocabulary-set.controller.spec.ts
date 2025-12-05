import { Test, TestingModule } from '@nestjs/testing';
import { WeeklyVocabularySetController } from './global-weekly-vocabulary-set.controller';
import { WeeklyVocabularySetService } from './global-weekly-vocabulary-set.service';

describe('WeeklyVocabularySetController', () => {
  let controller: WeeklyVocabularySetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeeklyVocabularySetController],
      providers: [WeeklyVocabularySetService],
    }).compile();

    controller = module.get<WeeklyVocabularySetController>(
      WeeklyVocabularySetController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
