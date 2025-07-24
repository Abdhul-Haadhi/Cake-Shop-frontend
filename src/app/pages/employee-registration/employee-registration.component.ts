import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeRegistrationFormService } from 'src/app/services/employee-registration/employee-registration-form.service';
import { MatSort } from '@angular/material/sort';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { RegDialogComponent } from './reg-dialog/reg-dialog.component';

interface JobRole {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-employee-registration',
  standalone: false,
  templateUrl: './employee-registration.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './employee-registration.component.scss',
})

export class EmployeeRegistrationComponent implements OnInit {
  EmpRegForm: FormGroup;

  maxDate: Date;

  jobRole: JobRole[] = [
    { value: 'cakeMaker', viewValue: 'Cake maker' },
    { value: 'decorator', viewValue: 'Decorator' },
  ];


  displayedColumns: string[] = [
    'employeeNumber',
    'fullName',
    'nic',
    'birthday',
    'address',
    'contactNumber',
    'gender',
    'email',
    'jobRole',
    'actions',
  ];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isButtonDisabled = false;
  saveButtonLabel: string = 'Save';
  submitted = false;
  mode = 'add';
  selectedData!: { id: any; };
  showForm = false;



  constructor(private fb: FormBuilder,
    private empService: EmployeeRegistrationFormService,
    private messageService: MessageServiceService,
    private notificationService: NotificationService,
    private _dialog: MatDialog
  ) {

    const today = new Date();
    this.maxDate = new Date(
      today.getFullYear() - 20,
      today.getMonth(),
      today.getDate()
    );

    this.EmpRegForm = this.fb.group({
      employeeNumber: new FormControl('', [Validators.required, Validators.pattern('^EMP[0-9]+$')]),
      fullName: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z ]+$')]),
      nic: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{9}[vVxX]$|^[0-9]{12}')]),
      birthday: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required, Validators.maxLength(150)]),
      contactNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      gender: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      jobRole: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.populateData();
  }


  public populateData(): void {
    try {
      this.empService.getData().subscribe({
        next: (dataList: any) => {
          if (dataList.length <= 0) {
            return;
          }

          this.dataSource = new MatTableDataSource(dataList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (error) => {
          this.messageService.showError('Action failed with error' + error);
        }
      });
    }
    catch (error) {
      this.messageService.showError('Action failed with error' + error);
    }

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSubmit() {
    try {
      this.submitted = true;
      if (this.EmpRegForm.invalid) {
        return;
      }
      if (this.mode === 'add') {

        //   this.empService.serviceCall(this.EmpRegForm.value).subscribe((Response)=>{
        //     if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0){
        //       this.dataSource = new MatTableDataSource([Response, ...this.dataSource.data,]);
        //     }
        //     else{
        //         this.dataSource = new MatTableDataSource([Response]);
        //     }
        //     this.messageService.showSuccess('Data saved successfully!');

        // });


        this.empService.serviceCall(this.EmpRegForm.value).subscribe({
          next: (response: any) => {
            if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0) {
              this.dataSource = new MatTableDataSource([response, ...this.dataSource.data,]);
            }
            else {
              this.dataSource = new MatTableDataSource([response]);
            }
            this.messageService.showSuccess('Data saved successfully!');
            this.addNotification("Employee Added Successfully");
          },
          error: (error) => {
            this.messageService.showError('Action failed with error' + error);
          }
        });
      }
      else if (this.mode === 'edit') {
        this.empService.editData(this.selectedData?.id, this.EmpRegForm.value).subscribe({
          next: (response) => {
            let elementIndex = this.dataSource.data.findIndex((element) => element.id === this.selectedData?.id);
            this.dataSource.data[elementIndex] = response;
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            this.messageService.showSuccess('Data edited successfully!');
          },
          error: (error) => {
            this.messageService.showError('Action failed with error' + error);
          }
        })
      }
      this.mode = 'add';
      this.EmpRegForm.disable();
      this.isButtonDisabled = true;
    }
    catch (error) {
      this.messageService.showError('Action failed with error' + error);
    }
  }



  public resetData(): void {
    this.EmpRegForm.reset();
    this.EmpRegForm.updateValueAndValidity();
    this.saveButtonLabel = 'Save';
    this.EmpRegForm.enable();
    this.isButtonDisabled = false;
    this.submitted = false;
  }

  public editData(data: any): void {
    const patchedData = { ...data };
    if (patchedData.birthday) {
      patchedData.birthday = new Date(patchedData.birthday);

      // const dateParts = patchedData.birthday.split('-');
      // patchedData.birthday = new Date(
      //   +dateParts[0],
      //   +dateParts[1] - 1,
      //   +dateParts[2],
      //   12, 0, 0
      // );
    }
    this.EmpRegForm.patchValue(patchedData);
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
  }

  public deleteData(data: any): void {
    const id = data.id;
    try {
      this.empService.deleteData(id).subscribe({
        next: (Response) => {
          const index = this.dataSource.data.findIndex((element) => element.id === id);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
          }
          this.dataSource = new MatTableDataSource(this.dataSource.data);
          this.messageService.showSuccess('Data edited successfully!');
        },
        error: (error) => {
          this.messageService.showError('Action failed with error' + error);
        }
      });
    }
    catch (error) {
      this.messageService.showError('Action failed with error' + error);
    }
  }


  public refreshData(): void {
    this.populateData();
  }

  public addNotification(details: any): void {
    this.notificationService.addNotification('Employee Added Successfully', 'success', 1);
  }

  closeForm() {
    this.showForm = false;
    this.EmpRegForm.reset();
    this.submitted = false;
  }

  public addLoginCredentials(employee: any): void {
    try {
          const dialogRef = this._dialog.open(RegDialogComponent, {
      data: {id: employee.id}
    });

    dialogRef.afterClosed().subscribe({
      next: (value: any) => {
        if (value) {
          this.messageService.showSuccess('Employee Login Details Added Successfully!');
        }
      }
    })
    }  catch(error: any) {
      this.messageService.showError('Action Failed!');
    }
  }

}
