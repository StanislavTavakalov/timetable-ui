import {Component, OnInit, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SinginComponent} from '../dialogs/signin/singin.component';
import {LocalStorageService} from '../../services/local-storage.service';
import {HeaderType} from '../../model/header-type';
import {Subscription} from 'rxjs';
import {Deanery} from '../../model/deanery/deanery';
import {Department} from '../../model/department/department';
import {Constants} from '../../constants';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog, private localStorageService: LocalStorageService) {
  }

  currentUser = this.localStorageService.subscribableCurrentUser;
  currentTabs;

  headerValueSubscription: Subscription;
  tabType: HeaderType;
  deanery: Deanery;
  department: Department;
  departmentSubscription: Subscription;
  deanerySubscription: Subscription;

  ngOnInit(): void {
    this.tabType = null;
    this.currentTabs = Constants.mainTabs;

    this.headerValueSubscription = this.localStorageService.subscribableHeaderType.subscribe(value => {
      this.tabType = value;
      if (HeaderType.DEPARTMENT === value) {
        this.currentTabs = Constants.departmentTabs;
      } else if (HeaderType.DEANERY === value) {
        this.currentTabs = Constants.deaneryTabs;
      } else if (HeaderType.MAIN) {
        this.currentTabs = Constants.mainTabs;
      }
    });

    this.departmentSubscription = this.localStorageService.subscribableDepartment.subscribe(department =>
      this.department = department);

    this.deanerySubscription = this.localStorageService.subscribableDeanery.subscribe(deanery =>
      this.deanery = deanery);
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

  ngOnDestroy(): void {
    this.headerValueSubscription.unsubscribe();
    this.departmentSubscription.unsubscribe();
    this.deanerySubscription.unsubscribe();
  }
}
