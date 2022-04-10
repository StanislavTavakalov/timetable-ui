import {Injectable} from '@angular/core';
import {BasicHttpService} from './basic-http.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {SemesterLoad} from '../model/additionals/semester-load';

@Injectable({
  providedIn: 'root'
})
export class SemesterLoadService extends BasicHttpService {

  private semesterLoadApiUrl = 'api/v1/semester_loads';
  private fullSemesterLoadEndpoint = environment.domain + this.semesterLoadApiUrl;

  public getSemesterLoads(): Observable<SemesterLoad[]> {
    return this.http.get<SemesterLoad[]>(this.fullSemesterLoadEndpoint)
      .pipe(catchError(this.handleError));
  }

  public createSemesterLoad(semesterLoad: SemesterLoad): Observable<SemesterLoad> {
    return this.http.post<SemesterLoad>(`${this.fullSemesterLoadEndpoint}`, semesterLoad)
      .pipe(catchError(this.handleError));
  }

  public updateSemesterLoad(semesterLoad: SemesterLoad): Observable<SemesterLoad> {
    return this.http.put<SemesterLoad>(`${this.fullSemesterLoadEndpoint}`, semesterLoad)
      .pipe(catchError(this.handleError));
  }

  public deleteSemesterLoad(semesterLoadId: string): Observable<any> {
    return this.http.delete<any>(`${this.fullSemesterLoadEndpoint}/${semesterLoadId}`)
      .pipe(catchError(this.handleError));
  }

}
