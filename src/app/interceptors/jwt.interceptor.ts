import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LocalStorageService} from '../services/local-storage.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private localStorageService: LocalStorageService) {
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUserToken = this.localStorageService.getCurrentUserToken();
    if (currentUserToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `${currentUserToken}`
        }
      });
    }
    return next.handle(request);
  }
}
