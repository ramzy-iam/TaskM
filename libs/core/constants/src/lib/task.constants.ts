import { TaskStatusCode } from './service-provider.constants';
import { CustomTagSeverity } from './constants';

export const TaskTagSeverity: {
  [key in TaskStatusCode]: CustomTagSeverity;
} = {
  [TaskStatusCode.COMPLETED]: 'success',
  [TaskStatusCode.NOT_STARTED]: 'warning',
  [TaskStatusCode.IN_PROGRESS]: 'info',
  [TaskStatusCode.CANCELLED]: 'danger',
};
