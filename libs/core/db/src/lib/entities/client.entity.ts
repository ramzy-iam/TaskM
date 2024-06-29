import { Column, Entity, Unique } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { CurrencyEnum, PaymentMethodEnum } from '@TaskM/core/constants';

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
    enum: CurrencyEnum,
  })
  currency: CurrencyEnum;

  @Column({
    type: 'enum',
    enum: PaymentMethodEnum,
  })
  paymentMethod: PaymentMethodEnum;
}
