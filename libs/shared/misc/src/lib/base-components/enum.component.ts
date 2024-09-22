import {
  Currency,
  Language,
  LoadUnit,
  PaymentMethod,
  ProjectStatus,
  TaskStatus,
  TaskType,
} from '@TaskM/core/constants';
import { capitalize } from 'radash';

export class BaseEnumComponent {
  currencies = this.getCurrencyArray();
  paymentMethods = this.getPaymentMethodArray();
  languages = this.getLanguageArray();
  taskTypes = this.getTaskTypeArray();
  loadUnits = this.getLoadUnitArray();
  taskStatuses = this.getTaskStatusArray();
  projectStatuses = this.getProjectStatusArray();

  get currencyKeys(): string[] {
    return Object.keys(Currency);
  }

  get paymentMethodKeys(): string[] {
    return Object.keys(PaymentMethod);
  }

  get languageKeys(): string[] {
    return Object.keys(Language);
  }

  get loadUnitKeys(): string[] {
    return Object.keys(LoadUnit);
  }

  get taskStatusKeys(): string[] {
    return Object.keys(TaskStatus);
  }

  get projectStatusKeys(): string[] {
    return Object.keys(ProjectStatus);
  }

  private getLanguageArray(): { value: string; name: string }[] {
    return this.languageKeys.map((key) => ({
      value: key,
      name: Language[key as keyof typeof Language],
    }));
  }

  private getTaskTypeArray(): { value: string; name: string }[] {
    return Object.entries(TaskType).map(([key, value]) => ({
      value: key,
      name: value,
    }));
  }

  private getCurrencyArray(): { value: string; name: string }[] {
    return this.currencyKeys.map((key) => ({
      value: Currency[key as keyof typeof Currency],
      name: Currency[key as keyof typeof Currency],
    }));
  }

  private getPaymentMethodArray(): { value: string; name: string }[] {
    return this.paymentMethodKeys.map((key) => ({
      value: key,
      name: PaymentMethod[key as keyof typeof PaymentMethod],
    }));
  }

  private getLoadUnitArray(): { value: string; name: string }[] {
    return this.loadUnitKeys.map((key) => ({
      value: LoadUnit[key as keyof typeof LoadUnit],
      name: capitalize(LoadUnit[key as keyof typeof LoadUnit]),
    }));
  }

  private getTaskStatusArray(): { value: string; name: string }[] {
    return this.taskStatusKeys.map((key) => ({
      value: key,
      name: TaskStatus[key as keyof typeof TaskStatus],
    }));
  }

  private getProjectStatusArray(): { value: string; name: string }[] {
    return this.projectStatusKeys.map((key) => ({
      value: key,
      name: ProjectStatus[key as keyof typeof ProjectStatus],
    }));
  }
}
