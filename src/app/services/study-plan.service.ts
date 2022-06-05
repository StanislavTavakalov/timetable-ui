import {Injectable} from '@angular/core';
import {BasicHttpService} from './basic-http.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {StudyPlan} from '../model/study-plan/study-plan';
import {CommonInfoForStudyPlan} from '../model/study-plan/common-info-for-study-plan';

@Injectable({
  providedIn: 'root'
})
export class StudyPlanService extends BasicHttpService {
  private studyPlanEndpoint = environment.domain + 'api/v1/studyplans';

  public getStudyPlans(standardPlan: boolean): Observable<StudyPlan[]> {
    const params: any = {standardPlan};
    return this.http.get<StudyPlan[]>(this.studyPlanEndpoint, {params}).pipe(catchError(this.handleError));
  }

  public createStudyPlan(studyPlan: StudyPlan): Observable<StudyPlan> {
    return this.http.post<StudyPlan>(`${this.studyPlanEndpoint}`, studyPlan)
      .pipe(catchError(this.handleError));
  }

  public updateStudyPlan(studyPlan: StudyPlan): Observable<StudyPlan> {
    return this.http.put<StudyPlan>(`${this.studyPlanEndpoint}`, studyPlan)
      .pipe(catchError(this.handleError));
  }

  public deleteStudyPlan(studyPlanId: string): Observable<any> {
    return this.http.delete<any>(`${this.studyPlanEndpoint}/${studyPlanId}`)
      .pipe(catchError(this.handleError));
  }

  public getStudyPlan(studyPlanId: string): Observable<StudyPlan> {
    return this.http.get<StudyPlan>(`${this.studyPlanEndpoint}/${studyPlanId}`)
      .pipe(catchError(this.handleError));
  }

  public loadCommonInfoForPlanCreation(): Observable<CommonInfoForStudyPlan> {
    return this.http.get<CommonInfoForStudyPlan>((`${this.studyPlanEndpoint}/common-info`));
  }

  public submitStudyPlan(studyPlan: StudyPlan): Observable<StudyPlan> {
    return this.http.put<StudyPlan>(`${this.studyPlanEndpoint}/submit`, studyPlan)
      .pipe(catchError(this.handleError));
  }

  public sendToRegisterStudyPlan(studyPlan: StudyPlan): Observable<StudyPlan> {
    return this.http.put<StudyPlan>(`${this.studyPlanEndpoint}/to_register`, studyPlan)
      .pipe(catchError(this.handleError));
  }

  public registerStudyPlan(studyPlan: StudyPlan): Observable<StudyPlan> {
    return this.http.put<StudyPlan>(`${this.studyPlanEndpoint}/register`, studyPlan)
      .pipe(catchError(this.handleError));
  }
}
