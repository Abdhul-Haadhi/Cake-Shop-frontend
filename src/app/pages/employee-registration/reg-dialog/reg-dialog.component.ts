import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { RsaService } from 'src/app/services/rsa-service/rsa.service';

@Component({
  selector: 'app-reg-dialog',
  standalone: false,
  templateUrl: './reg-dialog.component.html',
  styleUrl: './reg-dialog.component.scss',
})
export class RegDialogComponent {
  public title: string = '';
  public loginDetailsForm: FormGroup;
  submitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // <-- inject data here
    private fb: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private _dialogRef: MatDialogRef<RegDialogComponent>,
    private messageService: MessageServiceService,
    private rsaService: RsaService
  ) {
    this.loginDetailsForm = this.fb.group({
      id: new FormControl(''),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      employeeId: new FormControl(data.id),
    });
  }

  public createLogin(): void {
    try {
      this.httpService
        .request('POST', '/create-employee-login', {
          employeeId: this.loginDetailsForm.getRawValue().employeeId,
          firstName: this.loginDetailsForm.getRawValue().firstName,
          lastName: this.loginDetailsForm.getRawValue().lastName,
          login: this.loginDetailsForm.getRawValue().login,
          password: this.rsaService.encrypt(
            this.loginDetailsForm.getRawValue().password
          ),
        })
        .then((response: any) => {
          this._dialogRef.close(true);
        });
    } catch (error: any) {
      this.messageService.showError('Login creation error!');
    }
  }
}
