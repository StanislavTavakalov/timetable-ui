import { Injectable } from '@angular/core';
import {BasicHttpService} from './basic-http.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Group} from '../model/deanery/group';

@Injectable({
  providedIn: 'root'
})
export class GroupService extends BasicHttpService{

  private groupApiUrl = 'api/v1/groups';
  private fullGroupEndpoint = environment.domain + this.groupApiUrl;

  // deaneryId and deaneryId - optional parameters
  public getGroups(deaneryId: string, departmentId: string): Observable<Group[]> {
    const params = this.fillDeaneryOrDepartmentIfPresent(deaneryId, departmentId);
    return this.http.get<Group[]>(`${this.fullGroupEndpoint}`, {params})
      .pipe(catchError(this.handleError));
  }

  private fillDeaneryOrDepartmentIfPresent(deaneryId: string, departmentId): any {
    if (deaneryId) {
      return {deaneryId};
    } else if (departmentId) {
      return {departmentId};
    } else {
      return {};
    }
  }

  public createGroup(group: Group): Observable<Group> {
    return this.http.post<Group>(`${this.fullGroupEndpoint}`, group)
      .pipe(catchError(this.handleError));
  }

  public updateGroup(group: Group): Observable<Group> {
    return this.http.put<Group>(`${this.fullGroupEndpoint}`, group)
      .pipe(catchError(this.handleError));
  }

  public deleteGroup(groupId: string): Observable<any> {
    return this.http.delete<any>(`${this.fullGroupEndpoint}/${groupId}`)
      .pipe(catchError(this.handleError));
  }

}
