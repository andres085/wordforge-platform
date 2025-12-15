import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USER', 'user'),
        password: configService.get('DB_PASSWORD', 'user'),
        database: configService.get('DB_NAME', 'wordforge'),
        entities: [
          GlobalVocabularyItem,
          UserVocabularyItem,
          GlobalWeeklyVocabularySet,
          UserWeeklyVocabularySet,
          User,
        ],
        synchronize: configService.get('DB_SYNC', true),
      }),
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
