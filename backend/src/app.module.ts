import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { VocabularyItem } from './vocabulary/entities/vocabulary-item.entity';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { WeeklyVocabularySet } from './weekly-vocabulary-set/entities/weekly-vocabulary-set.entity';
import { WeeklyVocabularySetModule } from './weekly-vocabulary-set/weekly-vocabulary-set.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    VocabularyModule,
    WeeklyVocabularySetModule,
    UserModule,
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
      entities: [VocabularyItem, WeeklyVocabularySet, User],
      synchronize: true,
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
