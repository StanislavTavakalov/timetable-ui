import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Role} from '../model/role';
import {BasicHttpService} from './basic-http.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BasicHttpService {

  private roleApiUrl = 'api/v1/roles';
  private fullRoleEndpoint = environment.domain + this.roleApiUrl;

  public getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.fullRoleEndpoint)
      .pipe(catchError(this.handleError));
  }
}
