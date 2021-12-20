import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {WingService} from '../../../../../services/dispatcher/wing.service';
import {Wing} from '../../../../../model/dispatcher/wing';
import {Classroom} from '../../../../../model/dispatcher/classroom';

@Component({
  selector: 'app-wing-add-edit',
  templateUrl: './wing-add-edit.component.html',
  styleUrls: ['./wing-add-edit.component.css']
})
export class WingAddEditComponent implements OnInit, OnDestroy {


  constructor(private wingService: WingService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<WingAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;
  wing: Wing;
  wingForm: FormGroup;
  loading = false;
  wingServiceSubscription: Subscription;
  floorId: string;
  editMode: boolean;
  classrooms = [];


  ngOnInit(): void {
    this.title = this.data.title;
    this.floorId = this.data.floorId;

    this.wing = this.data.wing;
    if (this.wing != null) {
      this.editMode = true;
      this.initializeForm(this.wing);
      this.classrooms = this.wing.classrooms;
    } else {
      this.editMode = false;
      this.initializeForm(new Wing());
    }

  }

  private initializeForm(wing: Wing): void {
    this.wingForm = this.fb.group({
      name: [wing.name, [Validators.required, Validators.maxLength(1000)]],
      planImage: [wing.planImage]
    });
  }

  get name(): FormControl {
    return this.wingForm.get('name') as FormControl;
  }

  get planImage(): FormControl {
    return this.wingForm.get('planImage') as FormControl;
  }


  onCancelClick(): void {
    this.dialogRef.close(null);
  }

  onConfirmClick(): void {
    this.createOrEditWing();
  }

  private createOrEditWing(): void {
    let wing;
    if (this.editMode) {
      wing = this.wing;
    } else {
      wing = new Wing();
    }

    wing.name = this.wingForm.controls.name.value;
    wing.floorId = this.floorId;
    wing.isAddedOrChanged = true;
    wing.planImage = this.wingForm.controls['planImage'].value;

    console.log(wing);
    this.dialogRef.close(wing);
  }

  getImageAsString(base64textString: string): void {
    this.wingForm.controls['planImage'].setValue(base64textString);
  }

  ngOnDestroy(): void {
    if (this.wingServiceSubscription) {
      this.wingServiceSubscription.unsubscribe();
    }
  }
}