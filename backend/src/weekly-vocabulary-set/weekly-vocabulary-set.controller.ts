import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateWeeklyVocabularySetDto } from './dto/create-weekly-vocabulary-set.dto';
import { UpdateWeeklyVocabularySetDto } from './dto/update-weekly-vocabulary-set.dto';
import { WeeklyVocabularySetService } from './weekly-vocabulary-set.service';

@Controller('weekly-vocabulary-set')
export class WeeklyVocabularySetController {
  constructor(
    private readonly weeklyVocabularySetService: WeeklyVocabularySetService,
  ) {}

  @Get('/latest')
  latestWeeklyVocabularySet() {
    return this.weeklyVocabularySetService.findLatestSet();
  }

  @Get()
  weeklyVocabularySet() {
    return this.weeklyVocabularySetService.generateWeeklyVocabulary();
  }

  @Post()
  create(@Body() createWeeklyVocabularySetDto: CreateWeeklyVocabularySetDto) {
    return this.weeklyVocabularySetService.create(createWeeklyVocabularySetDto);
  }

  @Get()
  findAll() {
    return this.weeklyVocabularySetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.weeklyVocabularySetService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWeeklyVocabularySetDto: UpdateWeeklyVocabularySetDto,
  ) {
    return this.weeklyVocabularySetService.update(
      +id,
      updateWeeklyVocabularySetDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weeklyVocabularySetService.remove(+id);
  }
}
