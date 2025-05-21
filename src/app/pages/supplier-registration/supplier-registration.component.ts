import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { SupplierRegistrationFormService } from 'src/app/services/sipplier-registration/supplier-registration-form.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-supplier-registration',
  standalone: false,
  templateUrl: './supplier-registration.component.html',
  styleUrl: './supplier-registration.component.scss'
})
export class SupplierRegistrationComponent implements OnInit {
  SuppRegForm: FormGroup;

  //set initial last id to 1
  lastID: number = 1;


  displayedColumns: string[] = [
    'companyName',
    'businessRegNumber',
    'contactPersonName',
    'contactPersonDesignation',
    'contactPersonPhoneNumber',
    'contactPersonEmailAddress',
    'address',
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
    private httpService: HttpService,
    private suppService: SupplierRegistrationFormService,
    private messageService: MessageServiceService,
  ) {
    this.SuppRegForm = this.fb.group({
      companyName: new FormControl('', [Validators.required]),
      businessRegNumber: new FormControl('', [Validators.required]),
      supplierID: new FormControl(''),
      contactPersonName: new FormControl('', [Validators.required]),
      contactPersonDesignation: new FormControl('', [Validators.required]),
      contactPersonPhoneNumber: new FormControl('', [Validators.required]),
      contactPersonEmailAddress: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl('', [Validators.required, Validators.maxLength(150)]),
    });
  }
  ngOnInit(): void {
    this.populateData();

  }



  public populateData(): void {
    try {
      this.suppService.getData().subscribe({
        next: (dataList: any) => {
          if (dataList.length <= 0) {
            //if there are no data supplier id will be 1
            this.SuppRegForm.patchValue({ supplierID: this.lastID });
            return;
          }

          this.dataSource = new MatTableDataSource(dataList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          //get the last id from the data list
          this.lastID = dataList[dataList.length - 1].id;
          console.log('lastID', this.lastID);
          //set the last id to the supplier id
          this.SuppRegForm.patchValue({ supplierID: this.lastID + 1 });
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
      if (this.SuppRegForm.invalid) {
        return;
      }
      if (this.mode === 'add') {
        this.suppService.serviceCall(this.SuppRegForm.value).subscribe({
          next: (response: any) => {
            if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0) {
              this.dataSource = new MatTableDataSource([response, ...this.dataSource.data,]);
            }
            else {
              this.dataSource = new MatTableDataSource([response]);
            }
            this.messageService.showSuccess('Data saved successfully!');
          },
          error: (error) => {
            this.messageService.showError('Action failed with error' + error);
          }
        });
      }
      else if (this.mode === 'edit') {
        this.suppService.editData(this.selectedData?.id, this.SuppRegForm.value).subscribe({
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
      this.SuppRegForm.disable();
      this.isButtonDisabled = true;
    }
    catch (error) {
      this.messageService.showError('Action failed with error' + error);
    }
  }



  public resetData(): void {
    this.SuppRegForm.reset();
    this.SuppRegForm.updateValueAndValidity();
    this.saveButtonLabel = 'Save';
    this.SuppRegForm.enable();
    this.isButtonDisabled = false;
    this.submitted = false;

    setTimeout(() => {
      this.populateData();
    }, 200);
  }

  public editData(data: any): void {
    this.SuppRegForm.patchValue(data);

    //when edit patch id value to formcontrol supplierID
    this.SuppRegForm.patchValue({
      supplierID: data.id,
    });
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
    // this.EmpRegForm = data;
  }

  public deleteData(data: any): void {

    const id = data.id;

    try {
      this.suppService.deleteData(id).subscribe({
        next: (Response) => {
          const index = this.dataSource.data.findIndex((element) => element.id === id);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
          }
          this.dataSource = new MatTableDataSource(this.dataSource.data);
          this.messageService.showSuccess('Data edited successfully!');
          this.populateData();
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
}
