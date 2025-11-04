import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabularyItem } from './vocabulary/entities/vocabulary-item.entity';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { WeeklyVocabularySet } from './weekly-vocabulary-set/entities/weekly-vocabulary-set.entity';
import { WeeklyVocabularySetModule } from './weekly-vocabulary-set/weekly-vocabulary-set.module';

@Module({
  imports: [
    VocabularyModule,
    WeeklyVocabularySetModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'user',
      database: 'wordforge',
      entities: [VocabularyItem, WeeklyVocabularySet],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
