import {Injectable} from '@angular/core';
import {BasicHttpService} from '../basic-http.service';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AcademicDegree} from '../../model/additionals/academic-degree';
import {AcademicTitle} from '../../model/additionals/academic-title';

@Injectable({
  providedIn: 'root'
})
export class AcademicDegreeService extends BasicHttpService {

  private academicDegreeApiUrl = 'api/v1/degrees';
  private fullAcademicDegreeEndpoint = environment.domain + this.academicDegreeApiUrl;

  public getAcademicDegrees(): Observable<AcademicDegree[]> {
    return this.http.get<AcademicDegree[]>(this.fullAcademicDegreeEndpoint)
      .pipe(catchError(this.handleError));
  }

  public createAcademicDegree(academicDegree: AcademicDegree): Observable<AcademicTitle> {
    return this.http.post<AcademicDegree>(`${this.fullAcademicDegreeEndpoint}`, academicDegree)
      .pipe(catchError(this.handleError));
  }

  public updateAcademicDegree(academicDegree: AcademicDegree): Observable<AcademicTitle> {
    return this.http.put<AcademicDegree>(`${this.fullAcademicDegreeEndpoint}`, academicDegree)
      .pipe(catchError(this.handleError));
  }

  public deleteAcademicDegree(academicDegreeId: string): Observable<any> {
    return this.http.delete<any>(`${this.fullAcademicDegreeEndpoint}/${academicDegreeId}`)
      .pipe(catchError(this.handleError));
  }

}
