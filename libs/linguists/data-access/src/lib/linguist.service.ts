import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import {
  LinguistDto,
  LinguistPreviewDto,
  LinguistsFilterDto,
  PaginationDto,
} from '@TaskM/core/dto';
import { Nullable, ToastOptions } from '@TaskM/core/types';
import { HttpBaseService } from '@TaskM/core/http';
import { PAGINATION, TOAST_COMMON_MESSAGES } from '@TaskM/core/constants';
import { Linguist } from './linguist';

@Injectable({
  providedIn: 'root',
})
export class LinguistService extends HttpBaseService {
  private url = 'linguists';
  private changes$ = new Subject<Linguist>();

  constructor(private http: HttpClient) {
    super();
  }

  triggerChanges(linguist: Linguist): void {
    this.changes$.next(linguist);
  }

  getChanges<T extends Linguist = Linguist>(): Subject<T> {
    return this.changes$ as unknown as Subject<T>;
  }

  create(
    linguistDto: LinguistDto,
    toastOptions?: ToastOptions,
  ): Observable<LinguistDto> {
    const defaultToastOptions: ToastOptions = {
      success: { message: TOAST_COMMON_MESSAGES.CREATED_SUCCESSFULLY },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_CREATE },
    };

    return this.http.post<LinguistDto>(this.url, linguistDto, {
      headers: this.toastOptionsToHeaders(defaultToastOptions, toastOptions),
    });
  }

  update(
    id: string,
    linguistDto: Partial<LinguistDto>,
    toastOptions?: ToastOptions,
  ): Observable<LinguistDto> {
    const defaultToastOptions: ToastOptions = {
      success: { message: TOAST_COMMON_MESSAGES.UPDATED_SUCCESSFULLY },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_UPDATE },
    };
    return this.http.patch<LinguistDto>(`${this.url}/${id}`, linguistDto, {
      headers: this.toastOptionsToHeaders(defaultToastOptions, toastOptions),
    });
  }

  getList(
    filters?: Nullable<LinguistsFilterDto>,
    toastOptions: ToastOptions = {},
  ): Observable<PaginationDto<LinguistPreviewDto>> {
    const defaultToastOptions: ToastOptions = {
      success: { onSuccess: false },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_LOAD_RESOURCE },
    };

    return this.http.get<PaginationDto<LinguistPreviewDto>>(this.url, {
      params: this.createHttpParams({
        page: PAGINATION.DEFAULT_PAGE,
        limit: PAGINATION.DEFAULT_LIMIT,
        ...filters,
      }),
      headers: this.toastOptionsToHeaders(defaultToastOptions, toastOptions),
    });
  }

  getOne(id: string, toastOptions?: ToastOptions): Observable<LinguistDto> {
    const defaultToastOptions: ToastOptions = {
      success: { onSuccess: false },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_LOAD_RESOURCE },
    };

    return this.http.get<LinguistDto>(`${this.url}/${id}`, {
      headers: this.toastOptionsToHeaders(defaultToastOptions, toastOptions),
    });
  }

  findOne(
    filters?: LinguistsFilterDto,
    toastOptions?: ToastOptions,
  ): Observable<LinguistDto | null> {
    const defaultToastOptions: ToastOptions = {
      success: { onSuccess: false },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_LOAD_RESOURCE },
    };

    return this.http.get<LinguistDto | null>(`${this.url}/one`, {
      params: this.createHttpParams(filters),
      headers: this.toastOptionsToHeaders(defaultToastOptions, toastOptions),
    });
  }
}
