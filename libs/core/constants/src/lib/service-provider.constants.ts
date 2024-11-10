export enum Currency {
  XAF = 'XAF',
  USD = 'USD',
  EUR = 'EUR',
  CAD = 'CAD',
}

export const CurrencyToIntlNumberFormat: { [key: string]: string } = {
  XAF: 'XAF',
  USD: 'USD',
  EUR: 'EUR',
  CAD: 'CAD',
};

export enum TaskTypeCode {
  TRA = 'TRA',
  EDIT = 'EDIT',
  PROOF = 'PROOF',
  TEP = 'TEP',
  TCREA = 'TCREA',
  TRANS = 'TRANS',
  MTPE = 'MTPE',
  SUBT = 'SUBT',
  DTP = 'DTP',
  VO = 'VO',
  VOIREC = 'VOIREC',
  VIDEO = 'VIDEO',
  PHOTO = 'PHOTO',
  DESIGN = 'DESIGN',
  CWRITE = 'CWRITE',
  QA = 'QA',
  PRINT = 'PRINT',
  DESPRI = 'DESPRI',
  FBACK = 'FBACK',
}

export enum PaymentMethod {
  PAYONNEER = 'Payonneer',
  PAYPAL = 'PayPal',
  BANK = 'Bank',
  OM = 'OM',
  MOMO = 'MoMo',
  CASH = 'Cash',
}

export enum PaymentMethodCode {
  PAYONNEER = 'PAYONNEER',
  PAYPAL = 'PAYPAL',
  BANK = 'BANK',
  OM = 'OM',
  MOMO = 'MOMO',
  CASH = 'CASH',
}

export enum LoadUnit {
  WORD = 'word',
  PAGE = 'page',
  MINUTE = 'minute',
  HOUR = 'hour',
}

export enum ProjectStatus {
  NOT_STARTED = 'Not Started',
  DELIVERED = 'Delivered',
  IN_PROGRESS = 'In Progress',
  CANCELLED = 'Cancelled',
  ON_HOLD = 'On Hold',
  WAITING_QA = 'Waiting QA',
  CLOSED = 'Closed',
  QA_ING = 'QAing',
}

export enum ProjectStatusCode {
  NOT_STARTED = 'NOT_STARTED',
  DELIVERED = 'DELIVERED',
  IN_PROGRESS = 'IN_PROGRESS',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD',
  WAITING_QA = 'WAITING_QA',
  CLOSED = 'CLOSED',
  QA_ING = 'QA_ING',
}

export enum TaskStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  ON_HOLD = 'On Hold',
}

export enum TaskStatusCode {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD',
}

export enum LanguageCode {
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

export const TaskType: { [key in keyof typeof TaskTypeCode]: string } = {
  [TaskTypeCode.TRA]: 'Translation',
  [TaskTypeCode.EDIT]: 'Editing',
  [TaskTypeCode.PROOF]: 'Proofreading',
  [TaskTypeCode.TEP]: 'Translation, Editing & Proofreading',
  [TaskTypeCode.TCREA]: 'Transcreation',
  [TaskTypeCode.TRANS]: 'Transcription',
  [TaskTypeCode.MTPE]: 'Machine Tanslation Post Editing',
  [TaskTypeCode.SUBT]: 'Subtitling',
  [TaskTypeCode.DTP]: 'Desktop Publishing',
  [TaskTypeCode.VO]: 'Voice Over',
  [TaskTypeCode.VOIREC]: 'Voice Recording',
  [TaskTypeCode.VIDEO]: 'Videography',
  [TaskTypeCode.PHOTO]: 'Photography',
  [TaskTypeCode.DESIGN]: 'Graphic Design',
  [TaskTypeCode.CWRITE]: 'Content Writing',
  [TaskTypeCode.QA]: 'Quality Assurance',
  [TaskTypeCode.PRINT]: 'Printing',
  [TaskTypeCode.FBACK]: 'Feedback Implementation',
  [TaskTypeCode.DESPRI]: 'Design & Printing',
};

export const Language: { [key in keyof typeof LanguageCode]: string } = {
  [LanguageCode.Fr]: 'French',
  [LanguageCode.En]: 'English',

  [LanguageCode['En-Fr']]: 'English - French',
  [LanguageCode['EnUK-FrFR']]: 'English (United Kingdom) - French (France)',
  [LanguageCode['EnUK-FrCA']]: 'English (United Kingdom) - French (Canada)',
  [LanguageCode['EnUS-FrFR']]: 'English (United States) - French (France)',
  [LanguageCode['EnUS-FrCA']]: 'English (United States) - French (Canada)',

  [LanguageCode['Fr-En']]: 'French - English ',
  [LanguageCode['FrFR-EnUK']]: 'French (France) - English (United Kingdom)',
  [LanguageCode['FrFR-EnUS']]: 'French (France) - English (United States)',
  [LanguageCode['FrCA-EnUK']]: 'French (Canada) - English (United Kingdom)',
  [LanguageCode['FrCA-EnUS']]: 'French (Canada) - English (United States)',
  [LanguageCode['FrCA-EnCA']]: 'French (Canada) - English (Canada)',

  [LanguageCode['Spa-Fr']]: 'Spanish - French',
  [LanguageCode['Spa-FrFR']]: 'Spanish - French (France)',
  [LanguageCode['Spa-FrCA']]: 'Spanish - French (Canada)',

  [LanguageCode['Ger-Fr']]: 'German - French',
  [LanguageCode['Ger-FrFR']]: 'German - French (France)',
  [LanguageCode['Ger- FrCA']]: 'German - French (Canada)',
};
