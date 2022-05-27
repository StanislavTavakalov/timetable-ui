import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {StudyPlan} from '../../../../model/study-plan/study-plan';
import {StudyPlanService} from '../../../../services/study-plan.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PrinterService} from '../../../../services/shared/printer.service';
import {LocalStorageService} from '../../../../services/local-storage.service';
import {UtilityService} from '../../../../services/shared/utility.service';
import {Speciality} from '../../../../model/department/speciality';
import {EducationForm} from '../../../../model/study-plan/structure/education-form';
import {SpecialityService} from '../../../../services/speciality.service';
import {ActivatedRoute} from '@angular/router';
import {StudyPlanStatus} from '../../../../model/study-plan/study-plan-status';

@Component({
  selector: 'app-study-plan-add',
  templateUrl: './study-plan-add.component.html',
  styleUrls: ['./study-plan-add.component.css']
})
export class StudyPlanAddComponent implements OnInit, OnDestroy {
  serviceSubscription: Subscription;
  serviceSubscription2: Subscription;
  serviceSubscription3: Subscription;
  loading = false;
  studyPlans = [];
  standardPlans = [];
  options = [Options.NEW, Options.EXISTING];
  selectedOption = Options.NEW;
  standardStudyPlan: StudyPlan;
  studyPlan: StudyPlan;
  filteredPlans: StudyPlan[];

  speciality: Speciality;
  specialities: Speciality[];
  educationForm: EducationForm;
  educationForms = [EducationForm.FULLTIME, EducationForm.EXTRAMURAL];

  constructor(private studyPlanService: StudyPlanService,
              private specialityService: SpecialityService,
              private dialogRef: MatDialogRef<StudyPlanAddComponent>,
              private activatedRoute: ActivatedRoute,
              public printerService: PrinterService,
              private localeStorage: LocalStorageService,
              private utilService: UtilityService,
              @Inject(MAT_DIALOG_DATA) public studyPlanId: string) {
  }

  ngOnInit(): void {
    const departmentId = this.activatedRoute.snapshot.paramMap.get('departmentId');

    this.serviceSubscription = this.studyPlanService.getStudyPlans(false).subscribe(studyPlans => {
      this.studyPlans = studyPlans;
    });

    this.serviceSubscription2 = this.studyPlanService.getStudyPlans(true).subscribe(standardPlans => {
      this.standardPlans = standardPlans.filter(studyPlan => studyPlan.status === StudyPlanStatus.SUBMITTED);
      this.filteredPlans = this.standardPlans;
    });

    this.serviceSubscription3 = this.specialityService.getSpecialities(departmentId, null).subscribe(specialities => {
      this.specialities = specialities;
    });
  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    if (this.selectedOption === Options.NEW) {
      this.localeStorage.putSelectedStandardPlan(this.utilService.copyPlanCommon(this.standardStudyPlan));
    } else if (this.selectedOption === Options.EXISTING) {
      this.localeStorage.putSelectedStandardPlan(this.utilService.copyPlanCommon(this.studyPlan));
    }
    this.dialogRef.close({isCompleted: true, object: null, errorMessage: null});
  }

  ngOnDestroy(): void {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
    if (this.serviceSubscription2) {
      this.serviceSubscription2.unsubscribe();
    }

    if (this.serviceSubscription3) {
      this.serviceSubscription3.unsubscribe();
    }
  }

  filterStandardPlansBySpeciality(value: any): void {
    this.filteredPlans = [];
    for (const studyPlan of this.standardPlans) {
      let matchByEducationForm = false;
      if (!this.educationForm) {
        matchByEducationForm = true;
      }
      if (matchByEducationForm) {
        if (studyPlan.speciality.id === value.id) {
          this.filteredPlans.push(studyPlan);
        }
      } else {
        if (studyPlan.speciality.id === value.id && studyPlan.educationForm === this.educationForm) {
          this.filteredPlans.push(studyPlan);
        }
      }
    }
  }

  filterStandardPlansByEducationForm(value): void {
    this.filteredPlans = [];
    for (const studyPlan of this.standardPlans) {
      let matchBySpeciality = false;
      if (!this.speciality) {
        matchBySpeciality = true;
      }
      if (matchBySpeciality) {
        if (studyPlan.educationForm === value) {
          this.filteredPlans.push(studyPlan);
        }
      } else {
        if (studyPlan.speciality.id === this.speciality.id && studyPlan.educationForm === value) {
          this.filteredPlans.push(studyPlan);
        }
      }
    }
  }
}

enum Options {
  NEW = 'Новый',
  EXISTING = 'На основе существующего плана'
}
