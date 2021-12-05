import {Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, Type, ViewChild, ViewContainerRef} from '@angular/core';
import {ResizeableClassroomComponent} from './resizeable-classroom/resizeable-classroom.component';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {ClassroomAddEditComponent} from './classroom-add-edit/classroom-add-edit.component';
import {Classroom} from '../../../../../../model/dispatcher/classroom';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {

  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;
  resizeableClassroom = ResizeableClassroomComponent;
  components = [];

  @Output() valueChange = new EventEmitter();
  base64textString: string;
  imageUrl: string | ArrayBuffer;
  ishiddenImage: boolean;
  @Input() defaultImage: string;
  @Input() imageWidth: number;
  @Input() imageHeight: number;
  @Input() onErrorImage: string;

  backgroundImageUrl: string;
  classroomCreationSub: Subscription;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.backgroundImageUrl = null;
    if (this.defaultImage && this.defaultImage !== '') {
      // this.imageUrl = 'https://drive.google.com/thumbnail?id=' + this.defaultImage;
    } else {
      this.imageUrl = this.onErrorImage;
    }
    this.ishiddenImage = false;
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
    this.ishiddenImage = true;
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
      this.ishiddenImage = false;
    };
  }

  _handleReaderLoaded(readerEvt): void {
    const binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    this.valueChange.emit(this.base64textString);
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
        component.instance.cHeight = 800;
        component.instance.cWidth = 650;
        component.instance.width = 300;
        component.instance.height = 150;
        component.instance.left = 100;
        component.instance.top = 100;
        component.instance.color = classroom.classroomType.color;
        component.instance.classroomNumber = classroom.number;

        // Push the component so that we can keep track of which components are created
        this.components.push(component);
      }
    });


  }

  removeClassroom(componentClass: Type<any>): void {
    // Find the component
    const component = this.components.find((c) => c.instance instanceof componentClass);
    const componentIndex = this.components.indexOf(component);

    if (componentIndex !== -1) {
      // Remove component from both view and array
      this.container.remove(this.container.indexOf(component.hostView));
      this.components.splice(componentIndex, 1);
    }
  }
}
