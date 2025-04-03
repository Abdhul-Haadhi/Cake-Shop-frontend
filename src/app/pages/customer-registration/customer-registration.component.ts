import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {FormBuilder,FormControl,FormGroup, Validators } from '@angular/forms';
import {provideNativeDateAdapter} from '@angular/material/core';
import {ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import {JsonPipe} from '@angular/common';
import {inject} from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CustomerRegistrationFormService } from 'src/app/services/customer-registration/customer-registration-form.service';


interface CustomerCategory {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-customer-registration',
  standalone: false,
  templateUrl: './customer-registration.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './customer-registration.component.scss',
})
export class CustomerRegistrationComponent implements OnInit{
  CustRegForm: FormGroup;

  private readonly _formBuilder = inject(FormBuilder);

  readonly toppings = this._formBuilder.group({
    LoyaltyCustomer: false,
  });

  customerCategory: CustomerCategory[] = [
    {value: 'single', viewValue: 'Single order'},
    {value: 'bulk', viewValue: 'Bulk order'},
  ];


  displayedColumns: string[] = [
    'customerName',
    'email',
    'address',
    'contactNumber',
    'birthday',
    'customerCategory',
    'loyaltyCustomer',
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
    private custService: CustomerRegistrationFormService,
    private messageService: MessageServiceService,
  ){

    this.CustRegForm = this.fb.group({
      customerName : new FormControl('',[Validators.required]),
      email : new FormControl('',[Validators.email]),
      address : new FormControl('',[Validators.required,Validators.maxLength(100)]),
      contactNumber : new FormControl('',[Validators.required,Validators.minLength(10),Validators.maxLength(10)]),
      birthday : new FormControl('',[Validators.required]),
      customerCategory : new FormControl('',[Validators.required]),
      loyaltyCustomer: new FormControl(''),
    });
  }


  ngOnInit(): void {
    this.populateData();
  }

  public populateData(): void{
    try{
      this.custService.getData().subscribe({
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
      if(this.CustRegForm.invalid){
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


        this.custService.serviceCall(this.CustRegForm.value).subscribe({
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
      this.custService.editData(this.selectedData?.id, this.CustRegForm.value).subscribe({
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
    this.CustRegForm.disable();
    this.isButtonDisabled = true;
    }
    catch(error){
      this.messageService.showError('Action failed with error' + error);
    }
  }



  public resetData(): void{
    this.CustRegForm.reset();
    this.CustRegForm.updateValueAndValidity();
    this.saveButtonLabel = 'Save';
    this.CustRegForm.enable();
    this.isButtonDisabled = false;
    this.submitted = false;
  }

  public editData(data: any): void {
    this.CustRegForm.patchValue(data);
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
  }

  public deleteData(data: any): void {
    
    const id = data.id;

    try{
      this.custService.deleteData(id).subscribe({
        next: (response) =>{
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
