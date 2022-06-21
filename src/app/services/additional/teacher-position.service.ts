import {Injectable} from '@angular/core';
import {BasicHttpService} from '../basic-http.service';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {TeacherPosition} from '../../model/additionals/teacher-position';

@Injectable({
  providedIn: 'root'
})
export class TeacherPositionService extends BasicHttpService {

  private teacherPositionApiUrl = 'api/v1/positions';
  private fullTeacherPositionEndpoint = environment.domain + this.teacherPositionApiUrl;

  public getTeacherPositions(): Observable<TeacherPosition[]> {
    return this.http.get<TeacherPosition[]>(this.fullTeacherPositionEndpoint)
      .pipe(catchError(this.handleError));
  }

  public createTeacherPosition(teacherPosition: TeacherPosition): Observable<TeacherPosition> {
    return this.http.post<TeacherPosition>(`${this.fullTeacherPositionEndpoint}`, teacherPosition)
      .pipe(catchError(this.handleError));
  }

  public updateTeacherPosition(teacherPosition: TeacherPosition): Observable<TeacherPosition> {
    return this.http.put<TeacherPosition>(`${this.fullTeacherPositionEndpoint}`, teacherPosition)
      .pipe(catchError(this.handleError));
  }

  public deleteTeacherPosition(teacherPositionId: string): Observable<any> {
    return this.http.delete<any>(`${this.fullTeacherPositionEndpoint}/${teacherPositionId}`)
      .pipe(catchError(this.handleError));
  }

}
