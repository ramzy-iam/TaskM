export enum CurrencyEnum {
  USD = 'USD',
  EURO = 'EURO',
  CAD = 'CAD',
  XAF = 'XAF',
}

export enum TaskTypeEnum {
  TRA = 'TRA',
  EDIT = 'EDIT',
  PROOF = 'PROOF',
  TEP = 'TEP',
  TRCEA = 'TCREA',
  TRANS = 'TRANS',
  MPTE = 'MPTE',
  SUBT = 'SUBT',
  DTP = 'DTP',
  VO = 'VO',
}

export enum PaymentMethodEnum {
  PAYONNEER = 'Payonneer',
  PAYPAL = 'PayPal',
  BANK = 'Bank',
  OM = 'OM',
  MOMO = 'MoMo',
  CASH = 'Cash',
}

export enum UnitEnum {
  WORD = 'word',
  PAGE = 'page',
  MINUTE = 'minute',
  HOUR = 'hour',
}

export enum ProjectStatusEnum {
  DELIVERED_WAITING_QA = 'Delivered & waiting QA',
  COMPLETED = 'Completed',
  NOT_STARTED = 'Not Started',
  DELIVERED_CLOSED = 'Delivered & closed',
  IN_PROGRESS = 'In progress',
  CANCELLED = 'Cancelled',
  ON_HOLD = 'On hold',
}

export enum TaskStatusEnum {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In progress',
  COMPLETED = 'Completed',
}

export enum LanguageEnum {
  'En-Fr' = 'En-Fr',
  'EnUK-FrFR' = 'EnUK-FrFR',
  'EnUK-FrCA' = 'EnUK-FrCA',
  'EnUS-FrFR' = 'EnUS-FrFR',
  'EnUS-FrCA' = 'EnUS-FrCA',

  'Fr-En' = 'Fr-En',
  'FrFR-EnUK' = 'FrFR-EnUK',
  'FrFR-EnUS' = 'FrFR-EnUS',
  'FrCA-EnUK' = 'FrCA-EnUK',
  'FrCA-EnUS' = 'FrCA-EnUS',
  'FrCA-EnCA' = 'FrCA-EnCA',

  'Spa-Fr' = 'Spa-Fr',
  'Spa-FrFR' = 'Spa-FrFR',
  'Spa-FrCA' = 'Spa-FrCA',

  'Ger-Fr' = 'Ger-Fr',
  'Ger-FrFR' = 'Ger-FrFR',
  'Ger- FrCA' = 'Ger- FrCA',
}

export const LANGUAGES_WITH_LABEL = [
  { name: 'English - French', code: LanguageEnum['En-Fr'] },
  {
    name: 'English (United Kingdom) - French (France)',
    code: LanguageEnum['EnUK-FrFR'],
  },
  {
    name: 'English (United Kingdom) - French (Canada)',
    code: LanguageEnum['EnUK-FrCA'],
  },
  {
    name: 'English (United States) - French (France)',
    code: LanguageEnum['EnUS-FrFR'],
  },
  {
    name: 'English (United States) - French (Canada)',
    code: LanguageEnum['EnUS-FrCA'],
  },

  { name: 'French - English ', code: LanguageEnum['Fr-En'] },
  {
    name: 'French (France) - English (United Kingdom)',
    code: LanguageEnum['FrFR-EnUK'],
  },
  {
    name: 'French (France) - English (United States)',
    code: LanguageEnum['FrFR-EnUS'],
  },
  {
    name: 'French (Canada) - English (United Kingdom)',
    code: LanguageEnum['FrCA-EnUK'],
  },
  {
    name: 'French (Canada) - English (United States)',
    code: LanguageEnum['FrCA-EnUS'],
  },
  {
    name: 'French (Canada) - English (Canada)',
    code: LanguageEnum['FrCA-EnCA'],
  },

  { name: 'Spanish - French   ', code: LanguageEnum['Spa-Fr'] },
  { name: 'Spanish - French (France)   ', code: LanguageEnum['Spa-FrFR'] },
  { name: 'Spanish - French (Canada)   ', code: LanguageEnum['Spa-FrCA'] },

  { name: 'German - French   ', code: LanguageEnum['Ger-Fr'] },
  { name: 'German - French (France)   ', code: LanguageEnum['Ger-FrFR'] },
  { name: 'German - French (Canada)', code: LanguageEnum['Ger- FrCA'] },
];

export const TASK_TYPES_WITH_LABEL = [
  {
    name: 'Translation',
    code: TaskTypeEnum.TRA,
  },
  {
    name: 'Editing',
    code: TaskTypeEnum.EDIT,
  },
  {
    name: 'Proofreading',
    code: TaskTypeEnum.PROOF,
  },
  {
    name: 'Translation, Editing & Proofreading',
    code: TaskTypeEnum.TEP,
  },
  {
    name: 'Transcreation',
    code: TaskTypeEnum.TRCEA,
  },
  {
    name: 'Transcription',
    code: TaskTypeEnum.TRANS,
  },
  {
    name: 'Machine Post Editing',
    code: TaskTypeEnum.MPTE,
  },
  {
    name: 'Subtitling',
    code: TaskTypeEnum.SUBT,
  },
  {
    name: 'Desktop Publishing',
    code: TaskTypeEnum.DTP,
  },
  {
    name: 'Voice Over',
    code: TaskTypeEnum.VO,
  },
];
