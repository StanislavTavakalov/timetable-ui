import {Injectable} from '@angular/core';
import {BasicHttpService} from './basic-http.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Load} from '../model/additionals/load';

@Injectable({
  providedIn: 'root'
})
export class LoadService extends BasicHttpService {

  private loadApiUrl = 'api/v1/loads';
  private fullLoadEndpoint = environment.domain + this.loadApiUrl;

  public getLoads(): Observable<Load[]> {
    return this.http.get<Load[]>(this.fullLoadEndpoint)
      .pipe(catchError(this.handleError));
  }

  public createLoad(load: Load): Observable<Load> {
    return this.http.post<Load>(`${this.fullLoadEndpoint}`, load)
      .pipe(catchError(this.handleError));
  }

  public updateLoad(load: Load): Observable<Load> {
    return this.http.put<Load>(`${this.fullLoadEndpoint}`, load)
      .pipe(catchError(this.handleError));
  }

  public deleteLoad(loadId: string): Observable<any> {
    return this.http.delete<any>(`${this.fullLoadEndpoint}/${loadId}`)
      .pipe(catchError(this.handleError));
  }

}
