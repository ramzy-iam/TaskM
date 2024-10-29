import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import {
  LanguageCode,
  LoadUnit,
  TaskStatusCode,
  TaskTypeCode,
} from '@TaskM/core/constants';
import { DateTzColumn } from './db.decorator';
import { Competence } from './competence.entity';
import { ServiceProvider } from './service-provider.entity';
import { Project } from './project.entity';

@Entity({ name: 'Tasks' })
@Unique(['code'])
export class Task extends AppBaseEntity {
  @ManyToOne(() => ServiceProvider, (serviceProvider) => serviceProvider.id)
  serviceProvider: ServiceProvider;

  @Column()
  serviceProviderId: string;

  @ManyToOne(() => Project, (project) => project.id)
  project: Project;

  @Column()
  projectId: string;

  @ManyToOne(() => Competence, (competence) => competence.id)
  rate: Competence;

  @Column()
  rateId: string;

  @Column()
  code: string;

  @Column({
    type: 'enum',
    enum: TaskStatusCode,
    default: TaskStatusCode.NOT_STARTED,
  })
  status: TaskStatusCode;

  @Column({
    type: 'enum',
    enum: TaskTypeCode,
  })
  type: TaskTypeCode;

  @Column({
    type: 'enum',
    enum: LoadUnit,
  })
  unit: LoadUnit;

  @Column({
    type: 'enum',
    enum: LanguageCode,
  })
  lang: LanguageCode;

  @Column({
    type: 'decimal',
    precision: 20,
    scale: 6,
  })
  count: number;

  @DateTzColumn()
  assignedAt: Date;

  @DateTzColumn({ nullable: true })
  deliveredAt: Date;

  @DateTzColumn()
  deadline: Date;
}
