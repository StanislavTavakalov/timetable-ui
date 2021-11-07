import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {LocalStorageService} from '../../services/local-storage.service';
import {PermissionCheckService} from '../../services/permission-check.service';

@Component({
  selector: 'app-user-sidenav',
  templateUrl: './user-sidenav.component.html',
  styleUrls: ['./user-sidenav.component.css']
})
export class UserSidenavComponent implements OnInit {

  @ViewChild('sidenav')
  nav: MatSidenav;
  isExpanded = true;
  showSubmenu = false;
  isShowing = false;

  currentUser = this.localStorageService.subscribableCurrentUser;
  isNavBarOpened = this.localStorageService.subscribableIsNavBarOpened;

  constructor(private localStorageService: LocalStorageService,
              public permissionCheckService: PermissionCheckService) {
  }

  ngOnInit(): void {
  }

}
