import {Injectable} from '@angular/core';
import {BasicHttpService} from './basic-http.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Flow} from '../model/deanery/flow';

@Injectable({
  providedIn: 'root'
})
export class FlowService extends BasicHttpService {

  private flowApiUrl = 'api/v1/flows';
  private fullFlowEndpoint = environment.domain + this.flowApiUrl;

  public getFlows(deaneryId: string, departmentId: string): Observable<Flow[]> {
    const params = this.fillDeaneryOrDepartmentIfPresent(deaneryId, departmentId);
    return this.http.get<Flow[]>(`${this.fullFlowEndpoint}`, {params})
      .pipe(catchError(this.handleError));
  }

  private fillDeaneryOrDepartmentIfPresent(deaneryId: string, departmentId): any {
    if (deaneryId) {
      return {deaneryId};
    } else if (departmentId) {
      return {departmentId};
    } else {
      return {};
    }
  }

  public createFlow(flow: Flow): Observable<Flow> {
    return this.http.post<Flow>(`${this.fullFlowEndpoint}`, flow)
      .pipe(catchError(this.handleError));
  }

  public updateFlow(flow: Flow): Observable<Flow> {
    return this.http.put<Flow>(`${this.fullFlowEndpoint}`, flow)
      .pipe(catchError(this.handleError));
  }

  public deleteFlow(flowId: string): Observable<any> {
    return this.http.delete<any>(`${this.fullFlowEndpoint}/${flowId}`)
      .pipe(catchError(this.handleError));
  }

}
