export enum Currency {
  USD = 'USD',
  EURO = 'EURO',
  CAD = 'CAD',
  XAF = 'XAF',
}

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

export enum Unit {
  WORD = 'word',
  PAGE = 'page',
  MINUTE = 'minute',
  HOUR = 'hour',
}

export enum ProjectStatus {
  DELIVERED_WAITING_QA = 'Delivered & waiting QA',
  COMPLETED = 'Completed',
  NOT_STARTED = 'Not Started',
  DELIVERED_CLOSED = 'Delivered & closed',
  IN_PROGRESS = 'In progress',
  CANCELLED = 'Cancelled',
  ON_HOLD = 'On hold',
}

export enum TaskStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In progress',
  COMPLETED = 'Completed',
}

export enum Language {
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
  { name: 'English - French', code: Language['En-Fr'] },
  {
    name: 'English (United Kingdom) - French (France)',
    code: Language['EnUK-FrFR'],
  },
  {
    name: 'English (United Kingdom) - French (Canada)',
    code: Language['EnUK-FrCA'],
  },
  {
    name: 'English (United States) - French (France)',
    code: Language['EnUS-FrFR'],
  },
  {
    name: 'English (United States) - French (Canada)',
    code: Language['EnUS-FrCA'],
  },

  { name: 'French - English ', code: Language['Fr-En'] },
  {
    name: 'French (France) - English (United Kingdom)',
    code: Language['FrFR-EnUK'],
  },
  {
    name: 'French (France) - English (United States)',
    code: Language['FrFR-EnUS'],
  },
  {
    name: 'French (Canada) - English (United Kingdom)',
    code: Language['FrCA-EnUK'],
  },
  {
    name: 'French (Canada) - English (United States)',
    code: Language['FrCA-EnUS'],
  },
  {
    name: 'French (Canada) - English (Canada)',
    code: Language['FrCA-EnCA'],
  },

  { name: 'Spanish - French   ', code: Language['Spa-Fr'] },
  { name: 'Spanish - French (France)   ', code: Language['Spa-FrFR'] },
  { name: 'Spanish - French (Canada)   ', code: Language['Spa-FrCA'] },

  { name: 'German - French   ', code: Language['Ger-Fr'] },
  { name: 'German - French (France)   ', code: Language['Ger-FrFR'] },
  { name: 'German - French (Canada)', code: Language['Ger- FrCA'] },
];

export const TASK_TYPES_WITH_LABEL = [
  {
    name: 'Translation',
    code: TaskType.TRA,
  },
  {
    name: 'Editing',
    code: TaskType.EDIT,
  },
  {
    name: 'Proofreading',
    code: TaskType.PROOF,
  },
  {
    name: 'Translation, Editing & Proofreading',
    code: TaskType.TEP,
  },
  {
    name: 'Transcreation',
    code: TaskType.TRCEA,
  },
  {
    name: 'Transcription',
    code: TaskType.TRANS,
  },
  {
    name: 'Machine Post Editing',
    code: TaskType.MPTE,
  },
  {
    name: 'Subtitling',
    code: TaskType.SUBT,
  },
  {
    name: 'Desktop Publishing',
    code: TaskType.DTP,
  },
  {
    name: 'Voice Over',
    code: TaskType.VO,
  },
];
