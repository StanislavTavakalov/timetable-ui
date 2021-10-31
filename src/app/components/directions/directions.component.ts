import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {DirectionService} from '../../services/direction.service';
import {Subscription} from 'rxjs';
import {Direction} from '../../model/direction.model';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.css']
})
export class DirectionsComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private directionService: DirectionService) {
  }

  directions: Direction[];
  directionServiceSubscription: Subscription;
  directionTableVisible = false;
  isDirectionLoading = false;

  ngOnInit(): void {
    this.isDirectionLoading = true;

    this.directionServiceSubscription = this.directionService.getDirections().subscribe(directions => {
      this.isDirectionLoading = false;
      this.directions = directions;
      this.directionTableVisible = true;
    }, error => {
      this.isDirectionLoading = false;
      this.directionTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить направления.');
    });
  }

  ngOnDestroy(): void {
    if (this.directionServiceSubscription) {
      this.directionServiceSubscription.unsubscribe();
    }
  }

}
