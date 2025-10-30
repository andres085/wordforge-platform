import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VocabularyModule } from './vocabulary/vocabulary.module';

@Module({
  imports: [
    VocabularyModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
