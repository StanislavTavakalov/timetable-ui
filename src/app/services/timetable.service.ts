import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {TeacherPosition} from '../model/additionals/teacher-position';
import {catchError} from 'rxjs/operators';
import {BasicHttpService} from './basic-http.service';
import {Timetable} from '../model/timetable/timetable';
import {TimetableDialogCreateCommonInfo} from '../model/timetable/timetable-dialog-create-common-info';
import {TimetableCreateCommonInfo} from '../model/timetable/timetable-create-common-info';

@Injectable({
  providedIn: 'root'
})
export class TimetableService extends BasicHttpService {

  private apiUrl = 'api/v1/timetables';
  private fullEndpoint = environment.domain + this.apiUrl;

  public getTimetables(deaneryId: string): Observable<Timetable[]> {
    const params = this.fillDeaneryIfPresent(deaneryId);
    return this.http.get<Timetable[]>(this.fullEndpoint, {params})
      .pipe(catchError(this.handleError));
  }

  private fillDeaneryIfPresent(deaneryId: string): any {
    if (deaneryId) {
      return {deaneryId};
    } else {
      return {};
    }
  }

  public createTimetable(timetable: Timetable): Observable<Timetable> {
    return this.http.post<Timetable>(`${this.fullEndpoint}`, timetable)
      .pipe(catchError(this.handleError));
  }

  public updateTimetable(teacherPosition: Timetable): Observable<Timetable> {
    return this.http.put<Timetable>(`${this.fullEndpoint}`, Timetable)
      .pipe(catchError(this.handleError));
  }

  public deleteTimetable(id: string): Observable<any> {
    return this.http.delete<any>(`${this.fullEndpoint}/${id}`)
      .pipe(catchError(this.handleError));
  }

  public getTimetableCreateCommonInfoByDeaneryId(deaneryId: string): Observable<TimetableDialogCreateCommonInfo> {
    return this.http.get<TimetableDialogCreateCommonInfo>(`${this.fullEndpoint}/deanery/${deaneryId}/dialog-common-info`)
      .pipe(catchError(this.handleError));
  }

  public getTimetableAddEditCommonInfo(): Observable<TimetableCreateCommonInfo> {
    return this.http.get<TimetableCreateCommonInfo>(`${this.fullEndpoint}/create-common-info`)
      .pipe(catchError(this.handleError));
  }
}
