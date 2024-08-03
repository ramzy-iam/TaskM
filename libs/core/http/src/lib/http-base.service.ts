import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ToastOptions } from '@TaskM/core/types';
import { TOAST_HEADER_KEY } from '@TaskM/core/constants';

@Injectable({
  providedIn: 'root',
})
export class HttpBaseService {
  createHeaders(
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
}
