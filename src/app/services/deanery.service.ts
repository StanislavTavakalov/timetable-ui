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
    return this.http.get<Deanery[]>(this.fullDeaneryEndpoint)
      .pipe(catchError(this.handleError));
  }
}
