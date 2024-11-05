import { ProjectStatusCode } from './service-provider.constants';
import { CustomTagSeverity } from './constants';

export const ProjectTagSeverity: {
  [key in ProjectStatusCode]: CustomTagSeverity;
} = {
  [ProjectStatusCode.DELIVERED_WAITING_QA]: 'success',
  [ProjectStatusCode.DELIVERED]: 'success',
  [ProjectStatusCode.NOT_STARTED]: 'info',
  [ProjectStatusCode.APPROVED_CLOSED]: 'success',
  [ProjectStatusCode.IN_PROGRESS]: 'info',
  [ProjectStatusCode.CANCELLED]: 'danger',
  [ProjectStatusCode.ON_HOLD]: 'danger',
  [ProjectStatusCode.QA_REVIEW]: 'warning',
};
