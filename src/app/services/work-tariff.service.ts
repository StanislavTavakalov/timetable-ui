import {Injectable} from '@angular/core';
import {BasicHttpService} from './basic-http.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {WorkTariff} from '../model/additionals/work-tariff';

@Injectable({
  providedIn: 'root'
})
export class WorkTariffService extends BasicHttpService {

  private workTariffApiUrl = 'api/v1/work_tariffs';
  private fullUserEndpoint = environment.domain + this.workTariffApiUrl;

  public getWorkTariffs(): Observable<WorkTariff[]> {
    return this.http.get<WorkTariff[]>(this.fullUserEndpoint)
      .pipe(catchError(this.handleError));
  }

}
