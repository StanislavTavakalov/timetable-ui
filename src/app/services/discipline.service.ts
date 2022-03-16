import {Injectable} from '@angular/core';
import {BasicHttpService} from './basic-http.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {StudyDiscipline} from '../model/discipline/study-discipline';
import {StudyDisciplineGroup} from '../model/discipline/study-discipline-group';

@Injectable({
  providedIn: 'root'
})
export class DisciplineService extends BasicHttpService {

  private disciplineEndpoint = environment.domain + 'api/v1/discipline';
  private disciplineGroupsEndpoint = environment.domain + 'api/v1/disciplinegroups';

  public getDisciplines(): Observable<StudyDiscipline[]> {
    return this.http.get<StudyDiscipline[]>(this.disciplineEndpoint).pipe(catchError(this.handleError));
  }

  public getDisciplineGroups(): Observable<StudyDisciplineGroup[]> {
    return this.http.get<StudyDisciplineGroup[]>(this.disciplineGroupsEndpoint).pipe(catchError(this.handleError));
  }

  public createDiscipline(discipline: StudyDiscipline): Observable<StudyDiscipline> {
    return this.http.post<StudyDiscipline>(`${this.disciplineEndpoint}`, discipline)
      .pipe(catchError(this.handleError));
  }

  public updateDiscipline(discipline: StudyDiscipline): Observable<StudyDiscipline> {
    return this.http.put<StudyDiscipline>(`${this.disciplineEndpoint}`, discipline)
      .pipe(catchError(this.handleError));
  }

  public deleteDiscipline(disciplineId: string): Observable<any> {
    return this.http.delete<any>(`${this.disciplineEndpoint}/${disciplineId}`)
      .pipe(catchError(this.handleError));
  }

  public getDiscipline(disciplineId: string): Observable<StudyDiscipline> {
    return this.http.get<StudyDiscipline>(`${this.disciplineEndpoint}/${disciplineId}`)
      .pipe(catchError(this.handleError));
  }
}
