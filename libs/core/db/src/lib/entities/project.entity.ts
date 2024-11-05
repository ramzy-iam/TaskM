import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import {
  LanguageCode,
  LoadUnit,
  ProjectStatusCode,
  TaskTypeCode,
} from '@TaskM/core/constants';
import { Client } from './client.entity';
import { AmountColumn, DateTzColumn } from './db.decorator';
import { Task } from './task.entity';

@Entity({ name: 'Projects' })
@Unique(['poId'])
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
    enum: ProjectStatusCode,
    default: ProjectStatusCode.NOT_STARTED,
  })
  status: ProjectStatusCode;

  @Column({
    type: 'enum',
    enum: TaskTypeCode,
  })
  taskType: TaskTypeCode;

  @Column({
    type: 'enum',
    enum: LanguageCode,
  })
  lang: LanguageCode;

  @Column()
  clientPoId: string;

  /**
   * This is the internal poId
   */
  @Column()
  poId: string;

  @Column({
    type: 'decimal',
    precision: 20,
    scale: 6,
  })
  count: number;

  @AmountColumn()
  rate: number;

  @Column({
    type: 'enum',
    enum: LoadUnit,
  })
  unit: LoadUnit;

  @ManyToOne(() => Client, (client) => client.id)
  client: Client;

  @Column()
  clientId: string;

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

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
