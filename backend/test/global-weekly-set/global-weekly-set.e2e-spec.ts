import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getWeek } from 'date-fns';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AiService } from '../../src/ai/ai.service';
import { AppModule } from '../../src/app.module';
import { TestHelpers } from '../helpers/test-helpers';
import { createMockAiService } from '../mocks/ai-service.mock';

describe('GlobalWeeklyVocabularySet API (Integration)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let helpers: TestHelpers;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AiService)
      .useValue(createMockAiService())
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
    helpers = new TestHelpers(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  beforeEach(async () => {
    await helpers.cleanDatabase();
  });

  describe('POST /global-weekly-vocabulary-set', () => {
    it('should return 200 and create a new weekly set with the correct type of values and total of items', async () => {
      const response = await request(app.getHttpServer())
        .get('/global-weekly-vocabulary-set')
        .expect(200);

      expect(response.body).toMatchObject({
        weeklySetId: expect.any(String),
      });
      expect(response.body.createdVocabularyItems.length).toEqual(6);
    });
  });

  describe('GET /global-weekly-vocabulary-set/latest', () => {
    it('should return 200 and the latest published set with 6 items', async () => {
      const now = new Date();
      const weekNumber = getWeek(now);
      const latestSet = await helpers.createGlobalSetWithItems(
        weekNumber,
        2025,
        6,
      );

      const response = await request(app.getHttpServer())
        .get('/global-weekly-vocabulary-set/latest')
        .expect(200);

      expect(response.body.id).toBe(latestSet.id);
      expect(response.body.weekNumber).toBe(weekNumber);
      expect(response.body.year).toBe(2025);
      expect(response.body.items[0]).toMatchObject({
        position: expect.any(Number),
        category: expect.any(String),
        term: expect.any(String),
        definition: expect.any(String),
        example: expect.any(String),
      });
    });

    it('should return 404 when no published sets exist', async () => {
      await request(app.getHttpServer())
        .get('/global-weekly-vocabulary-sets/latest')
        .expect(404);
    });
  });
});
