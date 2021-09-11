import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {LocalStorageService} from '../../services/local-storage.service';

@Component({
  selector: 'app-user-sidenav',
  templateUrl: './user-sidenav.component.html',
  styleUrls: ['./user-sidenav.component.css']
})
export class UserSidenavComponent implements OnInit {

  @ViewChild('sidenav')
  nav: MatSidenav;

  currentUser = this.localStorageService.getCurrentUser();
  isNavBarOpened = this.localStorageService.subscribableIsNavBarOpened;

  constructor(private localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
  }

}
