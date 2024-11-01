import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  ServiceProviderDto,
  ServiceProviderPreviewDto,
  ServiceProvidersFilterDto,
  PaginationDto,
} from '@TaskM/core/dto';
import { Nullable, ToastOptions } from '@TaskM/core/types';
import { HttpBaseService } from '@TaskM/core/http';
import { PAGINATION, TOAST_COMMON_MESSAGES } from '@TaskM/core/constants';
import { ServiceProvider } from './service-provider';

@Injectable({
  providedIn: 'root',
})
export class ServiceProviderService extends HttpBaseService {
  private url = 'service-providers';
  private changes$ = new Subject<ServiceProvider>();

  triggerChanges(serviceProvider: ServiceProvider): void {
    this.changes$.next(serviceProvider);
  }

  getChanges<T extends ServiceProvider = ServiceProvider>(): Subject<T> {
    return this.changes$ as unknown as Subject<T>;
  }

  create(
    serviceProviderDto: ServiceProviderDto,
    toastOptions?: ToastOptions,
  ): Observable<ServiceProviderDto> {
    const defaultToastOptions: ToastOptions = {
      success: { message: TOAST_COMMON_MESSAGES.CREATED_SUCCESSFULLY },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_CREATE },
    };

    return this.http.post<ServiceProviderDto>(this.url, serviceProviderDto, {
      context: this.buildToastContext(defaultToastOptions, toastOptions),
    });
  }

  update(
    id: string,
    serviceProviderDto: Partial<ServiceProviderDto>,
    toastOptions?: ToastOptions,
  ): Observable<ServiceProviderDto> {
    const defaultToastOptions: ToastOptions = {
      success: { message: TOAST_COMMON_MESSAGES.UPDATED_SUCCESSFULLY },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_UPDATE },
    };
    return this.http.patch<ServiceProviderDto>(
      `${this.url}/${id}`,
      serviceProviderDto,
      {
        context: this.buildToastContext(defaultToastOptions, toastOptions),
      },
    );
  }

  getList(
    filters?: Nullable<ServiceProvidersFilterDto>,
    toastOptions?: ToastOptions,
  ): Observable<PaginationDto<ServiceProviderPreviewDto>> {
    const defaultToastOptions: ToastOptions = {
      success: { onSuccess: false },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_LOAD_RESOURCE },
    };

    return this.http.get<PaginationDto<ServiceProviderPreviewDto>>(this.url, {
      params: this.buildHttpParams({
        page: PAGINATION.DEFAULT_PAGE,
        limit: PAGINATION.DEFAULT_LIMIT,
        ...filters,
      }),
      context: this.buildToastContext(defaultToastOptions, toastOptions),
    });
  }

  getOne(
    id: string,
    toastOptions?: ToastOptions,
  ): Observable<ServiceProviderDto> {
    const defaultToastOptions: ToastOptions = {
      success: { onSuccess: false },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_LOAD_RESOURCE },
    };

    return this.http.get<ServiceProviderDto>(`${this.url}/${id}`, {
      context: this.buildToastContext(defaultToastOptions, toastOptions),
    });
  }

  findOne(
    filters?: ServiceProvidersFilterDto,
    toastOptions?: ToastOptions,
  ): Observable<ServiceProviderDto | null> {
    const defaultToastOptions: ToastOptions = {
      success: { onSuccess: false },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_LOAD_RESOURCE },
    };

    return this.http.get<ServiceProviderDto | null>(`${this.url}/one`, {
      params: this.buildHttpParams(filters),
      context: this.buildToastContext(defaultToastOptions, toastOptions),
    });
  }
}
