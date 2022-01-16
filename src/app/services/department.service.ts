import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {BasicHttpService} from './basic-http.service';
import {Department} from '../model/department/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService extends BasicHttpService {

  private departmentApiUrl = 'api/v1/departments';
  private fullDepartmentEndpoint = environment.domain + this.departmentApiUrl;

  // deaneryID - optional parameter. If 'null' specified - will be return all values
  public getDepartments(deaneryId: string): Observable<Department[]> {
    const params = this.fillDeaneryParams(deaneryId);
    return this.http.get<Department[]>(this.fullDepartmentEndpoint, {
      params
    }).pipe(catchError(this.handleError));
  }

  private fillDeaneryParams(deaneryId: string): any {
    if (deaneryId) {
      return {
        deaneryId
      };
    } else {
      return {};
    }
  }

  public createDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(`${this.fullDepartmentEndpoint}`, department)
      .pipe(catchError(this.handleError));
  }

  public updateDepartment(department: Department): Observable<Department> {
    return this.http.put<Department>(`${this.fullDepartmentEndpoint}`, department)
      .pipe(catchError(this.handleError));
  }

  public deleteDepartment(departmentId: string): Observable<any> {
    return this.http.delete<any>(`${this.fullDepartmentEndpoint}/${departmentId}`)
      .pipe(catchError(this.handleError));
  }

  public getDepartment(departmentId: string): Observable<Department> {
    return this.http.get<Department>(`${this.fullDepartmentEndpoint}/${departmentId}`)
      .pipe(catchError(this.handleError));
  }
}
