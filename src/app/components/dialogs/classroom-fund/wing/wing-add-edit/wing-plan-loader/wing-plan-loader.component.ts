import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {ResizeableClassroomComponent} from './resizeable-classroom/resizeable-classroom.component';
import {MatDialog} from '@angular/material/dialog';
import {Subject, Subscription} from 'rxjs';
import {ClassroomAddEditComponent} from './classroom-add-edit/classroom-add-edit.component';
import {Classroom} from '../../../../../../model/dispatcher/classroom';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-wing-plan-loader',
  templateUrl: './wing-plan-loader.component.html',
  styleUrls: ['./wing-plan-loader.component.css']
})
export class WingPlanLoaderComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;
  resizeableClassroom = ResizeableClassroomComponent;
  @Input() classrooms: Classroom[];
  components = [];

  @Output() planImageChange = new EventEmitter();

  selectedComponentId: number;
  selectedClassroom: Classroom;
  idGenerator = 0;

  base64textString: string;
  imageUrl;
  isHiddenImage: boolean;
  @Input() defaultImage: string;
  @Input() imageWidth: number;
  @Input() imageHeight: number;
  @Input() onErrorImage: string;

  backgroundImageUrl;
  classroomCreationSub: Subscription;
  classroomEditSub: Subscription;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private sanitizer: DomSanitizer,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.backgroundImageUrl = null;
    this.defaultImage = 'data:image/jpeg;base64,' + this.defaultImage;
    if (this.defaultImage && this.defaultImage !== '') {
      const image = new Image();
      image.src = this.defaultImage;
      image.onload = rs => {
        this.imageHeight = rs.currentTarget['height'];
        this.imageWidth = rs.currentTarget['width'];
      };
      this.backgroundImageUrl = image.src;

      // this.backgroundImageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${this.defaultImage}`);
    } else {
      this.backgroundImageUrl = this.onErrorImage;
    }
    this.isHiddenImage = false;
  }

  ngAfterViewInit(): void {
    this.initClassrooms();
  }


  selectFile(event): void {
    const file = event.target.files.item(0);
    const maxSize = 1024 * 1024 * 4; // 4 MB
    if (file.type.match('image.*') && (file.size < maxSize)) {
      this.convertToBinaryString(file);
      this.convertToDataURL(file);
    } else {
      alert('invalid format or size!');
    }
  }

  convertToBinaryString(file: File): void {
    const readerForBinarySring = new FileReader();
    readerForBinarySring.onload = this._handleReaderLoaded.bind(this);
    readerForBinarySring.readAsBinaryString(file);
  }

  convertToDataURL(file: File): void {
    this.isHiddenImage = true;
    const readerForDataUrl = new FileReader();
    readerForDataUrl.readAsDataURL(file);
    readerForDataUrl.onload = (event) => {
      this.imageUrl = event.target.result;
      const image = new Image();
      if (typeof event.target.result === 'string') {
        image.src = event.target.result;
        image.onload = rs => {
          this.imageHeight = rs.currentTarget['height'];
          this.imageWidth = rs.currentTarget['width'];
        };
        this.backgroundImageUrl = image.src;
      }
      this.isHiddenImage = false;
    };
  }

  _handleReaderLoaded(readerEvt): void {
    const binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    this.planImageChange.emit(this.base64textString);
    // console.log(this.base64textString);
  }

  initClassrooms(): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.resizeableClassroom);
    for (const cr of this.classrooms) {
      const component = this.container.createComponent(componentFactory);
      component.instance.cHeight = this.imageHeight;
      component.instance.cWidth = this.imageWidth;
      component.instance.classroom = cr;
      component.instance.id = this.idGenerator++;
      component.instance.triggerComponentSelected = new Subject<boolean>();
      component.instance.triggerComponentSelected.subscribe(value => {
        component.instance.isSelected = value;
      });
      component.instance.selectedComponentIdEmitter.subscribe(selectedComp => {
          this.selectedComponentId = selectedComp;
          const foundComponent = this.components.find((c) => c.instance instanceof this.resizeableClassroom
            && c.instance.id === selectedComp);
          this.selectedClassroom = foundComponent.instance.classroom;
          for (const c of this.components) {
            if (c.instance.id === selectedComp) {
              c.instance.triggerComponentSelected.next(true);
            } else {
              c.instance.triggerComponentSelected.next(false);
            }
          }
        }
      );
      this.components.push(component);
    }
  }

  addClassroom(): void {
    // Create component dynamically inside the ng-template
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.resizeableClassroom);


    const dialogRef = this.dialog.open(ClassroomAddEditComponent, {
      data: {title: 'Добавить аудиторию'}
    });

    this.classroomCreationSub = dialogRef.afterClosed().subscribe((classroom: Classroom) => {
      if (classroom !== undefined && classroom !== null) {
        const component = this.container.createComponent(componentFactory);
        component.instance.cHeight = this.imageHeight;
        component.instance.cWidth = this.imageWidth;
        component.instance.classroom = classroom;
        component.instance.id = this.idGenerator++;
        component.instance.triggerComponentSelected = new Subject<boolean>();
        component.instance.triggerComponentSelected.subscribe(value => {
          component.instance.isSelected = value;
          console.log('Triggered ' + value);
        });
        component.instance.selectedComponentIdEmitter.subscribe(selectedComp => {
            this.selectedComponentId = selectedComp;
            const foundComponent = this.components.find((c) => c.instance instanceof this.resizeableClassroom
              && c.instance.id === selectedComp);
            this.selectedClassroom = foundComponent.instance.classroom;
            for (const c of this.components) {
              if (c.instance.id === selectedComp) {
                c.instance.triggerComponentSelected.next(true);
              } else {
                c.instance.triggerComponentSelected.next(false);
              }
            }
          }
        );
        this.classrooms.push(classroom);
        // Push the component so that we can keep track of which components are created
        this.components.push(component);
      }
    });


  }

  removeClassroom(): void {
    // Find the component
    const component = this.components.find((c) => c.instance instanceof this.resizeableClassroom
      && c.instance.id === this.selectedComponentId);
    component.instance.selectedComponentIdEmitter.unsubscribe();
    const classroomToRemove = component.instance.classroom;
    const componentIndex = this.components.indexOf(component);
    const classroomToRemoveIndex = this.classrooms.indexOf(classroomToRemove);

    if (componentIndex !== -1) {
      // Remove component from both view and array
      this.container.remove(this.container.indexOf(component.hostView));
      this.components.splice(componentIndex, 1);
      this.classrooms.splice(classroomToRemoveIndex, 1);
      this.selectedClassroom = null;
    }
  }

  editClassroom(): void {
    const dialogRef = this.dialog.open(ClassroomAddEditComponent, {
      data: {title: 'Редактировать аудиторию', classroom: this.selectedClassroom}
    });

    this.classroomEditSub = dialogRef.afterClosed().subscribe((classroom: Classroom) => {
      if (classroom !== undefined && classroom !== null) {
        console.log(this.selectedClassroom);
      }
    });

  }

  ngOnDestroy(): void {
    if (this.classroomCreationSub !== undefined) {
      this.classroomCreationSub.unsubscribe();
    }
    if (this.classroomEditSub !== undefined) {
      this.classroomEditSub.unsubscribe();
    }
  }


}
