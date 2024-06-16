import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';

dayjs.extend(utc);
dayjs.extend(duration);

export class DayjsHelper {
  static new(date?: string | Date | dayjs.Dayjs) {
    return date ? dayjs(date).utc() : dayjs().utc();
  }
}
