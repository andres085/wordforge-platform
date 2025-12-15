import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { AiService } from '../../src/vocabulary/ai.service';
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

  describe('GET /global-weekly-vocabulary-sets/latest', () => {
    it('should return 200 and the latest published set with 6 items', async () => {
      // Arrange
      await helpers.createGlobalSetWithItems(1, 2024, 6);
      await helpers.createGlobalSetWithItems(2, 2024, 6);
      const latestSet = await helpers.createGlobalSetWithItems(3, 2024, 6);

      // Act & Assert
      const response = await request(app.getHttpServer())
        .get('/global-weekly-vocabulary-sets/latest')
        .expect(200);

      expect(response.body.id).toBe(latestSet.id);
      expect(response.body.weekNumber).toBe(3);
      expect(response.body.year).toBe(2024);
      expect(response.body.items).toHaveLength(6);
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

    it('should return latest set across different years', async () => {
      // Arrange
      await helpers.createGlobalSetWithItems(52, 2023, 6);
      const latestSet = await helpers.createGlobalSetWithItems(1, 2024, 6);

      // Act & Assert
      const response = await request(app.getHttpServer())
        .get('/global-weekly-vocabulary-sets/latest')
        .expect(200);

      expect(response.body.id).toBe(latestSet.id);
      expect(response.body.year).toBe(2024);
    });
  });
});
