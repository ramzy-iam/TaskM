import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'CaslSubjects' })
export class CaslSubject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
