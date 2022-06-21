import {Injectable} from '@angular/core';
import {BasicHttpService} from '../basic-http.service';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AcademicTitle} from '../../model/additionals/academic-title';
import {Deanery} from '../../model/deanery/deanery';

@Injectable({
  providedIn: 'root'
})
export class AcademicTitleService extends BasicHttpService {

  private academicTitleApiUrl = 'api/v1/academic_titles';
  private fullAcademicTitleEndpoint = environment.domain + this.academicTitleApiUrl;

  public getAcademicTitles(): Observable<AcademicTitle[]> {
    return this.http.get<AcademicTitle[]>(this.fullAcademicTitleEndpoint)
      .pipe(catchError(this.handleError));
  }

  public createAcademicTitle(academicTitle: AcademicTitle): Observable<AcademicTitle> {
    return this.http.post<AcademicTitle>(`${this.fullAcademicTitleEndpoint}`, academicTitle)
      .pipe(catchError(this.handleError));
  }

  public updateAcademicTitle(academicTitle: AcademicTitle): Observable<AcademicTitle> {
    return this.http.put<AcademicTitle>(`${this.fullAcademicTitleEndpoint}`, academicTitle)
      .pipe(catchError(this.handleError));
  }

  public deleteAcademicTitle(academicTitleId: string): Observable<any> {
    return this.http.delete<any>(`${this.fullAcademicTitleEndpoint}/${academicTitleId}`)
      .pipe(catchError(this.handleError));
  }

}
