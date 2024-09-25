import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Nullable, ToastOptions } from '@TaskM/core/types';
import { TOAST_HEADER_KEY } from '@TaskM/core/constants';

@Injectable({
  providedIn: 'root',
})
export class HttpBaseService {
  constructor(protected http: HttpClient) {}

  protected createHeaders(
    options?: ToastOptions,
    additionalHeaders?: { [key: string]: string },
  ): HttpHeaders {
    let headers = new HttpHeaders();

    if (options) {
      headers = headers.set(TOAST_HEADER_KEY, JSON.stringify(options));
    }

    if (additionalHeaders) {
      headers = this.addAdditionalHeaders(headers, additionalHeaders);
    }

    return headers;
  }

  private addAdditionalHeaders(
    headers: HttpHeaders,
    additionalHeaders: { [key: string]: string },
  ): HttpHeaders {
    for (const [key, value] of Object.entries(additionalHeaders)) {
      headers = headers.set(key, value);
    }
    return headers;
  }

  protected toastOptionsToHeaders(
    defaultOptions?: ToastOptions,
    toastOptions?: ToastOptions,
  ) {
    const mergedOptions: ToastOptions = {
      success: {
        ...(defaultOptions?.success ?? {}),
        ...(toastOptions?.success ?? {}),
      },
      error: {
        ...(defaultOptions?.error ?? {}),
        ...(toastOptions?.error ?? {}),
      },
    };
    return this.createHeaders(mergedOptions);
  }

  protected createHttpParams<P>(filters?: Nullable<P>): HttpParams {
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
}
