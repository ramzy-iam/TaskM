import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import {
  ClientDto,
  ClientPreviewDto,
  ClientsFilterDto,
  PaginationDto,
} from '@TaskM/core/dto';
import { Nullable, ToastOptions } from '@TaskM/core/types';
import { HttpBaseService } from '@TaskM/core/http';
import { PAGINATION, TOAST_COMMON_MESSAGES } from '@TaskM/core/constants';
import { Client } from './client';

@Injectable({
  providedIn: 'root',
})
export class ClientService extends HttpBaseService {
  private url = 'clients';
  private changes$ = new Subject<Client>();

  triggerChanges(client: Client): void {
    this.changes$.next(client);
  }

  getChanges<T extends Client = Client>(): Subject<T> {
    return this.changes$ as unknown as Subject<T>;
  }

  create(
    clientDto: ClientDto,
    toastOptions?: ToastOptions,
  ): Observable<ClientDto> {
    const defaultToastOptions: ToastOptions = {
      success: { message: TOAST_COMMON_MESSAGES.CREATED_SUCCESSFULLY },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_CREATE },
    };

    return this.http.post<ClientDto>(this.url, clientDto, {
      context: this.buildToastContext(defaultToastOptions, toastOptions),
    });
  }

  update(
    id: string,
    clientDto: Partial<ClientDto>,
    toastOptions?: ToastOptions,
  ): Observable<ClientDto> {
    const defaultToastOptions: ToastOptions = {
      success: { message: TOAST_COMMON_MESSAGES.UPDATED_SUCCESSFULLY },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_UPDATE },
    };

    return this.http.patch<ClientDto>(`${this.url}/${id}`, clientDto, {
      context: this.buildToastContext(defaultToastOptions, toastOptions),
    });
  }

  getList(
    filters?: Nullable<ClientsFilterDto>,
    toastOptions?: ToastOptions,
  ): Observable<PaginationDto<ClientPreviewDto>> {
    const defaultToastOptions: ToastOptions = {
      success: { onSuccess: false },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_LOAD_RESOURCE },
    };

    return this.http.get<PaginationDto<ClientPreviewDto>>(this.url, {
      params: this.buildHttpParams({
        page: PAGINATION.DEFAULT_PAGE,
        limit: PAGINATION.DEFAULT_LIMIT,
        ...filters,
      }),
      context: this.buildToastContext(defaultToastOptions, toastOptions),
    });
  }

  getOne(id: string, toastOptions?: ToastOptions): Observable<ClientDto> {
    const defaultToastOptions: ToastOptions = {
      success: { onSuccess: false },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_LOAD_RESOURCE },
    };

    return this.http.get<ClientDto>(`${this.url}/${id}`, {
      context: this.buildToastContext(defaultToastOptions, toastOptions),
    });
  }

  findOne(
    filters?: ClientsFilterDto,
    toastOptions?: ToastOptions,
  ): Observable<ClientDto | null> {
    const defaultToastOptions: ToastOptions = {
      success: { onSuccess: false },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_LOAD_RESOURCE },
    };

    return this.http.get<ClientDto | null>(`${this.url}/one`, {
      params: this.buildHttpParams(filters),
      context: this.buildToastContext(defaultToastOptions, toastOptions),
    });
  }
}
