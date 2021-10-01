import {Component, OnInit, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SinginComponent} from '../dialogs/signin/singin.component';
import {LocalStorageService} from '../../services/local-storage.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog, private localStorageService: LocalStorageService) {
  }

  currentUser = this.localStorageService.subscribableCurrentUser;
  links = ['Расписание занятий', 'Расписания преподавателей'];
  activeLink = this.links[0];

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
  }

  openSignInForm(): void {
    this.dialog.open(SinginComponent);
  }


  singOut(): void {
    this.localStorageService.clearUser();
    window.location.href = 'http://localhost:4200/';
  }

  openOrCloseNavBar(): void {
    if (this.currentUser.getValue() != null) {
      this.localStorageService.subscribableIsNavBarOpened.next(!this.localStorageService.subscribableIsNavBarOpened.getValue());
    }
  }
}
