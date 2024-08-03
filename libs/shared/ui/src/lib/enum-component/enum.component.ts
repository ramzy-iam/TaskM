import { Currency, PaymentMethod } from '@TaskM/core/constants';

export class BaseEnumComponent {
  currencies = this.getCurrencyArray();
  paymentMethods = this.getPaymentMethodArray();

  get currencyKeys(): string[] {
    return Object.keys(Currency);
  }

  get paymentMethodKeys(): string[] {
    return Object.keys(PaymentMethod);
  }

  getCurrencyArray(): { value: string; name: string }[] {
    return this.currencyKeys.map((key) => ({
      value: Currency[key as keyof typeof Currency],
      name: Currency[key as keyof typeof Currency],
    }));
  }

  getPaymentMethodArray(): { value: string; name: string }[] {
    return this.paymentMethodKeys.map((key) => ({
      value: PaymentMethod[key as keyof typeof PaymentMethod],
      name: PaymentMethod[key as keyof typeof PaymentMethod],
    }));
  }
}
