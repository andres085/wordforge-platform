import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UpdateUserVocabularyDto } from './dto';
import { UpdateGlobalVocabularyDto } from './dto/global/update-global-vocabulary.dto';
import { UserVocabularyItemService } from './user-vocabulary-item.service';

@Controller('vocabulary')
export class VocabularyController {
  constructor(
    private readonly userVocabularyItemService: UserVocabularyItemService,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userVocabularyItemService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVocabularyDto: UpdateUserVocabularyDto,
  ) {
    return this.userVocabularyItemService.update(id, updateVocabularyDto);
  }

  @Patch('/status/:id')
  updateStatus(
    @Param('id') id: string,
    @Body() updateVocabularyDto: UpdateGlobalVocabularyDto,
  ) {
    return this.userVocabularyItemService.updateStatus(
      id,
      updateVocabularyDto.isUsed,
    );
  }
}
