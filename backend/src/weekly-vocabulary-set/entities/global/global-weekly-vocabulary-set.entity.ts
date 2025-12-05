import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GlobalVocabularyItem } from '../../../vocabulary/entities';

@Entity('global_weekly_vocabulary_sets')
@Index(['year', 'weekNumber'], { unique: true })
export class GlobalWeeklyVocabularySet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  weekNumber: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => GlobalVocabularyItem, (item) => item.weeklySet, {
    cascade: true,
    eager: true,
  })
  items: GlobalVocabularyItem[];
}
