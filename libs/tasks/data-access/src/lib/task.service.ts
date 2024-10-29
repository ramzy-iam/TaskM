import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import {
  TaskDto,
  TaskPreviewDto,
  TasksFilterDto,
  PaginationDto,
  TaskRemainingLoadDto,
} from '@TaskM/core/dto';
import { Nullable, ToastOptions } from '@TaskM/core/types';
import { HttpBaseService } from '@TaskM/core/http';
import { PAGINATION, TOAST_COMMON_MESSAGES } from '@TaskM/core/constants';
import { Task } from './task';

@Injectable({
  providedIn: 'root',
})
export class TaskService extends HttpBaseService {
  private url = 'tasks';
  private changes$ = new Subject<Task>();

  triggerChanges(task: Task): void {
    this.changes$.next(task);
  }

  getChanges<T extends Task = Task>(): Subject<T> {
    return this.changes$ as unknown as Subject<T>;
  }

  create(taskDto: TaskDto, toastOptions?: ToastOptions): Observable<TaskDto> {
    const defaultToastOptions: ToastOptions = {
      success: { message: TOAST_COMMON_MESSAGES.CREATED_SUCCESSFULLY },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_CREATE },
    };

    return this.http.post<TaskDto>(this.url, taskDto, {
      headers: this.toastOptionsToHeaders(defaultToastOptions, toastOptions),
    });
  }

  update(
    id: string,
    taskDto: Partial<TaskDto>,
    toastOptions?: ToastOptions,
  ): Observable<TaskDto> {
    const defaultToastOptions: ToastOptions = {
      success: { message: TOAST_COMMON_MESSAGES.UPDATED_SUCCESSFULLY },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_UPDATE },
    };
    return this.http.patch<TaskDto>(`${this.url}/${id}`, taskDto, {
      headers: this.toastOptionsToHeaders(defaultToastOptions, toastOptions),
    });
  }

  getList(
    filters?: Nullable<TasksFilterDto>,
    toastOptions: ToastOptions = {},
  ): Observable<PaginationDto<TaskPreviewDto>> {
    const defaultToastOptions: ToastOptions = {
      success: { onSuccess: false },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_LOAD_RESOURCE },
    };

    return this.http.get<PaginationDto<TaskPreviewDto>>(this.url, {
      params: this.createHttpParams({
        page: PAGINATION.DEFAULT_PAGE,
        limit: PAGINATION.DEFAULT_LIMIT,
        ...filters,
      }),
      headers: this.toastOptionsToHeaders(defaultToastOptions, toastOptions),
    });
  }

  getOne(id: string, toastOptions?: ToastOptions): Observable<TaskDto> {
    const defaultToastOptions: ToastOptions = {
      success: { onSuccess: false },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_LOAD_RESOURCE },
    };

    return this.http.get<TaskDto>(`${this.url}/${id}`, {
      headers: this.toastOptionsToHeaders(defaultToastOptions, toastOptions),
    });
  }

  findOne(
    filters?: TasksFilterDto,
    toastOptions?: ToastOptions,
  ): Observable<TaskDto | null> {
    const defaultToastOptions: ToastOptions = {
      success: { onSuccess: false },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_LOAD_RESOURCE },
    };

    return this.http.get<TaskDto | null>(`${this.url}/one`, {
      params: this.createHttpParams(filters),
      headers: this.toastOptionsToHeaders(defaultToastOptions, toastOptions),
    });
  }

  getRemainingLoad(
    filters: TaskRemainingLoadDto,
    toastOptions?: ToastOptions,
  ): Observable<number> {
    const defaultToastOptions: ToastOptions = {
      success: { onSuccess: false },
      error: { onError: false },
    };

    return this.http.get<number>(`${this.url}/remaining-load`, {
      params: this.createHttpParams(filters),
      headers: this.toastOptionsToHeaders(defaultToastOptions, toastOptions),
    });
  }
}
