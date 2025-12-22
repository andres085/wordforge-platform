import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserWeeklyVocabularySet } from '../../../weekly-vocabulary-set/entities';
import { VocabularyCategory } from '../../enums/vocabulary-item-category.enum';

@Entity('user_vocabulary_items')
export class UserVocabularyItem {
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
  isCompleted: boolean;

  @Column({ type: 'boolean', default: false })
  wasExchanged: boolean;

  @Column({ type: 'timestamp', nullable: true, default: null })
  completedAt: Date | null;

  @Column({ type: 'int', default: 0 })
  regenerationCount: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => UserWeeklyVocabularySet, (weeklySet) => weeklySet.items, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'weekly_set_id' })
  weeklySet: UserWeeklyVocabularySet;

  @Column({ name: 'weekly_set_id' })
  weeklySetId: string;
}
