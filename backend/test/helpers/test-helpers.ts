// test/helpers/test-helpers.ts
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getWeek, getYear } from 'date-fns';
import { DataSource } from 'typeorm';
import { User } from '../../src/user/entities/user.entity';
import {
  GlobalVocabularyItem,
  UserVocabularyItem,
} from '../../src/vocabulary/entities';
import { SeedVocabularyItem } from '../../src/vocabulary/entities/seed/seed-vocabulary-item.entity';
import { VocabularyCategory } from '../../src/vocabulary/enums/vocabulary-item-category.enum';
import {
  GlobalWeeklyVocabularySet,
  UserWeeklyVocabularySet,
} from '../../src/weekly-vocabulary-set/entities';

export class TestHelpers {
  constructor(
    private dataSource: DataSource,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async createGlobalSetWithItems(): Promise<GlobalWeeklyVocabularySet> {
    const now = new Date();
    const weekNumber = getWeek(now);
    const year = getYear(now);

    const setRepo = this.dataSource.getRepository(GlobalWeeklyVocabularySet);
    const itemRepo = this.dataSource.getRepository(GlobalVocabularyItem);

    const globalSet = setRepo.create({
      weekNumber,
      year,
      isActive: true,
    });

    const savedSet = await setRepo.save(globalSet);

    const dummyItems = [
      {
        category: VocabularyCategory.PHRASAL_VERBS,
        term: 'come across',
        definition: 'find by chance or seem/appear',
        example: 'I came across an interesting article yesterday.',
      },
      {
        category: VocabularyCategory.FIXED_EXPRESSIONS,
        term: 'for the time being',
        definition: 'temporarily, for now',
        example: "For the time being, I'll work from home.",
      },
      {
        category: VocabularyCategory.BINOMIALS,
        term: 'pros and cons',
        definition: 'advantages and disadvantages',
        example: "Let's weigh the pros and cons before deciding.",
      },
      {
        category: VocabularyCategory.PROVERBS,
        term: 'Better late than never',
        definition: "it's better to do something late than not at all",
        example: 'I finally finished the book—better late than never!',
      },
      {
        category: VocabularyCategory.DISCOURSE_MARKERS,
        term: 'having said that',
        definition: 'however, but (used to contrast with previous statement)',
        example: 'The movie was long. Having said that, it was entertaining.',
      },
      {
        category: VocabularyCategory.REGISTER_SPECIFIC,
        term: 'get in touch',
        definition: 'contact (neutral/informal)',
        example: 'Feel free to get in touch if you have questions.',
      },
    ];

    const items: GlobalVocabularyItem[] = [];
    for (let i = 0; i < 6; i++) {
      const dummyData = dummyItems[i % dummyItems.length];

      const item = itemRepo.create({
        position: i + 1,
        category: dummyData.category,
        term:
          i >= 6
            ? `${dummyData.term} ${Math.floor(i / 6) + 1}`
            : dummyData.term,
        definition: dummyData.definition,
        example: dummyData.example,
        weeklySetId: savedSet.id,
        weeklySet: savedSet,
      });

      items.push(item);
    }

    await itemRepo.save(items);

    return (await setRepo.findOne({
      where: { id: savedSet.id },
      relations: ['items'],
    })) as GlobalWeeklyVocabularySet;
  }

  async createUserSetWithItems(
    userId: string,
  ): Promise<UserWeeklyVocabularySet> {
    const now = new Date();
    const weekNumber = getWeek(now);
    const year = getYear(now);

    const setRepo = this.dataSource.getRepository(UserWeeklyVocabularySet);
    const itemRepo = this.dataSource.getRepository(UserVocabularyItem);

    const userSet = setRepo.create({
      weekNumber,
      year,
      isActive: true,
      userId,
    });

    const savedSet = await setRepo.save(userSet);

    const dummyItems = [
      {
        category: VocabularyCategory.PHRASAL_VERBS,
        term: 'come across',
        definition: 'find by chance or seem/appear',
        example: 'I came across an interesting article yesterday.',
      },
      {
        category: VocabularyCategory.FIXED_EXPRESSIONS,
        term: 'for the time being',
        definition: 'temporarily, for now',
        example: "For the time being, I'll work from home.",
      },
      {
        category: VocabularyCategory.BINOMIALS,
        term: 'pros and cons',
        definition: 'advantages and disadvantages',
        example: "Let's weigh the pros and cons before deciding.",
      },
      {
        category: VocabularyCategory.PROVERBS,
        term: 'Better late than never',
        definition: "it's better to do something late than not at all",
        example: 'I finally finished the book—better late than never!',
      },
      {
        category: VocabularyCategory.DISCOURSE_MARKERS,
        term: 'having said that',
        definition: 'however, but (used to contrast with previous statement)',
        example: 'The movie was long. Having said that, it was entertaining.',
      },
      {
        category: VocabularyCategory.REGISTER_SPECIFIC,
        term: 'get in touch',
        definition: 'contact (neutral/informal)',
        example: 'Feel free to get in touch if you have questions.',
      },
    ];

    const items: UserVocabularyItem[] = [];
    for (let i = 0; i < 6; i++) {
      const dummyData = dummyItems[i % dummyItems.length];

      const item = itemRepo.create({
        position: i + 1,
        category: dummyData.category,
        term:
          i >= 6
            ? `${dummyData.term} ${Math.floor(i / 6) + 1}`
            : dummyData.term,
        definition: dummyData.definition,
        example: dummyData.example,
        weeklySetId: savedSet.id,
        weeklySet: savedSet,
      });

      items.push(item);
    }

    await itemRepo.save(items);

    return (await setRepo.findOne({
      where: { id: savedSet.id },
      relations: ['items'],
    })) as UserWeeklyVocabularySet;
  }

  async createUser() {
    const userRepo = this.dataSource.getRepository(User);

    const createdUser = userRepo.create({
      googleId: 'test:id',
      email: 'user@gmail.com',
      name: 'user',
      avatar: 'avatar.jpg',
    });

    const storedUser = await userRepo.save(createdUser);

    const payload = { email: createdUser.email, sub: createdUser.id };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.configService.get('JWT_SECRET'),
    });

