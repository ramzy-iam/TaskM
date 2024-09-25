import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import {
  ProjectDto,
  ProjectPreviewDto,
  ProjectsFilterDto,
  PaginationDto,
} from '@TaskM/core/dto';
import { Nullable, ToastOptions } from '@TaskM/core/types';
import { HttpBaseService } from '@TaskM/core/http';
import { PAGINATION, TOAST_COMMON_MESSAGES } from '@TaskM/core/constants';
import { Project } from './project';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends HttpBaseService {
  private url = 'projects';
  private changes$ = new Subject<Project>();

  triggerChanges(project: Project): void {
    this.changes$.next(project);
  }

  getChanges<T extends Project = Project>(): Subject<T> {
    return this.changes$ as unknown as Subject<T>;
  }

  create(
    projectDto: ProjectDto,
    toastOptions?: ToastOptions,
  ): Observable<ProjectDto> {
    const defaultToastOptions: ToastOptions = {
      success: { message: TOAST_COMMON_MESSAGES.CREATED_SUCCESSFULLY },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_CREATE },
    };

    return this.http.post<ProjectDto>(this.url, projectDto, {
      headers: this.toastOptionsToHeaders(defaultToastOptions, toastOptions),
    });
  }

  update(
    id: string,
    projectDto: Partial<ProjectDto>,
    toastOptions?: ToastOptions,
  ): Observable<ProjectDto> {
    const defaultToastOptions: ToastOptions = {
      success: { message: TOAST_COMMON_MESSAGES.UPDATED_SUCCESSFULLY },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_UPDATE },
    };
    return this.http.patch<ProjectDto>(`${this.url}/${id}`, projectDto, {
      headers: this.toastOptionsToHeaders(defaultToastOptions, toastOptions),
    });
  }

  getList(
    filters?: Nullable<ProjectsFilterDto>,
    toastOptions: ToastOptions = {},
  ): Observable<PaginationDto<ProjectPreviewDto>> {
    const defaultToastOptions: ToastOptions = {
      success: { onSuccess: false },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_LOAD_RESOURCE },
    };

    return this.http.get<PaginationDto<ProjectPreviewDto>>(this.url, {
      params: this.createHttpParams({
        page: PAGINATION.DEFAULT_PAGE,
        limit: PAGINATION.DEFAULT_LIMIT,
        ...filters,
      }),
      headers: this.toastOptionsToHeaders(defaultToastOptions, toastOptions),
    });
  }

  getOne(id: string, toastOptions?: ToastOptions): Observable<ProjectDto> {
    const defaultToastOptions: ToastOptions = {
      success: { onSuccess: false },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_LOAD_RESOURCE },
    };

    return this.http.get<ProjectDto>(`${this.url}/${id}`, {
      headers: this.toastOptionsToHeaders(defaultToastOptions, toastOptions),
    });
  }

  findOne(
    filters?: ProjectsFilterDto,
    toastOptions?: ToastOptions,
  ): Observable<ProjectDto | null> {
    const defaultToastOptions: ToastOptions = {
      success: { onSuccess: false },
      error: { message: TOAST_COMMON_MESSAGES.FAILED_TO_LOAD_RESOURCE },
    };

    return this.http.get<ProjectDto | null>(`${this.url}/one`, {
      params: this.createHttpParams(filters),
      headers: this.toastOptionsToHeaders(defaultToastOptions, toastOptions),
    });
  }
}
