import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { VocabularyItem } from '../../vocabulary/entities/vocabulary-item.entity';

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

  @ManyToOne(() => User, (user) => user.weeklySets, {
    cascade: true,
  })
  user: User;
}