    return {
      storedUser,
      accessToken,
    };
  }

  async generateSeedVocabularyItems() {
    const dataSeed = [
      {
        position: 1,
        category: 'Phrasal verbs',
        term: 'look forward to',
        definition: 'eagerly anticipate',
        example: "I'm really looking forward to my vacation next month.",
      },
      {
        position: 2,
        category: 'Fixed expressions',
        term: 'out of the blue',
        definition: 'suddenly and unexpectedly',
        example: 'My old friend called me out of the blue last night.',
      },
      {
        position: 3,
        category: 'Binomials',
        term: 'black and white',
        definition: 'clear and simple, without nuance',
        example: "The issue isn't as black and white as you think it is.",
      },
      {
        position: 4,
        category: 'Proverbs/sayings',
        term: 'a bird in the hand is worth two in the bush',
        definition:
          "it's better to keep what you have than risk it for something better",
        example:
          'I know the other job pays more, but a bird in the hand is worth two in the bush.',
      },
      {
        position: 5,
        category: 'Discourse markers',
        term: 'at the end of the day',
        definition: 'ultimately or in conclusion',
        example: "At the end of the day, we all want what's best for the team.",
      },
      {
        position: 6,
        category: 'Register-specific vocabulary',
        term: 'ascertain',
        definition: 'find out or determine (formal)',
        example: 'We need to ascertain the facts before making a decision.',
      },
    ];

    const seedDataRepo = this.dataSource.getRepository(SeedVocabularyItem);
    const createdSeeds = seedDataRepo.create(dataSeed);

    return await seedDataRepo.save(createdSeeds);
  }

  async cleanDatabase(): Promise<void> {
    const entities = this.dataSource.entityMetadatas;

    for (const entity of entities) {
      const repository = this.dataSource.getRepository(entity.name);
      await repository.query(
        `TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE;`,
      );
    }
  }
}
