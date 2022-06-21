import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {BasicHttpService} from '../basic-http.service';
import {Building} from '../../model/dispatcher/building';

@Injectable({
  providedIn: 'root'
})
export class BuildingService extends BasicHttpService {

  private buildingApiUrl = 'api/v1/buildings';
  private fullEndpoint = environment.domain + this.buildingApiUrl;

  public getBuildings(): Observable<Building[]> {
    return this.http.get<Building[]>(`${this.fullEndpoint}`)
      .pipe(catchError(this.handleError));
  }

  public getBuilding(buildingId: string): Observable<Building> {
    return this.http.get<Building>(`${this.fullEndpoint}/${buildingId}`)
      .pipe(catchError(this.handleError));
  }

  public createBuilding(building: any): Observable<Building> {
    return this.http.post<Building>(`${this.fullEndpoint}`, building)
      .pipe(catchError(this.handleError));
  }

  public updateBuilding(building: Building): Observable<Building> {
    return this.http.put<Building>(`${this.fullEndpoint}`, building)
      .pipe(catchError(this.handleError));
  }

  public deleteBuilding(buildingId: string): Observable<any> {
    return this.http.delete<any>(`${this.fullEndpoint}/${buildingId}`)
      .pipe(catchError(this.handleError));
  }

}
