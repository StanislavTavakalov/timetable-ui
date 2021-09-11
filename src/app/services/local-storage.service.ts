import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {User} from '../model/user';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private USER_TOKEN_KEY = 'currentUserToken';
  private CURRENT_USER = 'currentUser';
  private SECRET_KEY = 'superSecretKeyBNTU';

  observableCurrentUser: BehaviorSubject<User>;

  constructor() {
    this.observableCurrentUser = new BehaviorSubject<User>(null);
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
    this.observableCurrentUser.next(user);
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
    this.observableCurrentUser.next(null);
  }
}
