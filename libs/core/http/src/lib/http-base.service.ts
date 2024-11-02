import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpContext,
  HttpContextToken,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Nullable, ToastOptions } from '@TaskM/core/types';
import { TOAST_OPTIONS_CONTEXT_TOKEN } from './http-context';

@Injectable({
  providedIn: 'root',
})
export class HttpBaseService {
  constructor(protected http: HttpClient) {}

  protected buildHeaders(listOfHeaders: {
    [key: string]: string;
  }): HttpHeaders {
    let headers = new HttpHeaders();

    for (const [key, value] of Object.entries(listOfHeaders)) {
      headers = headers.set(key, value);
    }

    return headers;
  }

  protected buildHttpParams<P>(filters?: Nullable<P>): HttpParams {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            const truthyValues = value.filter((v) => v);
            if (truthyValues.length)
              params = params.set(key, truthyValues.join(','));
          } else {
            params = params.set(key, String(value));
          }
        }
      });
    }
    return params;
  }

  protected buildHttpContext<T>(
    contextMap: Map<HttpContextToken<T>, T>,
  ): HttpContext {
    let context = new HttpContext();

    contextMap.forEach((value, token) => {
      context = context.set(token, value);
    });

    return context;
  }

  protected buildToastContext(
    defaultOptions: ToastOptions,
    options?: ToastOptions,
  ): HttpContext {
    const contextMap = new Map();

    const mergedOptions: ToastOptions = {
      success: {
        ...(defaultOptions?.success ?? {}),
        ...(options?.success ?? {}),
      },
      error: {
        ...(defaultOptions?.error ?? {}),
        ...(options?.error ?? {}),
      },
    };

    contextMap.set(TOAST_OPTIONS_CONTEXT_TOKEN, mergedOptions);

    return this.buildHttpContext(contextMap);
  }
}
