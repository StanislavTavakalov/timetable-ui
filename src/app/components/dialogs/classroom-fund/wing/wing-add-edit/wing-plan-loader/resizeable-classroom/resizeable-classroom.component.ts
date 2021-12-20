import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {Classroom} from '../../../../../../../model/dispatcher/classroom';
import {Subject} from 'rxjs';

const enum Status {
  OFF = 0,
  RESIZE = 1,
  MOVE = 2
}


@Component({
  selector: 'app-resizeable-classroom',
  templateUrl: './resizeable-classroom.component.html',
  styleUrls: ['./resizeable-classroom.component.scss']
})
export class ResizeableClassroomComponent implements OnInit, AfterViewInit {
  public cHeight: number;
  public cWidth: number;
  public classroom: Classroom;
  public id: number;
  selectedComponentIdEmitter: Subject<number> = new Subject();
  triggerComponentSelected: Subject<boolean> = new Subject();

  @ViewChild('box') public box: ElementRef;
  private boxPosition: { left: number, top: number };
  private containerPos: { left: number, top: number, right: number, bottom: number };
  public mouse: { x: number, y: number };
  public status: Status = Status.OFF;
  private mouseClick: { x: number, y: number, left: number, top: number };
  isSelected = false;


  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.loadBox();
    this.loadContainer();
  }

  private loadBox(): void {
    const {left, top} = this.box.nativeElement.getBoundingClientRect();
    // console.log('ClientRect: left =  ' + left + 'top =  ' + top + ' color = ' + this.color);
    // console.log('Position: left =  ' + this.x + 'top =  ' + this.y);
    this.boxPosition = {left, top};
  }

  private loadContainer(): void {
    const left = this.boxPosition.left - this.classroom.x;
    const top = this.boxPosition.top - this.classroom.y;
    const right = left + this.cHeight;
    const bottom = top + this.cWidth;
    this.containerPos = {left, top, right, bottom};
    console.log('Container pos:  left = ' + left + '; top =  ' + top + '; right =  ' + right + '; bottom = ' + bottom);
  }

  setStatus(event: MouseEvent, status: number): void {
    if (status === 1) {
      event.stopPropagation();
    } else if (status === 2) {
      this.mouseClick = {x: event.clientX, y: event.clientY, left: this.classroom.x, top: this.classroom.y};
      this.selectedComponentIdEmitter.next(this.id);
      console.log(this.isSelected);
    } else {
      this.loadBox();
    }
    this.status = status;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.mouse = {x: event.clientX, y: event.clientY};

    if (this.status === Status.RESIZE) {
      this.resize();
    } else if (this.status === Status.MOVE) {
      this.move();
    }
  }

  private resize(): void {
    if (this.resizeCondMeet()) {
      this.classroom.width = Number(this.mouse.x > this.boxPosition.left) ? this.mouse.x - this.boxPosition.left : 0;
      this.classroom.height = Number(this.mouse.y > this.boxPosition.top) ? this.mouse.y - this.boxPosition.top : 0;
    }
  }

  private resizeCondMeet(): boolean {
    return (this.mouse.x < this.containerPos.right && this.mouse.y < this.containerPos.bottom);
  }

  private move(): void {
    if (this.moveCondMeet()) {
      this.classroom.x = this.mouseClick.left + (this.mouse.x - this.mouseClick.x);
      this.classroom.y = this.mouseClick.top + (this.mouse.y - this.mouseClick.y);
    }
  }

  private moveCondMeet(): boolean {
    const offsetLeft = this.mouseClick.x - this.boxPosition.left;
    const offsetRight = this.classroom.width - offsetLeft;
    const offsetTop = this.mouseClick.y - this.boxPosition.top;
    const offsetBottom = this.classroom.height - offsetTop;
    return (
      this.mouse.x > this.containerPos.left + offsetLeft &&
      this.mouse.x < this.containerPos.right - offsetRight &&
      this.mouse.y > this.containerPos.top + offsetTop &&
      this.mouse.y < this.containerPos.bottom - offsetBottom
    );
  }
}
