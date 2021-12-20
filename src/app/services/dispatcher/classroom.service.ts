import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {BasicHttpService} from '../basic-http.service';
import {environment} from '../../../environments/environment';
import {Classroom, ClassroomSpecialization, ClassroomType} from '../../model/dispatcher/classroom';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService extends BasicHttpService{

  private classroomApiUrl = 'api/v1/classrooms';
  private fullEndpoint = environment.domain + this.classroomApiUrl;

  public getClassrooms(): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(`${this.fullEndpoint}`)
      .pipe(catchError(this.handleError));
  }

  public getClassroomTypes(): Observable<ClassroomType[]> {
    return this.http.get<ClassroomType[]>(`${this.fullEndpoint}/types`)
      .pipe(catchError(this.handleError));
  }

  public getClassroomSpecializations(): Observable<ClassroomSpecialization[]> {
    return this.http.get<ClassroomSpecialization[]>(`${this.fullEndpoint}/specializations`)
      .pipe(catchError(this.handleError));
  }

  public createClassroom(classroom: Classroom): Observable<Classroom> {
    return this.http.post<Classroom>(`${this.fullEndpoint}`, classroom)
      .pipe(catchError(this.handleError));
  }

  public updateClassroom(classroom: Classroom): Observable<Classroom> {
    return this.http.put<Classroom>(`${this.fullEndpoint}`, classroom)
      .pipe(catchError(this.handleError));
  }

  public deleteClassroom(classroomId: string): Observable<any> {
    return this.http.delete<any>(`${this.fullEndpoint}/${classroomId}`)
      .pipe(catchError(this.handleError));
  }
}
