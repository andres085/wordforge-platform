import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UpdateGlobalVocabularyDto } from './dto/global/update-global-vocabulary.dto';
import { UpdateUserVocabularyItemDto } from './dto/user/update-user-vocabulary-item.dto';
import { VocabularyService } from './vocabulary.service';

@Controller('vocabulary')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vocabularyService.findOne(id);
  }

  @Patch(':id')
  update(@Body() updateUserVocabularyItemDto: UpdateUserVocabularyItemDto) {
    return this.vocabularyService.update(updateUserVocabularyItemDto);
  }

  @Patch('/status/:id')
  updateStatus(
    @Param('id') id: string,
    @Body() updateVocabularyDto: UpdateGlobalVocabularyDto,
  ) {
    return this.vocabularyService.updateStatus(id, updateVocabularyDto.isUsed);
  }
}
