import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {BasicHttpService} from './basic-http.service';
import {Teacher} from '../model/department/teacher';
import {InfoForTeacherCreation} from '../model/department/info-for-teacher-creation';

@Injectable({
  providedIn: 'root'
})
export class TeacherService extends BasicHttpService {
  private teacherApiUrl = 'api/v1/teachers';
  private fullTeacherEndpoint = environment.domain + this.teacherApiUrl;

  public getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.fullTeacherEndpoint}`)
      .pipe(catchError(this.handleError));
  }

  public loadDataForCreation(): Observable<InfoForTeacherCreation> {
    return this.http.get<InfoForTeacherCreation>(`${this.fullTeacherEndpoint}/loadDataForCreation`)
      .pipe(catchError(this.handleError));
  }


  public createTeacher(teacher: Teacher): Observable<Teacher> {
    return this.http.post<Teacher>(`${this.fullTeacherEndpoint}`, teacher)
      .pipe(catchError(this.handleError));
  }

  public updateTeacher(teacher: Teacher): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.fullTeacherEndpoint}`, teacher)
      .pipe(catchError(this.handleError));
  }

  public deleteTeacher(teacherId: string): Observable<any> {
    return this.http.delete<any>(`${this.fullTeacherEndpoint}/${teacherId}`)
      .pipe(catchError(this.handleError));
  }
}
