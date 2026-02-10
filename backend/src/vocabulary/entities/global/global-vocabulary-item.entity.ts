import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GlobalWeeklyVocabularySet } from '../../../weekly-vocabulary-set/entities/global/global-weekly-vocabulary-set.entity';
import { VocabularyCategory } from '../../enums/vocabulary-item-category.enum';

@Entity('global_vocabulary_items')
export class GlobalVocabularyItem {
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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => GlobalWeeklyVocabularySet, (weeklySet) => weeklySet.items, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'weekly_set_id' })
  weeklySet: GlobalWeeklyVocabularySet;

  @Column({ name: 'weekly_set_id' })
  weeklySetId: string;
}
