import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UpdateGlobalWeeklyVocabularySetDto } from './dto/global/update-global-weekly-vocabulary-set.dto';
import { GlobalWeeklyVocabularySetService } from './global-weekly-vocabulary-set.service';

@Controller('global-weekly-vocabulary-set')
export class GlobalWeeklyVocabularySetController {
  constructor(
    private readonly globalWeeklyVocabularySetService: GlobalWeeklyVocabularySetService,
  ) {}

  @Get('/latest')
  latestWeeklyVocabularySet() {
    return this.globalWeeklyVocabularySetService.findLatestSet();
  }

  @Get()
  weeklyVocabularySet() {
    return this.globalWeeklyVocabularySetService.generateWeeklyVocabulary();
  }

  @Get()
  findAll() {
    return this.globalWeeklyVocabularySetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.globalWeeklyVocabularySetService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWeeklyVocabularySetDto: UpdateGlobalWeeklyVocabularySetDto,
  ) {
    return this.globalWeeklyVocabularySetService.update(
      +id,
      updateWeeklyVocabularySetDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.globalWeeklyVocabularySetService.remove(+id);
  }
}
