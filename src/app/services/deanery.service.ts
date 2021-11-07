import { Injectable } from '@angular/core';
import {BasicHttpService} from './basic-http.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Deanery} from '../model/deanery';

@Injectable({
  providedIn: 'root'
})
export class DeaneryService extends BasicHttpService{

  private deaneryApiUrl = 'api/v1/deaneries';
  private fullDeaneryEndpoint = environment.domain + this.deaneryApiUrl;

  public getDeaneries(): Observable<Deanery[]> {
    return this.http.get<Deanery[]>(`${this.fullDeaneryEndpoint}`)
      .pipe(catchError(this.handleError));
  }

  public createDeanery(deanery: Deanery): Observable<Deanery> {
    return this.http.post<Deanery>(`${this.fullDeaneryEndpoint}`, deanery)
      .pipe(catchError(this.handleError));
  }

  public updateDeanery(deanery: Deanery): Observable<Deanery> {
    return this.http.put<Deanery>(`${this.fullDeaneryEndpoint}`, deanery)
      .pipe(catchError(this.handleError));
  }

  public deleteDeanery(deaneryId: string): Observable<any> {
    return this.http.delete<any>(`${this.fullDeaneryEndpoint}/${deaneryId}`)
      .pipe(catchError(this.handleError));
  }
}
