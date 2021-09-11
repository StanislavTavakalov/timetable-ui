import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../services/authentication.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {LocalStorageService} from '../../../services/local-storage.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {


  constructor(private authenticationService: AuthenticationService,
              private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<SignupComponent>,
              private notifierService: NotifierService) {
  }

  signUpForm!: FormGroup;
  error!: string;
  isLoading = false;

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      patronymic: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  get email(): FormControl {
    return this.signUpForm.get('email') as FormControl;
  }

  get firstname(): FormControl {
    return this.signUpForm.get('firstname') as FormControl;
  }

  get lastname(): FormControl {
    return this.signUpForm.get('lastname') as FormControl;
  }

  get patronymic(): FormControl {
    return this.signUpForm.get('patronymic') as FormControl;
  }

  get password(): FormControl {
    return this.signUpForm.get('password') as FormControl;
  }

  getErrorText(controlName: string): string {
    const control = this.signUpForm.get(controlName) as FormControl;
    return this.getErrorMessage(control, controlName);
  }

  private getErrorMessage(control: FormControl, controlName: string): string {
    let errorMessage = '';
    if (control.errors) {
      if (control.errors['required']) {
        errorMessage = 'Field is required';
      }
      if (control.errors['minlength'] && (controlName === 'password')) {
        errorMessage = 'Min length of password- 6 symbols';
      }

      if (control.errors['minlength'] && (controlName === 'login')) {
        errorMessage = 'Min length of login - 6 symbols';
      }
    }
    return errorMessage;
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }


  onCreateClick(): void {
    if (this.signUpForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authenticationService.signup({
      id: null,
      email: this.email.value,
      firstName: this.firstname.value,
      lastName: this.lastname.value,
      patronymic: this.patronymic.value,
      password: this.password.value
    }).subscribe(() => {
        this.isLoading = false,
        this.notifierService.notify('success', 'Please check email to complete registration!');
    }, errorMessage => {
      this.isLoading = false, this.notifierService.notify('error', errorMessage);
    });

  }
}
