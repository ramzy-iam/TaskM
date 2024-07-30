import {
  HttpRequest,
  HttpEvent,
  HttpInterceptorFn,
  HttpHandlerFn,
} from '@angular/common/http';
import process from 'process';
import { Observable } from 'rxjs';

export const baseHttpUrlInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  if (request.url.startsWith('http')) return next(request);

  const newRequest = request.clone({
    url: `${process.env.NX_API_ENDPOINT}/${request.url}`,
  });

  return next(newRequest);
};
