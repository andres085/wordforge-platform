import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { VocabularyCategory } from '../../enums/vocabulary-item-category.enum';

@Entity('seed_vocabulary_items')
export class SeedVocabularyItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  position: number;

  @Column({ type: 'enum', enum: VocabularyCategory })
  category: string;

  @Column({ type: 'varchar', length: 255 })
  term: string;

  @Column({ type: 'text' })
  definition: string;

  @Column({ type: 'text' })
  example: string;
}
