import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {LocalStorageService} from '../../services/local-storage.service';
import {UserService} from '../../services/user.service';
import {User} from '../../model/user';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private localStorageService: LocalStorageService,
              private userService: UserService) {

  }

  users: User[];
  userServiceSubscription: Subscription;
  userTableVisible = false;
  isUserLoading = false;

  ngOnInit(): void {
    this.isUserLoading = true;

    this.userServiceSubscription = this.userService.getUsers().subscribe(users => {
      this.isUserLoading = false;
      this.users = users;
      this.userTableVisible = true;
    }, error => {
      this.isUserLoading = false;
      this.userTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить пользователей.');
    });
  }

  ngOnDestroy(): void {
    if (this.userServiceSubscription) {
      this.userServiceSubscription.unsubscribe();
    }
  }
}
