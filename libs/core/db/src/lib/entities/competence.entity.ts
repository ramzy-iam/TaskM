import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Currency, LoadUnit, TaskTypeCode } from '@TaskM/core/constants';
import { AmountColumn } from './db.decorator';
import { ServiceProvider } from './service-provider.entity';

@Entity({ name: 'Competences' })
@Unique(['serviceProvider', 'code', 'unit', 'currency', 'rate'])
export class Competence extends AppBaseEntity {
  @Column({
    type: 'enum',
    enum: TaskTypeCode,
  })
  code: TaskTypeCode;

  @AmountColumn()
  rate: number;

  @Column({
    default: true,
  })
  active: boolean;

  @Column({
    type: 'enum',
    enum: LoadUnit,
  })
  unit: LoadUnit;

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.XAF,
  })
  currency: Currency;

  @ManyToOne(() => ServiceProvider, (serviceProvider) => serviceProvider.id)
  serviceProvider: ServiceProvider;

  @Column()
  serviceProviderId: string;
}
