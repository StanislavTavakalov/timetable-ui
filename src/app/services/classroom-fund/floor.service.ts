import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {BasicHttpService} from '../basic-http.service';
import {Floor} from '../../model/dispatcher/floor';

@Injectable({
  providedIn: 'root'
})
export class FloorService extends BasicHttpService {

  private floorApiUrl = 'api/v1/floors';
  private fullEndpoint = environment.domain + this.floorApiUrl;

  public getFloors(): Observable<Floor[]> {
    return this.http.get<Floor[]>(`${this.fullEndpoint}`)
      .pipe(catchError(this.handleError));
  }

  public createFloor(floor: Floor): Observable<Floor> {
    return this.http.post<Floor>(`${this.fullEndpoint}`, floor)
      .pipe(catchError(this.handleError));
  }

  public updateFloor(floor: Floor): Observable<Floor> {
    return this.http.put<Floor>(`${this.fullEndpoint}`, floor)
      .pipe(catchError(this.handleError));
  }

  public deleteFloor(floorId: string): Observable<any> {
    return this.http.delete<any>(`${this.fullEndpoint}/${floorId}`)
      .pipe(catchError(this.handleError));
  }
}
