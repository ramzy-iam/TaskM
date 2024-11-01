import { HttpContextToken } from '@angular/common/http';
import { ToastOptions } from '@TaskM/core/types';

export const TOAST_OPTIONS_CONTEXT_TOKEN = new HttpContextToken<ToastOptions>(
  () => ({
    success: {},
    error: {},
  }),
);
