import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {User} from '../model/users/user';
import {catchError} from 'rxjs/operators';
import {BasicHttpService} from './basic-http.service';


@Injectable({
  providedIn: 'root'
})
export class UserService extends BasicHttpService {

  private userApiUrl = 'api/v1/users';
  private fullUserEndpoint = environment.domain + this.userApiUrl;

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.fullUserEndpoint)
      .pipe(catchError(this.handleError));
  }

  public deleteUser(userId: string): Observable<User[]> {
    return this.http.delete<User[]>(this.fullUserEndpoint + '/' + userId)
      .pipe(catchError(this.handleError));
  }

  public updateUser(user: User): Observable<User> {
    return this.http.put<User>(this.fullUserEndpoint, user)
      .pipe(catchError(this.handleError));
  }

  public changeUserStatus(id: string, isNeedToBlock: boolean): Observable<User> {
    return this.http.put<User>(this.fullUserEndpoint + '/block/' + id, isNeedToBlock)
      .pipe(catchError(this.handleError));
  }
}
