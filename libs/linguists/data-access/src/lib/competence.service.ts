import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import {
  CompetenceDto,
  CompetencesFilterDto,
  PaginationDto,
} from '@TaskM/core/dto';
import { Nullable, ToastOptions } from '@TaskM/core/types';
import { HttpBaseService } from '@TaskM/core/http';
import { PAGINATION, TOAST_COMMON_MESSAGES } from '@TaskM/core/constants';
import { Competence } from './linguist';

@Injectable({
  providedIn: 'root',
})
export class CompetenceService extends HttpBaseService {
  private url = 'competences';
  private changes$ = new Subject<Competence>();

  triggerChanges(competence: Competence & { fromId?: string }): void {
    this.changes$.next(competence);
  }

  getChanges<
    T extends Competence & { fromId?: string } = Competence,
  >(): Subject<T> {
    return this.changes$ as unknown as Subject<T>;
  }

  create(
    competenceDto: CompetenceDto,
    toastOptions?: ToastOptions,
  ): Observable<CompetenceDto> {
    const defaultToastOptions: ToastOptions = {
      success: { message: TOAST_COMMON_MESSAGES.CREATED_SUCCESSFULLY },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_CREATE },
    };

    return this.http.post<CompetenceDto>(this.url, competenceDto, {
      headers: this.toastOptionsToHeaders(defaultToastOptions, toastOptions),
    });
  }

  update(
    id: string,
    competenceDto: Partial<CompetenceDto>,
    toastOptions?: ToastOptions,
  ): Observable<CompetenceDto> {
    const defaultToastOptions: ToastOptions = {
      success: { message: TOAST_COMMON_MESSAGES.UPDATED_SUCCESSFULLY },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_UPDATE },
    };
    return this.http.patch<CompetenceDto>(`${this.url}/${id}`, competenceDto, {
      headers: this.toastOptionsToHeaders(defaultToastOptions, toastOptions),
    });
  }

  getOne(id: string, toastOptions?: ToastOptions): Observable<CompetenceDto> {
    const defaultToastOptions: ToastOptions = {
      success: { onSuccess: false },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_LOAD_RESOURCE },
    };

    return this.http.get<CompetenceDto>(`${this.url}/${id}`, {
      headers: this.toastOptionsToHeaders(defaultToastOptions, toastOptions),
    });
  }

  getList(
    filters?: Nullable<CompetencesFilterDto>,
    toastOptions: ToastOptions = {},
  ): Observable<PaginationDto<CompetenceDto>> {
    const defaultToastOptions: ToastOptions = {
      success: { onSuccess: false },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_LOAD_RESOURCE },
    };

    return this.http.get<PaginationDto<CompetenceDto>>(this.url, {
      params: this.createHttpParams({
        page: PAGINATION.DEFAULT_PAGE,
        limit: PAGINATION.DEFAULT_LIMIT,
        ...filters,
      }),
      headers: this.toastOptionsToHeaders(defaultToastOptions, toastOptions),
    });
  }

  delete(id: string, toastOptions?: ToastOptions): Observable<CompetenceDto> {
    const defaultToastOptions: ToastOptions = {
      success: { message: TOAST_COMMON_MESSAGES.DELETED_SUCCESSFULLY },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_DELETE },
    };
    return this.http.delete<CompetenceDto>(`${this.url}/${id}`, {
      headers: this.toastOptionsToHeaders(defaultToastOptions, toastOptions),
    });
  }
}
