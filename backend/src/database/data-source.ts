import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { SeedVocabularyItem } from '../vocabulary/entities/seed/seed-vocabulary-item.entity';

config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST') || 'localhost',
  port: configService.get('DB_PORT') || 5432,
  username: configService.get('DB_USERNAME') ?? 'user',
  password: configService.get('DB_PASSWORD') ?? 'user',
  database: configService.get('DB_NAME') ?? 'wordforge',
  entities: [SeedVocabularyItem],
  migrations:
    configService.get('ENV') === 'DEV'
      ? ['src/database/migrations/*{.ts,.js}']
      : ['dist/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
