import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WeeklyVocabularySet } from '../../weekly-vocabulary-set/entities/weekly-vocabulary-set.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ name: 'google_id', unique: true })
  googleId: string;

  @Column({ nullable: true })
  avatar: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => WeeklyVocabularySet, (weeklySet) => weeklySet.user)
  weeklySets: WeeklyVocabularySet[];
}
