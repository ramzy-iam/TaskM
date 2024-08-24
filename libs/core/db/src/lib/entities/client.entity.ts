import { Column, Entity, Unique } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Currency, PaymentMethod } from '@TaskM/core/constants';

@Entity({ name: 'Clients' })
@Unique(['code'])
export class Client extends AppBaseEntity {
  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  paymentDueDays: number;

  @Column()
  billingEmailAddress: string;

  @Column()
  billingPeriod: string;

  @Column({
    type: 'enum',
    enum: Currency,
  })
  currency: Currency;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;
}
