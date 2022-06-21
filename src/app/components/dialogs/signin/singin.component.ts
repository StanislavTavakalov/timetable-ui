import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {AuthenticationService} from '../../../services/auth/authentication.service';
import {NotifierService} from 'angular-notifier';
import {LocalStorageService} from '../../../services/local-storage.service';

@Component({
  selector: 'app-singin',
  templateUrl: './singin.component.html',
  styleUrls: ['./singin.component.css']
})
export class SinginComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
              private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<SinginComponent>,
              private notifierService: NotifierService,
              private localStorageService: LocalStorageService) {
  }

  credentialForm!: FormGroup;
  error!: string;
  isLoading = false;

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.credentialForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  get email(): FormControl {
    return this.credentialForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.credentialForm.get('password') as FormControl;
  }

  getErrorText(controlName: string): string {
    const control = this.credentialForm.get(controlName) as FormControl;
    return this.getErrorMessage(control);
  }

  private getErrorMessage(control: FormControl): string {
    let errorMessage = '';
    if (control.errors) {
      if (control.errors.required) {
        errorMessage = 'Field is required';
      }
    }
    return errorMessage;
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }


  onSubmit(): void {
    if (this.credentialForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authenticationService.signin({
      email: this.email.value,
      password: this.password.value
    }).subscribe(result => {
      this.notifierService.notify('success', 'Успешно вошли в систему'),
        this.isLoading = false,
        this.dialogRef.close(),
        this.localStorageService.setCurrentUserToken(result.token),
        this.localStorageService.setCurrentUser(result.user);
    }, errorMessage => {
      this.notifierService.notify('error', errorMessage),
        this.isLoading = false;
    });

  }
}

