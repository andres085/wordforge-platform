import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { UserVocabularyItem } from './vocabulary/entities';
import { GlobalVocabularyItem } from './vocabulary/entities/global/global-vocabulary-item.entity';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import {
  GlobalWeeklyVocabularySet,
  UserWeeklyVocabularySet,
} from './weekly-vocabulary-set/entities';
import { WeeklyVocabularySetModule } from './weekly-vocabulary-set/weekly-vocabulary-set.module';

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
      entities: [
        GlobalVocabularyItem,
        UserVocabularyItem,
        GlobalWeeklyVocabularySet,
        UserWeeklyVocabularySet,
        User,
      ],
      synchronize: true,
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
