import { ProjectStatusCode } from './service-provider.constants';
import { CustomTagSeverity } from './constants';

export const ProjectTagSeverity: {
  [key in ProjectStatusCode]: CustomTagSeverity;
} = {
  [ProjectStatusCode.DELIVERED_WAITING_QA]: 'success',
  [ProjectStatusCode.COMPLETED]: 'success',
  [ProjectStatusCode.NOT_STARTED]: 'info',
  [ProjectStatusCode.DELIVERED_CLOSED]: 'warning',
  [ProjectStatusCode.IN_PROGRESS]: 'info',
  [ProjectStatusCode.CANCELLED]: 'danger',
  [ProjectStatusCode.ON_HOLD]: 'danger',
};
