import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WeeklyVocabularySet } from '../../weekly-vocabulary-set/entities/weekly-vocabulary-set.entity';
import { VocabularyCategory } from '../enums/vocabulary-item-category.enum';

@Entity('vocabulary_items')
export class VocabularyItem {
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

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  usedAt: Date | null;

  @Column({ type: 'int', default: 0 })
  regenerationCount: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => WeeklyVocabularySet, (weeklySet) => weeklySet.items, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'weekly_set_id' })
  weeklySet: WeeklyVocabularySet;

  @Column({ name: 'weekly_set_id' })
  weeklySetId: string;
}
