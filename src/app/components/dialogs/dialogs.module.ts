import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material.module';
import {NgModule} from '@angular/core';
import {SinginComponent} from './signin/singin.component';
import {UsersDeleteComponent} from './users/users-delete/users-delete.component';
import {UserAddEditComponent} from './users/users-add-edit/user-add-edit.component';
import {RoleDeleteComponent} from './roles/role-delete/role-delete.component';
import {RoleAddEditComponent} from './roles/role-add-edit/role-add-edit.component';
import {DepartmentAddEditComponent} from './departments/department-add-edit/department-add-edit.component';
import {DeaneryDeleteComponent} from './deaneries/deanery-delete/deanery-delete.component';
import {DepartmentDeleteComponent} from './departments/department-delete/department-delete.component';
import {DeaneryAddEditComponent} from './deaneries/deanery-add-edit/deanery-add-edit.component';
import {BuildingCreateComponent} from './classroom-fund/building/building-create/building-create.component';
import {BuildingDeleteComponent} from './classroom-fund/building/building-delete/building-delete.component';
import {BuildingFloorCountChangeComponent} from './classroom-fund/building/building-floor-count-change/building-floor-count-change.component';
import {WingAddEditComponent} from './classroom-fund/wing/wing-add-edit/wing-add-edit.component';
import {ImageUploadComponent} from './classroom-fund/wing/wing-add-edit/image-upload/image-upload.component';
import {ResizeableClassroomComponent} from './classroom-fund/wing/wing-add-edit/image-upload/resizeable-classroom/resizeable-classroom.component';
import { ClassroomAddEditComponent } from './classroom-fund/wing/wing-add-edit/image-upload/classroom-add-edit/classroom-add-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [
    SinginComponent,
    UsersDeleteComponent,
    UserAddEditComponent,
    RoleDeleteComponent,
    RoleAddEditComponent,
    DepartmentAddEditComponent,
    DeaneryDeleteComponent,
    DeaneryAddEditComponent,
    DepartmentDeleteComponent,
    BuildingCreateComponent,
    BuildingDeleteComponent,
    BuildingFloorCountChangeComponent,
    WingAddEditComponent,
    ImageUploadComponent,
    ResizeableClassroomComponent,
    ClassroomAddEditComponent
  ],
  exports: [SinginComponent, UsersDeleteComponent, UserAddEditComponent, RoleDeleteComponent,
    RoleAddEditComponent, DeaneryAddEditComponent, DeaneryDeleteComponent,
    DepartmentAddEditComponent, DepartmentDeleteComponent, BuildingCreateComponent, BuildingDeleteComponent,
    BuildingFloorCountChangeComponent, WingAddEditComponent, ImageUploadComponent, ResizeableClassroomComponent
  ],
  entryComponents: [SinginComponent, UsersDeleteComponent, UserAddEditComponent, RoleDeleteComponent,
    RoleAddEditComponent, DeaneryAddEditComponent, DeaneryDeleteComponent,
    DepartmentAddEditComponent, DepartmentDeleteComponent, BuildingCreateComponent, BuildingDeleteComponent,
    BuildingFloorCountChangeComponent, WingAddEditComponent, ImageUploadComponent, ResizeableClassroomComponent
  ]
})
export class DialogsModule {

}
