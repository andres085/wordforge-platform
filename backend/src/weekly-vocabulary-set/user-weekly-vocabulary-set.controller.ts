import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UpdateUserVocabularyItemDto } from '../vocabulary/dto/user/update-user-vocabulary-item.dto';
import { UpdateUserWeeklyVocabularySetDto } from './dto/user/update-user-weekly-vocabulary-set.dto';
import { UserWeeklyVocabularySetService } from './user-weekly-vocabulary-set.service';

@Controller('user-weekly-vocabulary-set')
export class UserWeeklyVocabularySetController {
  constructor(
    private readonly userWeeklyVocabularySetService: UserWeeklyVocabularySetService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/latest')
  latestWeeklyVocabularySet(@Request() req: any) {
    const { userId } = req.user;
    return this.userWeeklyVocabularySetService.findLatestUserSet(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createUserWeeklyVocabularySet(@Request() req: any) {
    const { userId } = req.user;
    return this.userWeeklyVocabularySetService.create(userId);
  }

  @Get()
  findAll() {
    return this.userWeeklyVocabularySetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userWeeklyVocabularySetService.findOne(+id);
  }

  @Patch('/user-item')
  updateItem(@Body() updateUserVocabularyItemDto: UpdateUserVocabularyItemDto) {
    return this.userWeeklyVocabularySetService.rotateUserVocabularyItem(
      updateUserVocabularyItemDto,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWeeklyVocabularySetDto: UpdateUserWeeklyVocabularySetDto,
  ) {
    return this.userWeeklyVocabularySetService.update(
      id,
      updateWeeklyVocabularySetDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userWeeklyVocabularySetService.remove(+id);
  }
}
