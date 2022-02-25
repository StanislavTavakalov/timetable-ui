import {Injectable} from '@angular/core';
import {BasicHttpService} from './basic-http.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Speciality} from '../model/department/speciality';

@Injectable({
  providedIn: 'root'
})
export class SpecialityService extends BasicHttpService {

  private specialityApiUrl = 'api/v1/specialities';
  private fullSpecialityEndpoint = environment.domain + this.specialityApiUrl;

  public getSpecialities(departmentId: string, deaneryId: string): Observable<Speciality[]> {
    const params = this.fillDeaneryOrDepartmentIfPresent(departmentId, deaneryId);
    return this.http.get<Speciality[]>(`${this.fullSpecialityEndpoint}`, {params})
      .pipe(catchError(this.handleError));
  }

  private fillDeaneryOrDepartmentIfPresent(departmentId: string, deaneryId: string): any {
    if (deaneryId) {
      return {deaneryId};
    } else if (departmentId) {
      return {departmentId};
    } else {
      return {};
    }
  }

  public createSpeciality(speciality: Speciality): Observable<Speciality> {
    return this.http.post<Speciality>(`${this.fullSpecialityEndpoint}`, speciality)
      .pipe(catchError(this.handleError));
  }

  public updateSpeciality(speciality: Speciality): Observable<Speciality> {
    return this.http.put<Speciality>(`${this.fullSpecialityEndpoint}`, speciality)
      .pipe(catchError(this.handleError));
  }

  public deleteSpeciality(specialityId: string): Observable<any> {
    return this.http.delete<any>(`${this.fullSpecialityEndpoint}/${specialityId}`)
      .pipe(catchError(this.handleError));
  }
}
