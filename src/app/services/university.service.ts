import {Injectable} from '@angular/core';
import {BasicHttpService} from './basic-http.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {University} from '../model/additionals/university';

@Injectable({
  providedIn: 'root'
})
export class UniversityService extends BasicHttpService {

  private universityApiUrl = 'api/v1/universities';
  private fullUniversityEndpoint = environment.domain + this.universityApiUrl;

  public getUniversities(): Observable<University[]> {
    return this.http.get<University[]>(this.fullUniversityEndpoint)
      .pipe(catchError(this.handleError));
  }

  public createUniversity(university: University): Observable<University> {
    return this.http.post<University>(`${this.fullUniversityEndpoint}`, university)
      .pipe(catchError(this.handleError));
  }

  public updateUniversity(university: University): Observable<University> {
    return this.http.put<University>(`${this.fullUniversityEndpoint}`, university)
      .pipe(catchError(this.handleError));
  }

  public deleteUniversity(universityId: string): Observable<any> {
    return this.http.delete<any>(`${this.fullUniversityEndpoint}/${universityId}`)
      .pipe(catchError(this.handleError));
  }

}
