import { Column, Entity, ManyToOne } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Currency, LoadUnit, TaskType } from '@TaskM/core/constants';
import { AmountColumn } from './db.decorator';
import { Linguist } from './linguist.entity';

@Entity({ name: 'Competences' })
export class Competence extends AppBaseEntity {
  @Column({
    type: 'enum',
    enum: TaskType,
  })
  code: TaskType;

  @AmountColumn()
  rate: number;

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
