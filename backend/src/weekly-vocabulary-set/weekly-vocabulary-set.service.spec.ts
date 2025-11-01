import { Test, TestingModule } from '@nestjs/testing';
import { WeeklyVocabularySetService } from './weekly-vocabulary-set.service';

describe('WeeklyVocabularySetService', () => {
  let service: WeeklyVocabularySetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeeklyVocabularySetService],
    }).compile();

    service = module.get<WeeklyVocabularySetService>(WeeklyVocabularySetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
