import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {LoadService} from '../../../../../services/additional/load.service';
import {Load} from '../../../../../model/study-plan/structure/load';

@Component({
  selector: 'app-loads-add-edit',
  templateUrl: './load-add-edit.component.html',
  styleUrls: ['./load-add-edit.component.css']
})
export class LoadAddEditComponent implements OnInit, OnDestroy {

  constructor(private loadService: LoadService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<LoadAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;
  load: Load;
  loadForm: FormGroup;
  loading = false;
  loadServiceSubscription: Subscription;
  editMode: boolean;

  ngOnInit(): void {
    this.title = this.data.title;
    this.load = this.data.load;
    if (this.load != null) {
      this.editMode = true;
      this.initializeForm(this.load);
    } else {
      this.editMode = false;
      this.initializeForm(new Load());
    }
  }

  private initializeForm(load: Load): void {
    this.loadForm = this.fb.group({
      name: [load.name, [Validators.required, Validators.maxLength(1000)]],
    });
  }

  get name(): FormControl {
    return this.loadForm.get('name') as FormControl;
  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.editMode ? this.editLoad() : this.createNewLoad();
  }

  private createNewLoad(): void {
    const load = new Load();
    this.setValuesFromFrom(load);
    this.loading = true;

    this.loadServiceSubscription = this.loadService.createLoad(load).subscribe(result => {
        this.loading = false;
        this.dialogRef.close({isCompleted: true, object: result, errorMessage: null});
      }, error => {
        this.loading = false;
        this.dialogRef.close({
          isCompleted: true,
          object: null,
          errorMessage: error
        });
      }
    );
  }

  private editLoad(): void {
    const loadToSave = this.createLoadCopy(this.load);
    this.setValuesFromFrom(loadToSave);
    this.loading = true;
    this.loadServiceSubscription = this.loadService.updateLoad(loadToSave).subscribe(result => {
        this.loading = false;
        this.setValuesFromFrom(this.load);
        this.dialogRef.close({isCompleted: true, object: result, errorMessage: null});
      }, error => {
        this.loading = false;
        this.dialogRef.close({
          isCompleted: true,
          object: null,
          errorMessage: error
        });
      }
    );
  }

  private setValuesFromFrom(load: Load): void {
    load.name = this.loadForm.controls.name.value;
  }

  private createLoadCopy(load: Load): Load {
    const loadCopy = new Load();
    loadCopy.id = load.id;
    return loadCopy;
  }

  ngOnDestroy(): void {
    if (this.loadServiceSubscription) {
      this.loadServiceSubscription.unsubscribe();
    }
  }


}
