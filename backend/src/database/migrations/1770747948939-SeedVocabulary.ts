import { MigrationInterface, QueryRunner } from 'typeorm';
import { SeedVocabularyItem } from '../../vocabulary/entities/seed/seed-vocabulary-item.entity';
import { binomialsSeeds } from '../data/seed-binomials.data';
import { discourseMarkersSeeds } from '../data/seed-discourse-markers.data';
import { fixedExpressionsSeeds } from '../data/seed-fixed-expressions.data';
import { phrasalVerbsSeeds } from '../data/seed-phrasal-verbs.data';
import { proverbsSeeds } from '../data/seed-proverbs.data';
import { registerSpecificSeeds } from '../data/seed-register-specific.data';

export class SeedVocabulary1770747948939 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('🌱 Seeding vocabulary data...');

    const allData = [
      ...phrasalVerbsSeeds,
      ...fixedExpressionsSeeds,
      ...binomialsSeeds,
      ...proverbsSeeds,
      ...discourseMarkersSeeds,
      ...registerSpecificSeeds,
    ];

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(SeedVocabularyItem)
      .values(allData)
      .execute();

    console.log(`✅ Successfully seeded ${allData.length} vocabulary items`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('🗑️  Removing seeded vocabulary data...');

    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(SeedVocabularyItem)
      .execute();

    console.log('✅ Seeded vocabulary data removed');
  }
}
