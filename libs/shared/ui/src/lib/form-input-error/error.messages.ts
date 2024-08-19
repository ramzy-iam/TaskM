export const ErrorMessages = new Map<
  string,
  { message: string; validatorErrorsKey?: string[] }
>([
  ['required', { message: '{field} is required.' }],
  [
    'minlength',
    {
      message: '{field} must be at least {requiredLength} characters long.',
      validatorErrorsKey: ['requiredLength'],
    },
  ],
  [
    'maxlength',
    {
      message: '{field} cannot be more than {requiredLength} characters long.',
      validatorErrorsKey: ['requiredLength'],
    },
  ],
  ['email', { message: '{field} must be a valid email address.' }],

  [
    'dateGreater',
    {
      message: '{startDateField} must be earlier than {endDateField}.',
      validatorErrorsKey: ['startDateField', 'endDateField'],
    },
  ],
  [
    'dateGreaterOrEqual',
    {
      message:
        '{startDateField} must be earlier than or equal to {endDateField}.',
      validatorErrorsKey: ['startDateField', 'endDateField'],
    },
  ],
  [
    'dateLess',
    {
      message: '{startDateField} must be later than {endDateField}.',
      validatorErrorsKey: ['startDateField', 'endDateField'],
    },
  ],
  [
    'dateLessOrEqual',
    {
      message:
        '{startDateField} must be later than or equal to {endDateField}.',
      validatorErrorsKey: ['startDateField', 'endDateField'],
    },
  ],
]);
