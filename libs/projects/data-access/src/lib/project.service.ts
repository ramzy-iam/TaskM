import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import {
  ProjectDto,
  ProjectPreviewDto,
  ProjectsFilterDto,
  PaginationDto,
} from '@TaskM/core/dto';
import { Nullable, ToastOptions } from '@TaskM/core/types';
import { HttpBaseService } from '@TaskM/core/http';
import { TOAST_COMMON_MESSAGES } from '@TaskM/core/constants';

type Project = ProjectPreviewDto | ProjectDto;

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends HttpBaseService {
  private url = 'projects';
  private changes$ = new Subject<Project>();

  constructor(private http: HttpClient) {
    super();
  }

  triggerChanges(project: Project): void {
    this.changes$.next(project);
  }

  getChanges(): Subject<Project> {
    return this.changes$;
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
      params: filters as HttpParams,
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
      params: { ...filters } as HttpParams,
      headers: this.toastOptionsToHeaders(defaultToastOptions, toastOptions),
    });
  }
}
