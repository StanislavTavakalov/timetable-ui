import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {User} from '../model/users/user';
import * as CryptoJS from 'crypto-js';
import {HeaderType} from '../model/header-type';
import {Department} from '../model/department/department';
import {Deanery} from '../model/deanery/deanery';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private USER_TOKEN_KEY = 'currentUserToken';
  private CURRENT_USER = 'currentUser';
  private SECRET_KEY = 'superSecretKeyBNTU';

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
    localStorage.setItem(this.USER_TOKEN_KEY, CryptoJS.AES.encrypt(JSON.stringify(authToken), this.SECRET_KEY.trim()).toString());
  }

  public getCurrentUserToken(): string {
    if (!localStorage.getItem(this.USER_TOKEN_KEY)) {
      return '';
    }
    return JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem(this.USER_TOKEN_KEY), this.SECRET_KEY.trim()).toString(CryptoJS.enc.Utf8));
  }

  public setCurrentUser(user: User): void {
    console.log(user);
    this.subscribableCurrentUser.next(user);
    localStorage.setItem(this.CURRENT_USER, CryptoJS.AES.encrypt(JSON.stringify(user), this.SECRET_KEY.trim()).toString());
  }

  public getCurrentUser(): User {
    if (!localStorage.getItem(this.CURRENT_USER)) {
      return null;
    }
    return JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem(this.CURRENT_USER), this.SECRET_KEY.trim()).toString(CryptoJS.enc.Utf8));
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

}
