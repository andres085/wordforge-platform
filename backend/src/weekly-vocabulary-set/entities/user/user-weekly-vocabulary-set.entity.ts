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
import { User } from '../../../user/entities/user.entity';
import { UserVocabularyItem } from '../../../vocabulary/entities';

export enum UserWeeklyVocabularySetStatus {
  ACTIVE = 'ACTIVE',
  INCOMPLETE = 'INCOMPLETE',
  COMPLETE = 'COMPLETE',
}

@Entity('user_weekly_vocabulary_sets')
@Index(['year', 'weekNumber'], { unique: true })
export class UserWeeklyVocabularySet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  weekNumber: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: UserWeeklyVocabularySetStatus,
    default: UserWeeklyVocabularySetStatus.ACTIVE,
  })
  status: UserWeeklyVocabularySetStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'timestamp' })
  completedAt: Date;

  @OneToMany(() => UserVocabularyItem, (item) => item.weeklySet, {
    cascade: true,
    eager: true,
  })
  items: UserVocabularyItem[];

  @ManyToOne(() => User, (user) => user.weeklySets, {
    cascade: true,
  })
  user: User;
}
