import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import {
  Language,
  LoadUnit,
  ProjectStatus,
  TaskType,
} from '@TaskM/core/constants';
import { Client } from './client.entity';
import { DateTzColumn } from './db.decorator';

@Entity({ name: 'Projects' })
@Unique(['internalPoId'])
export class Project extends AppBaseEntity {
  @Column()
  name: string;

  /**
   * This is name of the client project manager
   */
  @Column({ nullable: true })
  clientPM: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.NOT_STARTED,
  })
  status: ProjectStatus;

  @Column({
    type: 'enum',
    enum: TaskType,
  })
  taskType: TaskType;

  @Column({
    type: 'enum',
    enum: Language,
  })
  lang: Language;

  @Column()
  poId: string;

  @Column()
  internalPoId: string;

  @Column()
  count: number;

  @Column()
  reference: string;

  @Column()
  rate: number;

  @Column({
    type: 'enum',
    enum: LoadUnit,
  })
  unit: LoadUnit;

  @ManyToOne(() => Client, (client) => client.id)
  client: Client;

  @Column()
  clientId: number;

  @DateTzColumn()
  deadline: Date;

  @DateTzColumn()
  internalDeadline: Date;

  @DateTzColumn()
  receivedAt: Date;

  @DateTzColumn({ nullable: true })
  deliveredAt: Date;

  @DateTzColumn({ nullable: true })
  invoicedAt: Date;

  @DateTzColumn({ nullable: true })
  expectedPaidAt: Date;

  @DateTzColumn({ nullable: true })
  paidAt: Date;
}
