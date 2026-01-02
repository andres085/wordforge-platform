import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
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
  let jwtService: JwtService;
  let configService: ConfigService;

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
    jwtService = moduleFixture.get<JwtService>(JwtService);
    configService = moduleFixture.get<ConfigService>(ConfigService);
    helpers = new TestHelpers(dataSource, jwtService, configService);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  beforeEach(async () => {
    await helpers.cleanDatabase();
  });

  describe('user-weekly-vocabulary-set', () => {
    it('should get a user set with six items', async () => {
      const { storedUser, accessToken } = await helpers.createUser();
      await helpers.createUserSetWithItems(storedUser.id);

      const response = await request(app.getHttpServer())
        .get('/user-weekly-vocabulary-set/latest')
        .set('Authorization', `Bearer ${accessToken}`);

      const { body } = response;

      expect(body.id).toBeDefined();
      expect(body.items.length).toEqual(6);
    });

    it('should create a user set', async () => {
      const { accessToken } = await helpers.createUser();
      await helpers.createGlobalSetWithItems();

      const response = await request(app.getHttpServer())
        .post('/user-weekly-vocabulary-set')
        .set('Authorization', `Bearer ${accessToken}`);

      const { body } = response;

      expect(body.id).toBeDefined();
      expect(body.items.length).toEqual(6);
    });

    it('should fail to create a user set if there is an active set', async () => {
      const { storedUser, accessToken } = await helpers.createUser();
      await helpers.createUserSetWithItems(storedUser.id);

      const response = await request(app.getHttpServer())
        .post('/user-weekly-vocabulary-set')
        .set('Authorization', `Bearer ${accessToken}`);

      const body = response.body;

      expect(body.message).toBe(
        "Can't generate a new set without completing the current one",
      );
      expect(body.statusCode).toEqual(400);
    });
  });
});
