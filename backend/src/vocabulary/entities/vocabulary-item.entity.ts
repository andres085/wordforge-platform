import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VocabularyItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  position: number;

  @Column()
  category: string;

  @Column()
  term: string;

  @Column()
  definition: string;

  @Column()
  example: string;
}
