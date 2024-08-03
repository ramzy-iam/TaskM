export type OrderType = 'ASC' | 'DESC';
export type FilterByOperator = 'AND' | 'OR';
export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type ToastSeverity = 'success' | 'info' | 'warn' | 'error';
export interface ToastOptions {
  error?: {
    severity?: ToastSeverity;

    message?: string;
    subject?: string;
    onError?: boolean;
  };
  success?: {
    severity?: ToastSeverity;

    message?: string;
    subject?: string;
    onSuccess?: boolean;
  };
}
