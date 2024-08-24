import { ValidationErrors } from '@angular/forms';
import { ErrorMessages } from './error.messages';
import { capitalize } from 'radash';

export const getValidatorErrorMessage = (
  validatorName: string,
  validatorErrors?: ValidationErrors,
  fieldName: string = 'This field',
): string | undefined => {
  if (validatorName === 'backend') {
    return validatorErrors as unknown as string;
  }

  const messageTemplate = ErrorMessages.get(validatorName)?.message;
  const errorKeys = ErrorMessages.get(validatorName)?.validatorErrorsKey || [];
  const args = errorKeys.map((key) => validatorErrors?.[key]);

  const templateData = {
    field: camelCaseToCapitalized(fieldName),
    ...Object.fromEntries(errorKeys.map((key, index) => [key, args[index]])),
  };

  return messageTemplate
    ? stringFormat(messageTemplate, templateData)
    : undefined;
};

const camelCaseToCapitalized = (str: string): string => {
  return capitalize(str.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase());
};

const stringFormat = (
  template: string,
  data: { [key: string]: any },
): string => {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return typeof data[key] !== 'undefined' ? data[key] : match;
  });
};
