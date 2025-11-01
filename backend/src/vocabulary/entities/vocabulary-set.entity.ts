import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VocabularyItem } from './vocabulary-item.entity';

@Entity('weekly_vocabulary_sets')
@Index(['year', 'weekNumber'], { unique: true })
export class WeeklyVocabularySet {
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

  @OneToMany(() => VocabularyItem, (item) => item.weeklySet, {
    cascade: true,
    eager: true,
  })
  items: VocabularyItem[];
}
