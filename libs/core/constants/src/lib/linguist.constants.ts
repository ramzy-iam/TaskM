export enum Currency {
  USD = 'USD',
  EURO = 'EURO',
  CAD = 'CAD',
  XAF = 'XAF',
}

export const CurrencyToIntlNumberFormat: { [key: string]: string } = {
  USD: 'USD',
  EURO: 'EUR',
  CAD: 'CAD',
  XAF: 'XAF',
};

export enum TaskType {
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

export enum PaymentMethod {
  PAYONNEER = 'Payonneer',
  PAYPAL = 'PayPal',
  BANK = 'Bank',
  OM = 'OM',
  MOMO = 'MoMo',
  CASH = 'Cash',
}

export enum LoadUnit {
  WORD = 'word',
  PAGE = 'page',
  MINUTE = 'minute',
  HOUR = 'hour',
}

export enum ProjectStatus {
  NOT_STARTED = 'Not Started',
  COMPLETED = 'Completed',
  IN_PROGRESS = 'In progress',
  CANCELLED = 'Cancelled',
  ON_HOLD = 'On Hold',
  DELIVERED_WAITING_QA = 'Delivered & waiting QA',
  DELIVERED_CLOSED = 'Delivered & closed',
}

export enum TaskStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export enum Language {
  'Fr' = 'Fr',
  'En' = 'En',

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
  { name: 'French', value: Language.Fr },
  { name: 'English', value: Language.En },

  { name: 'English - French', value: Language['En-Fr'] },
  { name: 'English - French', value: Language['En-Fr'] },
  {
    name: 'English (United Kingdom) - French (France)',
    value: Language['EnUK-FrFR'],
  },
  {
    name: 'English (United Kingdom) - French (Canada)',
    value: Language['EnUK-FrCA'],
  },
  {
    name: 'English (United States) - French (France)',
    value: Language['EnUS-FrFR'],
  },
  {
    name: 'English (United States) - French (Canada)',
    value: Language['EnUS-FrCA'],
  },

  { name: 'French - English ', value: Language['Fr-En'] },
  {
    name: 'French (France) - English (United Kingdom)',
    value: Language['FrFR-EnUK'],
  },
  {
    name: 'French (France) - English (United States)',
    value: Language['FrFR-EnUS'],
  },
  {
    name: 'French (Canada) - English (United Kingdom)',
    value: Language['FrCA-EnUK'],
  },
  {
    name: 'French (Canada) - English (United States)',
    value: Language['FrCA-EnUS'],
  },
  {
    name: 'French (Canada) - English (Canada)',
    value: Language['FrCA-EnCA'],
  },

  { name: 'Spanish - French', value: Language['Spa-Fr'] },
  { name: 'Spanish - French (France)', value: Language['Spa-FrFR'] },
  { name: 'Spanish - French (Canada)', value: Language['Spa-FrCA'] },

  { name: 'German - French', value: Language['Ger-Fr'] },
  { name: 'German - French (France)', value: Language['Ger-FrFR'] },
  { name: 'German - French (Canada)', value: Language['Ger- FrCA'] },
];

export const TASK_TYPES_WITH_LABEL = [
  {
    name: 'Translation',
    value: TaskType.TRA,
  },
  {
    name: 'Editing',
    value: TaskType.EDIT,
  },
  {
    name: 'Proofreading',
    value: TaskType.PROOF,
  },
  {
    name: 'Translation, Editing & Proofreading',
    value: TaskType.TEP,
  },
  {
    name: 'Transcreation',
    value: TaskType.TRCEA,
  },
  {
    name: 'Transcription',
    value: TaskType.TRANS,
  },
  {
    name: 'Machine Post Editing',
    value: TaskType.MPTE,
  },
  {
    name: 'Subtitling',
    value: TaskType.SUBT,
  },
  {
    name: 'Desktop Publishing',
    value: TaskType.DTP,
  },
  {
    name: 'Voice Over',
    value: TaskType.VO,
  },
];

export const TASK_LABELS: { [key: string]: { name: string } } = {
  [TaskType.TRA]: {
    name: 'Translation',
  },
  [TaskType.EDIT]: {
    name: 'Editing',
  },
  [TaskType.PROOF]: {
    name: 'Proofreading',
  },
  [TaskType.TEP]: {
    name: 'Translation, Editing & Proofreading',
  },
  [TaskType.TRCEA]: {
    name: 'Transcreation',
  },
  [TaskType.TRANS]: {
    name: 'Transcription',
  },
  [TaskType.MPTE]: {
    name: 'Machine Post Editing',
  },
  [TaskType.SUBT]: {
    name: 'Subtitling',
  },
  [TaskType.DTP]: {
    name: 'Desktop Publishing',
  },
  [TaskType.VO]: {
    name: 'Voice Over',
  },
};

export const LANGUAGE_LABELS: { [key: string]: { name: string } } = {
  [Language.Fr]: {
    name: 'French',
  },
  [Language.En]: {
    name: 'English',
  },

  [Language['En-Fr']]: {
    name: 'English - French',
  },
  [Language['EnUK-FrFR']]: {
    name: 'English (United Kingdom) - French (France)',
  },
  [Language['EnUK-FrCA']]: {
    name: 'English (United Kingdom) - French (Canada)',
  },
  [Language['EnUS-FrFR']]: {
    name: 'English (United States) - French (France)',
  },
  [Language['EnUS-FrCA']]: {
    name: 'English (United States) - French (Canada)',
  },

  [Language['Fr-En']]: {
    name: 'French - English ',
  },
  [Language['FrFR-EnUK']]: {
    name: 'French (France) - English (United Kingdom)',
  },
  [Language['FrFR-EnUS']]: {
    name: 'French (France) - English (United States)',
  },
  [Language['FrCA-EnUK']]: {
    name: 'French (Canada) - English (United Kingdom)',
  },
  [Language['FrCA-EnUS']]: {
    name: 'French (Canada) - English (United States)',
  },
  [Language['FrCA-EnCA']]: {
    name: 'French (Canada) - English (Canada)',
  },

  [Language['Spa-Fr']]: {
    name: 'Spanish - French',
  },
  [Language['Spa-FrFR']]: {
    name: 'Spanish - French (France)',
  },
  [Language['Spa-FrCA']]: {
    name: 'Spanish - French (Canada)',
  },

  [Language['Ger-Fr']]: {
    name: 'German - French',
  },
  [Language['Ger-FrFR']]: {
    name: 'German - French (France)',
  },
  [Language['Ger- FrCA']]: {
    name: 'German - French (Canada)',
  },
};
