import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Credentials} from '../model/credentials';
import {AuthResponse} from '../model/authResponse';
import {User} from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {
  }

  private authApiUrl = 'api/v1/auth';
  private fullAuthApiUrl = environment.domain + this.authApiUrl;

  private loginEndpoint = '/login';
  private registerEndpoint = '/register';


  public signin(credentials: Credentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.fullAuthApiUrl + this.loginEndpoint, credentials).pipe(catchError(this.handleError));
  }

  public signup(user: User): Observable<User> {
    return this.http.post<User>(this.fullAuthApiUrl + this.registerEndpoint, user).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(error.error);
  }

}
