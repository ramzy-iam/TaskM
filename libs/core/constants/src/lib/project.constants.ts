import { ProjectStatus } from './linguist.constants';
import { CustomTagSeverity } from './constants';

export const ProjectTagSeverity: { [key in ProjectStatus]: CustomTagSeverity } =
  {
    [ProjectStatus.DELIVERED_WAITING_QA]: 'success',
    [ProjectStatus.COMPLETED]: 'success',
    [ProjectStatus.NOT_STARTED]: 'warning',
    [ProjectStatus.DELIVERED_CLOSED]: 'warning',
    [ProjectStatus.IN_PROGRESS]: 'info',
    [ProjectStatus.CANCELLED]: 'danger',
    [ProjectStatus.ON_HOLD]: 'danger',
  };
