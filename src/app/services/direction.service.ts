import {Injectable} from '@angular/core';
import {BasicHttpService} from './basic-http.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Direction} from '../model/department/direction.model';

@Injectable({
  providedIn: 'root'
})
export class DirectionService extends BasicHttpService {

  private directionApiUrl = 'api/v1/directions';
  private fullUserEndpoint = environment.domain + this.directionApiUrl;

  public getDirections(): Observable<Direction[]> {
    return this.http.get<Direction[]>(this.fullUserEndpoint)
      .pipe(catchError(this.handleError));
  }

}
