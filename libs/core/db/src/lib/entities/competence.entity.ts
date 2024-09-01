import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Currency, LoadUnit, TaskTypeCode } from '@TaskM/core/constants';
import { AmountColumn } from './db.decorator';
import { Linguist } from './linguist.entity';

@Entity({ name: 'Competences' })
@Unique(['linguist', 'code', 'unit', 'currency', 'rate'])
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

  @ManyToOne(() => Linguist, (linguist) => linguist.id)
  linguist: Linguist;

  @Column()
  linguistId: string;
}
