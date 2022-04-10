import {Injectable} from '@angular/core';
import {BasicHttpService} from './basic-http.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {DisciplineGroup} from '../model/discipline/discipline-group';

@Injectable({
  providedIn: 'root'
})
export class DisciplineGroupService extends BasicHttpService {

  private disciplineGroupApiUrl = 'api/v1/disciplinegroups';
  private fullDisciplineGroupEndpoint = environment.domain + this.disciplineGroupApiUrl;

  public getDisciplineGroups(): Observable<DisciplineGroup[]> {
    return this.http.get<DisciplineGroup[]>(this.fullDisciplineGroupEndpoint)
      .pipe(catchError(this.handleError));
  }

  public createDisciplineGroup(disciplineGroup: DisciplineGroup): Observable<DisciplineGroup> {
    return this.http.post<DisciplineGroup>(`${this.fullDisciplineGroupEndpoint}`, disciplineGroup)
      .pipe(catchError(this.handleError));
  }

  public updateDisciplineGroup(disciplineGroup: DisciplineGroup): Observable<DisciplineGroup> {
    return this.http.put<DisciplineGroup>(`${this.fullDisciplineGroupEndpoint}`, disciplineGroup)
      .pipe(catchError(this.handleError));
  }

  public deleteDisciplineGroup(disciplineGroupId: string): Observable<any> {
    return this.http.delete<any>(`${this.fullDisciplineGroupEndpoint}/${disciplineGroupId}`)
      .pipe(catchError(this.handleError));
  }

}
