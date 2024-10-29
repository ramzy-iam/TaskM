import { AfterLoad, Column, Entity, OneToMany, Unique } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { PaymentMethodCode } from '@TaskM/core/constants';
import { Competence } from './competence.entity';
import { capitalize } from 'radash';

@Entity({ name: 'ServiceProviders' })
@Unique(['email'])
export class ServiceProvider extends AppBaseEntity {
  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @OneToMany(() => Competence, (competence) => competence.serviceProvider)
  competences: Competence[];

  @Column({
    type: 'enum',
    enum: PaymentMethodCode,
  })
  accountType: PaymentMethodCode;

  @Column()
  accountName: string;

  @Column()
  accountNumber: string;

  fullName: string;

  @AfterLoad()
  setFullName() {
    this.fullName = `${capitalize(this.firstName)} ${capitalize(this.lastName)}`;
  }
}
