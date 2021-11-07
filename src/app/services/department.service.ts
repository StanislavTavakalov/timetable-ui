import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {BasicHttpService} from './basic-http.service';
import {Department} from '../model/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService extends BasicHttpService {

  private departmentApiUrl = 'api/v1/departments';
  private fullDepartmentEndpoint = environment.domain + this.departmentApiUrl;

  public getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.fullDepartmentEndpoint)
      .pipe(catchError(this.handleError));
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
}
