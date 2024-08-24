import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';

dayjs.extend(utc);
dayjs.extend(duration);

export class DayjsHelper {
  static new(date?: dayjs.ConfigType, utc = true) {
    return utc ? dayjs(date, { utc: true }).utc() : dayjs(date, { utc: true });
  }

  static isBefore(
    startDate: dayjs.ConfigType,
    endDate: dayjs.ConfigType,
    unit?: dayjs.OpUnitType,
  ) {
    return DayjsHelper.new(startDate).isBefore(endDate, unit);
  }

  static isAfter(
    startDate: dayjs.ConfigType,
    endDate: dayjs.ConfigType,
    unit?: dayjs.OpUnitType,
  ) {
    return DayjsHelper.new(startDate).isAfter(endDate, unit);
  }

  static isSame(
    startDate: dayjs.ConfigType,
    endDate: dayjs.ConfigType,
    unit?: dayjs.OpUnitType,
  ) {
    return DayjsHelper.new(startDate).isSame(endDate, unit);
  }

  static isBeforeOrSame(
    startDate: dayjs.ConfigType,
    endDate: dayjs.ConfigType,
    unit?: dayjs.OpUnitType,
  ) {
    return (
      DayjsHelper.new(startDate).isBefore(endDate, unit) ||
      DayjsHelper.new(startDate).isSame(endDate, unit)
    );
  }

  static isAfterOrSame(
    startDate: dayjs.ConfigType,
    endDate: dayjs.ConfigType,
    unit?: dayjs.OpUnitType,
  ) {
    return (
      DayjsHelper.new(startDate).isAfter(endDate, unit) ||
      DayjsHelper.new(startDate).isSame(endDate, unit)
    );
  }
}
