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
  TCREA = 'TCREA',
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
  IN_PROGRESS = 'In Progress',
  CANCELLED = 'Cancelled',
  ON_HOLD = 'On Hold',
  DELIVERED_WAITING_QA = 'Delivered & waiting QA',
  DELIVERED_CLOSED = 'Delivered & closed',
}

export enum ProjectStatusCode {
  NOT_STARTED = 'NOT_STARTED',
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD',
  DELIVERED_WAITING_QA = 'DELIVERED_WAITING_QA',
  DELIVERED_CLOSED = 'DELIVERED_CLOSED',
}

export enum TaskStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export enum TaskStatusCode {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
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

export const TASK_LABELS: { [key in keyof typeof TaskType]: string } = {
  [TaskType.TRA]: 'Translation',
  [TaskType.EDIT]: 'Editing',
  [TaskType.PROOF]: 'Proofreading',
  [TaskType.TEP]: 'Translation, Editing & Proofreading',
  [TaskType.TCREA]: 'Transcreation',
  [TaskType.TRANS]: 'Transcription',
  [TaskType.MPTE]: 'Machine Post Editing',
  [TaskType.SUBT]: 'Subtitling',
  [TaskType.DTP]: 'Desktop Publishing',
  [TaskType.VO]: 'Voice Over',
};

export const LANGUAGE_LABELS: { [key in keyof typeof Language]: string } = {
  [Language.Fr]: 'French',
  [Language.En]: 'English',

  [Language['En-Fr']]: 'English - French',
  [Language['EnUK-FrFR']]: 'English (United Kingdom) - French (France)',
  [Language['EnUK-FrCA']]: 'English (United Kingdom) - French (Canada)',
  [Language['EnUS-FrFR']]: 'English (United States) - French (France)',
  [Language['EnUS-FrCA']]: 'English (United States) - French (Canada)',

  [Language['Fr-En']]: 'French - English ',
  [Language['FrFR-EnUK']]: 'French (France) - English (United Kingdom)',
  [Language['FrFR-EnUS']]: 'French (France) - English (United States)',
  [Language['FrCA-EnUK']]: 'French (Canada) - English (United Kingdom)',
  [Language['FrCA-EnUS']]: 'French (Canada) - English (United States)',
  [Language['FrCA-EnCA']]: 'French (Canada) - English (Canada)',

  [Language['Spa-Fr']]: 'Spanish - French',
  [Language['Spa-FrFR']]: 'Spanish - French (France)',
  [Language['Spa-FrCA']]: 'Spanish - French (Canada)',

  [Language['Ger-Fr']]: 'German - French',
  [Language['Ger-FrFR']]: 'German - French (France)',
  [Language['Ger- FrCA']]: 'German - French (Canada)',
};
