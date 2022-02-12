import {Injectable} from '@angular/core';
import {BasicHttpService} from './basic-http.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AcademicDegree} from '../model/additionals/academic-degree';

@Injectable({
  providedIn: 'root'
})
export class AcademicDegreeService extends BasicHttpService {

  private academicDegreeApiUrl = 'api/v1/degrees';
  private fullUserEndpoint = environment.domain + this.academicDegreeApiUrl;

  public getAcademicDegrees(): Observable<AcademicDegree[]> {
    return this.http.get<AcademicDegree[]>(this.fullUserEndpoint)
      .pipe(catchError(this.handleError));
  }

}
