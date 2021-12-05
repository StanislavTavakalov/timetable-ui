import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';

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
  @Input('containerHeight') public cHeight: number;
  @Input('containerWidth') public cWidth: number;
  @Input('width') public width: number;
  @Input('height') public height: number;
  @Input('left') public left: number;
  @Input('top') public top: number;
  @Input('color') public color: string;
  @Input('classroomNumber') public classroomNumber: string;
  @ViewChild('box') public box: ElementRef;
  private boxPosition: { left: number, top: number };
  private containerPos: { left: number, top: number, right: number, bottom: number };
  public mouse: { x: number, y: number };
  public status: Status = Status.OFF;
  private mouseClick: { x: number, y: number, left: number, top: number };

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loadBox();
    this.loadContainer();
  }

  private loadBox(): void {
    const {left, top} = this.box.nativeElement.getBoundingClientRect();
    console.log('ClientRect: left =  ' + left + 'top =  ' + top + ' color = ' + this.color);
    console.log('Position: left =  ' + this.left + 'top =  ' + this.top);
    this.boxPosition = {left, top};
  }

  private loadContainer(): void {
    const left = this.boxPosition.left - this.left;
    const top = this.boxPosition.top - this.top;
    const right = left + this.cHeight;
    const bottom = top + this.cWidth;
    this.containerPos = {left, top, right, bottom};
    console.log('Container pos:  left = ' + left + '; top =  ' + top + '; right =  ' + right + '; bottom = ' + bottom);
  }

  setStatus(event: MouseEvent, status: number): void {
    if (status === 1) {
      event.stopPropagation();
    } else if (status === 2) {
      this.mouseClick = {x: event.clientX, y: event.clientY, left: this.left, top: this.top};
    } else {
      this.loadBox();
    }
    this.status = status;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouse = {x: event.clientX, y: event.clientY};

    if (this.status === Status.RESIZE) {
      this.resize();
    } else if (this.status === Status.MOVE) {
      this.move();
    }
  }

  private resize(): void {
    if (this.resizeCondMeet()) {
      this.width = Number(this.mouse.x > this.boxPosition.left) ? this.mouse.x - this.boxPosition.left : 0;
      this.height = Number(this.mouse.y > this.boxPosition.top) ? this.mouse.y - this.boxPosition.top : 0;
    }
  }

  private resizeCondMeet(): boolean {
    return (this.mouse.x < this.containerPos.right && this.mouse.y < this.containerPos.bottom);
  }

  private move(): void {
    if (this.moveCondMeet()) {
      this.left = this.mouseClick.left + (this.mouse.x - this.mouseClick.x);
      this.top = this.mouseClick.top + (this.mouse.y - this.mouseClick.y);
    }
  }

  private moveCondMeet(): boolean {
    const offsetLeft = this.mouseClick.x - this.boxPosition.left;
    const offsetRight = this.width - offsetLeft;
    const offsetTop = this.mouseClick.y - this.boxPosition.top;
    const offsetBottom = this.height - offsetTop;
    return (
      this.mouse.x > this.containerPos.left + offsetLeft &&
      this.mouse.x < this.containerPos.right - offsetRight &&
      this.mouse.y > this.containerPos.top + offsetTop &&
      this.mouse.y < this.containerPos.bottom - offsetBottom
    );
  }
}
