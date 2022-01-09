import { Injectable } from '@angular/core';
import {BasicHttpService} from '../basic-http.service';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Wing} from '../../model/dispatcher/wing';

@Injectable({
  providedIn: 'root'
})
export class WingService extends BasicHttpService{

  private wingApiUrl = 'api/v1/wings';
  private fullEndpoint = environment.domain + this.wingApiUrl;

  public getWings(): Observable<Wing[]> {
    return this.http.get<Wing[]>(`${this.fullEndpoint}`)
      .pipe(catchError(this.handleError));
  }

  public createWing(wing: Wing): Observable<Wing> {
    return this.http.post<Wing>(`${this.fullEndpoint}`, wing)
      .pipe(catchError(this.handleError));
  }

  public updateWing(wing: Wing): Observable<Wing> {
    return this.http.put<Wing>(`${this.fullEndpoint}`, wing)
      .pipe(catchError(this.handleError));
  }

  public deleteWing(wingId: string): Observable<any> {
    return this.http.delete<any>(`${this.fullEndpoint}/${wingId}`)
      .pipe(catchError(this.handleError));
  }

  public getWingByClassroomId(classroomId: string): Observable<Wing> {
    return this.http.get<Wing[]>(`${this.fullEndpoint}/classroom/${classroomId}`)
      .pipe(catchError(this.handleError));
  }
}
