// test/helpers/test-helpers.ts
import { DataSource } from 'typeorm';
import { GlobalVocabularyItem } from '../../src/vocabulary/entities';
import { VocabularyCategory } from '../../src/vocabulary/enums/vocabulary-item-category.enum';
import { GlobalWeeklyVocabularySet } from '../../src/weekly-vocabulary-set/entities';

export class TestHelpers {
  constructor(private dataSource: DataSource) {}

  async createGlobalSetWithItems(
    weekNumber: number = 1,
    year: number = 2024,
    itemCount: number = 6,
  ): Promise<GlobalWeeklyVocabularySet> {
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
    for (let i = 0; i < itemCount; i++) {
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
