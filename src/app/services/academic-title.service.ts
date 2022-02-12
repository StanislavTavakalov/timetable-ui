import {Injectable} from '@angular/core';
import {BasicHttpService} from './basic-http.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AcademicTitle} from '../model/additionals/academic-title';

@Injectable({
  providedIn: 'root'
})
export class AcademicTitleService extends BasicHttpService {

  private academicTitleApiUrl = 'api/v1/academic_titles';
  private fullUserEndpoint = environment.domain + this.academicTitleApiUrl;

  public getAcademicTitles(): Observable<AcademicTitle[]> {
    return this.http.get<AcademicTitle[]>(this.fullUserEndpoint)
      .pipe(catchError(this.handleError));
  }

}
