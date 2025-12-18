import { ProjectStatusCode } from './service-provider.constants';
import { CustomTagSeverity } from './constants';

export const ProjectTagSeverity: {
  [key in ProjectStatusCode]: CustomTagSeverity;
} = {
  [ProjectStatusCode.WAITING_QA]: 'success',
  [ProjectStatusCode.DELIVERED]: 'success',
  [ProjectStatusCode.NOT_STARTED]: 'warning',
  [ProjectStatusCode.CLOSED]: 'danger',
  [ProjectStatusCode.IN_PROGRESS]: 'info',
  [ProjectStatusCode.CANCELLED]: 'danger',
  [ProjectStatusCode.ON_HOLD]: 'danger',
  [ProjectStatusCode.QA_ING]: 'warning',
  [ProjectStatusCode.APPROVED]: 'success',
};

export const ClosedProjectStatus = [
  ProjectStatusCode.CLOSED,
  ProjectStatusCode.CANCELLED,
];
