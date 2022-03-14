import {Injectable} from '@angular/core';
import {BasicHttpService} from './basic-http.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {WorkTariff} from '../model/additionals/work-tariff';
import {AcademicTitle} from '../model/additionals/academic-title';

@Injectable({
  providedIn: 'root'
})
export class WorkTariffService extends BasicHttpService {

  private workTariffApiUrl = 'api/v1/work_tariffs';
  private fullWorkTariff = environment.domain + this.workTariffApiUrl;

  public getWorkTariffs(): Observable<WorkTariff[]> {
    return this.http.get<WorkTariff[]>(this.fullWorkTariff)
      .pipe(catchError(this.handleError));
  }

  public createWorkTariff(workTariff: WorkTariff): Observable<WorkTariff> {
    return this.http.post<WorkTariff>(`${this.fullWorkTariff}`, workTariff)
      .pipe(catchError(this.handleError));
  }

  public updateWorkTariff(workTariff: WorkTariff): Observable<WorkTariff> {
    return this.http.put<WorkTariff>(`${this.fullWorkTariff}`, workTariff)
      .pipe(catchError(this.handleError));
  }

  public deleteWorkTariff(workTariffId: string): Observable<any> {
    return this.http.delete<any>(`${this.fullWorkTariff}/${workTariffId}`)
      .pipe(catchError(this.handleError));
  }

}
