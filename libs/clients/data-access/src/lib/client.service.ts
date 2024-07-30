import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import {
  ClientDto,
  ClientPreviewDto,
  ClientsFilterDto,
  PaginationDto,
} from '@TaskM/core/dto';

type Client = ClientPreviewDto | ClientDto;

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private url = 'clients';
  private changes$ = new Subject<Client>();

  constructor(private http: HttpClient) {}

  triggerChanges(client: Client): void {
    this.changes$.next(client);
  }

  getChanges(): Subject<Client> {
    return this.changes$;
  }

  create(clientDto: ClientDto): Observable<ClientDto> {
    return this.http.post<ClientDto>(this.url, clientDto);
  }

  update(id: string, clientDto: Partial<ClientDto>): Observable<ClientDto> {
    return this.http.patch<ClientDto>(`${this.url}/${id}`, clientDto);
  }

  getList(
    filters?: ClientsFilterDto,
  ): Observable<PaginationDto<ClientPreviewDto>> {
    return this.http.get<PaginationDto<ClientPreviewDto>>(this.url, {
      params: { ...filters },
    });
  }

  getOne(id: string): Observable<ClientDto> {
    return this.http.get<ClientDto>(`${this.url}/${id}`);
  }

  findOne(filters?: ClientsFilterDto): Observable<ClientDto | null> {
    return this.http.get<ClientDto | null>(`${this.url}/one`, {
      params: { ...filters },
    });
  }
}
