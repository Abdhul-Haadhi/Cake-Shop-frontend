import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl, FormBuilder,FormControl,FormGroup, Validators } from '@angular/forms';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { EmployeeRegistrationFormService } from 'src/app/services/employee-registration/employee-registration-form.service';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class EmployeeRegistrationComponent implements OnInit  {
  EmpRegForm: FormGroup;

  jobRole: JobRole[] = [
    {value: 'cakeMaker', viewValue: 'Cake maker'},
    {value: 'decorator', viewValue: 'Decorator'},
  ];
  

  displayedColumns: string[] = [
    'employeeNumber',
    'fullName',
    'callingName',
    'nic',
    'birthday',
    'age',
    'address',
    'contactNumber',
    'gender',
    'email',
    'emergencyContact',
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
 
  

  constructor(private fb: FormBuilder,
    private empService: EmployeeRegistrationFormService,
    private messageService: MessageServiceService,
  ){
    this.EmpRegForm = this.fb.group({
      employeeNumber : new FormControl('',[Validators.required]),
      fullName : new FormControl('',[Validators.required]),
      callingName : new FormControl('',[Validators.required]),
      nic : new FormControl('',[Validators.required,Validators.minLength(9),Validators.maxLength(12)]),
      birthday : new FormControl('',[Validators.required]),
      age : new FormControl('',[Validators.required,Validators.min(20),Validators.max(60),this.customAgeValidator]),
      address : new FormControl('',[Validators.required,Validators.maxLength(100)]),
      contactNumber : new FormControl('',[Validators.required,Validators.minLength(10),Validators.maxLength(10)]),
      gender : new FormControl('',[Validators.required]),
      email : new FormControl('',[Validators.email]),
      emergencyContact : new FormControl('',[Validators.required,Validators.minLength(10),Validators.maxLength(10)]),
      jobRole : new FormControl('',[Validators.required]),
    });
  }
  ngOnInit(): void {
    this.populateData();
  }

  customAgeValidator(control:AbstractControl){
    if(!control){
      return null;
    }

    const controlValue = +control.value;

    if(isNaN(controlValue)){
      return{
        customAgeValidator: true
      };
    }

    if(!Number.isInteger(controlValue)){
      return{
        customAgeValidator: true
      }
    }
    return null;
  }
  
  public populateData(): void{
    try{
      this.empService.getData().subscribe({
      next: (dataList: any) => {
        if(dataList.length <= 0){
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
    catch(error){
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

  onSubmit(){
      try{

        this.submitted = true;

        if(this.EmpRegForm.invalid){
          return;
        }

        if(this.mode === 'add'){

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
              if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0){
                      this.dataSource = new MatTableDataSource([response, ...this.dataSource.data,]);
                    }
                    else{
                        this.dataSource = new MatTableDataSource([response]);
                    }
                    this.messageService.showSuccess('Data saved successfully!');
            },
            error: (error) =>{
              this.messageService.showError('Action failed with error' + error);
            }
          });
      }
      else if(this.mode === 'edit'){
        this.empService.editData(this.selectedData?.id, this.EmpRegForm.value).subscribe({
          next:(response) =>{
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
      catch(error){
        this.messageService.showError('Action failed with error' + error);
      }
  }

  
  
  public resetData(): void{
    this.EmpRegForm.reset();
    this.EmpRegForm.updateValueAndValidity();
    this.saveButtonLabel = 'Save';
    this.EmpRegForm.enable();
    this.isButtonDisabled = false;
    this.submitted = false;
  }

  public editData(data: any): void {
    this.EmpRegForm.patchValue(data);
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
    // this.EmpRegForm = data;
  }

  public deleteData(data: any): void {
    
    const id = data.id;

    try{
      this.empService.deleteData(id).subscribe({
        next: (Response) =>{
          const index = this.dataSource.data.findIndex((element) => element.id === id);
        if(index !== -1){
          this.dataSource.data.splice(index, 1);
        }
        this.dataSource = new MatTableDataSource(this.dataSource.data);
        this.messageService.showSuccess('Data edited successfully!');
        },
        error: (error) =>{
          this.messageService.showError('Action failed with error' + error);
        }
      });
    }
    catch(error){
      this.messageService.showError('Action failed with error' + error);
    }

    
  }
  public refreshData(): void{
    this.populateData();
  }
}
 