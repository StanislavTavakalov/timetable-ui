import {Injectable} from '@angular/core';
import {BasicHttpService} from './basic-http.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {TeacherPosition} from '../model/additionals/teacher-position';

@Injectable({
  providedIn: 'root'
})
export class TeacherPositionService extends BasicHttpService {

  private teacherPositionApiUrl = 'api/v1/positions';
  private fullUserEndpoint = environment.domain + this.teacherPositionApiUrl;

  public getTeacherPositions(): Observable<TeacherPosition[]> {
    return this.http.get<TeacherPosition[]>(this.fullUserEndpoint)
      .pipe(catchError(this.handleError));
  }

}
