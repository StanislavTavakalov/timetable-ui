import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Role} from '../model/users/role';
import {BasicHttpService} from './basic-http.service';
import {Permission} from '../model/users/permission';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BasicHttpService {

  private roleApiUrl = 'api/v1/roles';
  private fullRoleEndpoint = environment.domain + this.roleApiUrl;

  public getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.fullRoleEndpoint}`)
      .pipe(catchError(this.handleError));
  }

  public createRole(role: Role): Observable<Role> {
    return this.http.post<Role>(`${this.fullRoleEndpoint}`, role)
      .pipe(catchError(this.handleError));
  }

  public updateRole(role: Role): Observable<Role> {
    return this.http.put<Role>(`${this.fullRoleEndpoint}`, role)
      .pipe(catchError(this.handleError));
  }

  public deleteRole(roleId: string): Observable<any> {
    return this.http.delete<any>(`${this.fullRoleEndpoint}/${roleId}`)
      .pipe(catchError(this.handleError));
  }

  public getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.fullRoleEndpoint}/permissions`)
      .pipe(catchError(this.handleError));
  }
}
