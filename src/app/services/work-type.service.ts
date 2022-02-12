import {Injectable} from '@angular/core';
import {BasicHttpService} from './basic-http.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {WorkType} from '../model/additionals/work-type';

@Injectable({
  providedIn: 'root'
})
export class WorkTypeService extends BasicHttpService {

  private workTypeApiUrl = 'api/v1/work_types';
  private fullUserEndpoint = environment.domain + this.workTypeApiUrl;

  public getWorkTypes(): Observable<WorkType[]> {
    return this.http.get<WorkType[]>(this.fullUserEndpoint)
      .pipe(catchError(this.handleError));
  }

}
