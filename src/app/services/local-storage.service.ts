import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {User} from '../model/users/user';
import * as CryptoJS from 'crypto-js';
import {HeaderType} from '../model/header-type';
import {Department} from '../model/department/department';
import {Deanery} from '../model/deanery/deanery';
import {StudyPlan} from '../model/study-plan/study-plan';
import {Timetable} from '../model/timetable/timetable';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private USER_TOKEN_KEY = 'currentUserToken';
  private CURRENT_USER = 'currentUser';
  private SECRET_KEY = 'superSecretKeyBNTU';
  private SELECTED_STANDARD_PLAN = 'selectedStandardPlan';
  private PLAN_FOR_EDIT = 'planForEdit';
  private TIMETABLE = 'timetable';

  subscribableCurrentUser: BehaviorSubject<User>;
  subscribableIsNavBarOpened: BehaviorSubject<boolean>;
  subscribableHeaderType: BehaviorSubject<HeaderType>;
  subscribableDepartment: BehaviorSubject<Department>;
  subscribableDeanery: BehaviorSubject<Deanery>;

  constructor() {
    this.subscribableCurrentUser = new BehaviorSubject<User>(this.getCurrentUser());
    this.subscribableIsNavBarOpened = new BehaviorSubject<boolean>(false);
    this.subscribableDepartment = new BehaviorSubject<Department>(null);
    this.subscribableDeanery = new BehaviorSubject<Deanery>(null);
    this.subscribableHeaderType = new BehaviorSubject<HeaderType>(HeaderType.MAIN);
  }

  public setCurrentUserToken(authToken: string): void {
    this.store(this.USER_TOKEN_KEY, authToken);
  }

  public getCurrentUserToken(): string {
    return this.getValueOrEmptyString(this.USER_TOKEN_KEY);
  }

  public setCurrentUser(user: User): void {
    console.log(user);
    this.subscribableCurrentUser.next(user);
    this.store(this.CURRENT_USER, user);
  }

  public getCurrentUser(): User {
    return this.getValueOrNull(this.CURRENT_USER);
  }

  public clearUser(): void {
    localStorage.clear();
    this.subscribableCurrentUser.next(null);
    this.subscribableIsNavBarOpened.next(false);
  }

  public changeHeaderType(headerType: HeaderType): void {
    this.subscribableHeaderType.next(headerType);

    if (headerType === HeaderType.MAIN) {
      this.subscribableDeanery.next(null);
      this.subscribableDepartment.next(null);
    } else if (headerType === HeaderType.DEANERY) {
      this.subscribableDepartment.next(null);
    } else if (headerType === HeaderType.DEPARTMENT) {
      this.subscribableDeanery.next(null);
    }
  }

  public getSelectedStandardPlan(): any {
    return this.getValueOrNull(this.SELECTED_STANDARD_PLAN);
  }

  public putSelectedStandardPlan(studyPlan: StudyPlan): void {
    this.store(this.SELECTED_STANDARD_PLAN, studyPlan);
  }

  public clearSelectedStandardPlan(): void {
    localStorage.removeItem(this.SELECTED_STANDARD_PLAN);
  }

  // TODO: probably all usages could be replaced by simple reloading from DB
  public getEditPlan(): any {
    return this.getValueOrNull(this.PLAN_FOR_EDIT);
  }

  public putEditPlan(studyPlan: StudyPlan): void {
    this.store(this.PLAN_FOR_EDIT, studyPlan);
  }

  public clearEditPlan(): void {
    localStorage.removeItem(this.PLAN_FOR_EDIT);
  }

  public putTimetable(timetable: Timetable): void {
    this.store(this.TIMETABLE, timetable);
  }

  public getTimetable(): any {
    return this.getValueOrNull(this.TIMETABLE);
  }

  public clearTimetable(): void {
    localStorage.removeItem(this.TIMETABLE);
  }

  private store(key: string, value: any): void {
    localStorage.setItem(key, CryptoJS.AES.encrypt(JSON.stringify(value), this.SECRET_KEY.trim()).toString());
  }

  private getValueOrNull(key: string): any {
    if (!localStorage.getItem(key)) {
      return null;
    }
    return JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem(key), this.SECRET_KEY.trim()).toString(CryptoJS.enc.Utf8));
  }

  private getValueOrEmptyString(key: string): any {
    if (!localStorage.getItem(key)) {
      return '';
    }
    return JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem(key), this.SECRET_KEY.trim()).toString(CryptoJS.enc.Utf8));
  }

}
