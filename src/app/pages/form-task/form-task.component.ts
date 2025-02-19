import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { TaskServiceFormService } from 'src/app/services/task-service/task-service-form.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

const ELEMENT_DATA: any[] = [
  {
    name: 'Hydrogen',
    phoneNumber: '1234567890',
    email: 'hydrogen@example.com',
    deliveryAddress: 'H',
  },
];

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-form-task',
  standalone: false,
  templateUrl: './form-task.component.html',
  styleUrl: './form-task.component.scss',
})
export class FormTaskComponent implements OnInit {
  taskForm: FormGroup;

  // emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  displayedColumns: string[] = [
    'name',
    'phoneNumber',
    'email',
    'deliveryAddress',
    'actions',
  ];
  dataSource!: MatTableDataSource<any>;

  saveButtonLabel: string = 'Save';
  mode = 'add';
  selectedData: any;
  isButtonDisabled = false;
  submitted = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  matcher = new MyErrorStateMatcher();

  constructor(
    private fb: FormBuilder,
    private taskService: TaskServiceFormService,
    private messageService: MessageServiceService
  ) {
    this.taskForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('',[Validators.minLength(10),Validators.maxLength(10),this.customPhoneNumberValidator]),
      email: new FormControl('',Validators.email),
      deliveryAddress: new FormControl('',[Validators.minLength(3),Validators.maxLength(40)]),
    });
  }
  ngOnInit(): void {
    this.populateData();
  }

  customPhoneNumberValidator(control: AbstractControl){
    if(!control){
      return null;
    }

    const controlValue = +control.value;
    
    if(isNaN(controlValue)){
      return{
        customPhoneNumberValidator: true
      }
    }
    if (!Number.isInteger(controlValue)){
      return{
        customPhoneNumberValidator: true
      }
    }
    return null;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // public populateData():void{
  //   try{
  //     this.taskService.getData().subscribe((response: any) => {
  //       console.log('get data response',response);

  //       this.dataSource = new MatTableDataSource(response);
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;

  //     },
  //   (error) => {
  //     this.messageService.showError("Action failed with error" + error);
  //   });
  //   }
  //   catch(error){
  //     this.messageService.showError("Action failed with error" + error);
  //   }
  // }

  public populateData(): void {
    try {
      this.taskService.getData().subscribe({
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
        },
      });
    } catch (error) {
      this.messageService.showError('Action failed with error' + error);
    }
  }

  onSubmit() {
    try {
      console.log('Mode' + this.mode);
      console.log('Order details submitted');
      console.log(this.taskForm.value);

      this.submitted = true;

      if(this.taskForm.invalid){
        return;
      }

      if (this.mode === 'add') {
        // this.taskService.serviceCall(this.taskForm.value).subscribe((response) => {
        //     if (
        //       this.dataSource && this.dataSource.data && this.dataSource.data.length > 0
        //     ) {
        //       this.dataSource = new MatTableDataSource([response,...this.dataSource.data,]);
        //     } else {
        //       this.dataSource = new MatTableDataSource([response]);
        //     }
        //     this.messageService.showSuccess('Data saved successfully');
        //   });

        this.taskService.serviceCall(this.taskForm.value).subscribe({
          next: (response: any) => {
            if(this.dataSource && this.dataSource.data && this.dataSource.data.length > 0){
              this.dataSource = new MatTableDataSource([response,...this.dataSource.data,]);
            }
            else {
                this.dataSource = new MatTableDataSource([response]);
                }
                this.messageService.showSuccess('Data saved successfully');
          },
          error: (error) => {
            this.messageService.showError('Action failed with error' + error);
          }
        });
      } else if (this.mode === 'edit') {
        // this.taskService.editData(this.selectedData?.id, this.taskForm.value).subscribe((response) => {
        //     let elementIndex = this.dataSource.data.findIndex((element) => element.id === this.selectedData?.id);
        //     this.dataSource.data[elementIndex] = response;
        //     this.dataSource = new MatTableDataSource(this.dataSource.data);
        //     this.messageService.showSuccess('Data edited successfully');
        //   });

        this.taskService.editData(this.selectedData?.id, this.taskForm.value).subscribe({
          next: (response: any)=>{
            let elementIndex = this.dataSource.data.findIndex((element) => element.id === this.selectedData?.id);
            this.dataSource.data[elementIndex] = response;
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            this.messageService.showSuccess('Data edited successfully');
          },
          error: (error) => {
            this.messageService.showError('Action failed with error' + error);
          }
        });
      }
      this.mode = 'add';
      this.taskForm.disable();
      this.isButtonDisabled = true;
    } catch (error) {
      console.log(error);
      this.messageService.showError('Action failed with error' + error);
    }
  }

  public resetData(): void {
    this.taskForm.reset();
    // this.taskForm.setErrors = null;
    this.taskForm.updateValueAndValidity();
    this.saveButtonLabel = 'Save';
    this.taskForm.enable();
    this.isButtonDisabled = false;
    this.submitted = false;
  }

  public editData(data: any): void {
    this.taskForm.patchValue(data);
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
  }
  public deleteData(data: any): void {
    const id = data.id;
    try {
      // this.taskService.deleteData(id).subscribe((response) => {
      //   const index = this.dataSource.data.findIndex(
      //     (element) => element.id === id
      //   );

      //   if (index !== -1) {
      //     this.dataSource.data.splice(index, 1);
      //   }
      //   this.dataSource = new MatTableDataSource(this.dataSource.data);
      //   this.messageService.showSuccess('Data deleted successfully');
      // });

      this.taskService.deleteData(id).subscribe({
        next: (response: any) =>{
          const index = this.dataSource.data.findIndex(
                (element) => element.id === id
              );
      
              if (index !== -1) {
                this.dataSource.data.splice(index, 1);
              }
              this.dataSource = new MatTableDataSource(this.dataSource.data);
              this.messageService.showSuccess('Data deleted successfully');
        },
        error: (error)=>{
          this.messageService.showError('Action failed with error' + error);
        }
      });
    } catch (error) {
      console.log(error);
      this.messageService.showError('Action failed with error' + error);
    }
  }
  public refreshData(): void {
    this.populateData();
  }
}
