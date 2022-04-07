import {Injectable} from '@angular/core';
import {BasicHttpService} from './basic-http.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Discipline} from '../model/discipline/discipline';
import {DisciplineGroup} from '../model/discipline/discipline-group';

@Injectable({
  providedIn: 'root'
})
export class DisciplineService extends BasicHttpService {

  private disciplineEndpoint = environment.domain + 'api/v1/disciplines';
  private disciplineGroupsEndpoint = environment.domain + 'api/v1/disciplinegroups';

  public getDisciplines(): Observable<Discipline[]> {
    return this.http.get<Discipline[]>(this.disciplineEndpoint).pipe(catchError(this.handleError));
  }

  public getDisciplineGroups(): Observable<DisciplineGroup[]> {
    return this.http.get<DisciplineGroup[]>(this.disciplineGroupsEndpoint).pipe(catchError(this.handleError));
  }

  public createDiscipline(discipline: Discipline): Observable<Discipline> {
    return this.http.post<Discipline>(`${this.disciplineEndpoint}`, discipline)
      .pipe(catchError(this.handleError));
  }

  public updateDiscipline(discipline: Discipline): Observable<Discipline> {
    return this.http.put<Discipline>(`${this.disciplineEndpoint}`, discipline)
      .pipe(catchError(this.handleError));
  }

  public deleteDiscipline(disciplineId: string): Observable<any> {
    return this.http.delete<any>(`${this.disciplineEndpoint}/${disciplineId}`)
      .pipe(catchError(this.handleError));
  }

  public getDiscipline(disciplineId: string): Observable<Discipline> {
    return this.http.get<Discipline>(`${this.disciplineEndpoint}/${disciplineId}`)
      .pipe(catchError(this.handleError));
  }
}
