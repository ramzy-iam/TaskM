import _ from 'lodash';

const convertUndefinedToNull = (obj: any): any => {
  return _.isArray(obj)
    ? _.map(obj, convertUndefinedToNull)
    : _.isObject(obj) && !_.isDate(obj)
    ? _.mapValues(obj, (value) =>
        value === undefined ? null : convertUndefinedToNull(value)
      )
    : obj;
};

export default {
  convertUndefinedToNull,
};
