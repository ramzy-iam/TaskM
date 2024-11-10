import { ProjectStatusCode } from './service-provider.constants';
import { CustomTagSeverity } from './constants';

export const ProjectTagSeverity: {
  [key in ProjectStatusCode]: CustomTagSeverity;
} = {
  [ProjectStatusCode.WAITING_QA]: 'success',
  [ProjectStatusCode.DELIVERED]: 'success',
  [ProjectStatusCode.NOT_STARTED]: 'info',
  [ProjectStatusCode.CLOSED]: 'danger',
  [ProjectStatusCode.IN_PROGRESS]: 'info',
  [ProjectStatusCode.CANCELLED]: 'danger',
  [ProjectStatusCode.ON_HOLD]: 'danger',
  [ProjectStatusCode.QA_ING]: 'warning',
};

export const ClosedProjectStatus = [
  ProjectStatusCode.CLOSED,
  ProjectStatusCode.CANCELLED,
];
