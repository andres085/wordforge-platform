import { Test, TestingModule } from '@nestjs/testing';
import { GlobalWeeklyVocabularySetController } from './global-weekly-vocabulary-set.controller';
import { GlobalWeeklyVocabularySetService } from './global-weekly-vocabulary-set.service';

describe('WeeklyVocabularySetController', () => {
  let controller: GlobalWeeklyVocabularySetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GlobalWeeklyVocabularySetController],
      providers: [GlobalWeeklyVocabularySetService],
    }).compile();

    controller = module.get<GlobalWeeklyVocabularySetController>(
      GlobalWeeklyVocabularySetController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
