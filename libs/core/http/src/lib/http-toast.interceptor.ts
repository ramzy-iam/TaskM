import { inject } from '@angular/core';
import {
  HttpEvent,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse,
  HttpInterceptorFn,
  HttpHandlerFn,
} from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastOptions } from '@TaskM/core/types';
import { ErrorMessages, HttpStatus } from '@TaskM/core/constants';
import { TOAST_OPTIONS_CONTEXT_TOKEN } from './http-context';

export const HttpToastInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const messageService = inject(MessageService);

  const handleSuccess = (
    _: HttpResponse<unknown>,
    req: HttpRequest<unknown>,
  ) => {
    const options = getToastOptions(req);
    const successOptions = options?.success;

    if (shouldDisplayToast(successOptions?.onSuccess)) {
      messageService.add({
        severity: successOptions?.severity ?? 'success',
        summary: successOptions?.subject ?? 'Success',
        detail: successOptions?.message ?? 'Operation successful!',
      });
    }
  };

  const handleError = async (
    error: HttpErrorResponse,
    req: HttpRequest<unknown>,
  ) => {
    const options = getToastOptions(req);
    const errorOptions = options?.error;
    const status = error.status as HttpStatus;
    const errorMessage = await getErrorMessage(error);

    if (shouldDisplayToast(errorOptions?.onError)) {
      messageService.add({
        severity: errorOptions?.severity ?? 'error',
        summary:
          errorOptions?.subject ??
          ErrorMessages[status]?.summary ??
          ErrorMessages.default.summary,
        detail:
          errorMessage ??
          errorOptions?.message ??
          ErrorMessages[status]?.detail ??
          ErrorMessages.default.detail,
      });
    }
  };

  const getToastOptions = (req: HttpRequest<unknown>): ToastOptions => {
    const context = req.context.get(TOAST_OPTIONS_CONTEXT_TOKEN);
    return context ? context : {};
  };

  const shouldDisplayToast = (displayCondition?: boolean): boolean =>
    displayCondition === undefined ? true : displayCondition;

  const getErrorMessage = async (error: HttpErrorResponse): Promise<string> => {
    const firstErrorKey = Object.keys(error.error)[0];
    if (firstErrorKey !== 'message' || error.error?.message) {
      return parseErrorMessage(
        error.error[firstErrorKey] || error.error['message'],
      );
    } else if (
      error.error instanceof Blob &&
      error.error.type === 'application/json'
    ) {
      return await parseBlobErrorMessage(error.error);
    }
    return (
      ErrorMessages[error.status as HttpStatus]?.detail ??
      ErrorMessages.default.detail
    );
  };

  const parseErrorMessage = (
    message: string | { property: string; message: string }[],
  ): string => {
    if (typeof message === 'string') return message;
    if (Array.isArray(message))
      return (
        message[0]?.property + ' ' + message[0]?.message || 'Unknown error'
      );
    return 'Unknown error';
  };

  const parseBlobErrorMessage = async (blob: Blob): Promise<string> => {
    try {
      const text = await blob.text();
      const data = JSON.parse(text);
      return data.message || 'Unknown error';
    } catch {
      return 'Unknown error';
    }
  };

  return next(request).pipe(
    map((event: HttpEvent<unknown>) => {
      if (event instanceof HttpResponse) {
        handleSuccess(event, request);
      }
      return event;
    }),
    catchError((error: HttpErrorResponse) => {
      handleError(error, request);
      return throwError(() => error);
    }),
  );
};
