import {Component, OnInit, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SinginComponent} from '../dialogs/signin/singin.component';
import {LocalStorageService} from '../../services/local-storage.service';
import {SignupComponent} from '../dialogs/signup/signup.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog, private localStorageService: LocalStorageService) {
  }

  isAuthorized = this.localStorageService.subscribableCurrentUser;

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
  }

  openSignInForm(): void {
    this.dialog.open(SinginComponent);
  }


  singOut(): void {
    this.localStorageService.clearUser();
  }

  openSignUpForm(): void {
    this.dialog.open(SignupComponent);
  }

  openOrCloseNavBar(): void {
    if (this.isAuthorized.getValue() != null) {
      this.localStorageService.subscribableIsNavBarOpened.next(!this.localStorageService.subscribableIsNavBarOpened.getValue());
    }
  }
}
