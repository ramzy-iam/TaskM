import { TaskStatusCode } from './linguist.constants';
import { CustomTagSeverity } from './constants';

export const TaskTagSeverity: {
  [key in TaskStatusCode]: CustomTagSeverity;
} = {
  [TaskStatusCode.COMPLETED]: 'success',
  [TaskStatusCode.NOT_STARTED]: 'primary',
  [TaskStatusCode.IN_PROGRESS]: 'info',
  [TaskStatusCode.CANCELLED]: 'danger',
};
