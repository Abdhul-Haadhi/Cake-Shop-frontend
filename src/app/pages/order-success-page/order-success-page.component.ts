import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { inject } from '@angular/core';
import { OrderListServiceService } from 'src/app/services/order-list/order-list-service.service';
import { HttpService } from 'src/app/services/http.service';
import { CheckoutPageServiceService } from 'src/app/services/checkout-page/checkout-page-service.service';
import { OrderPageServiceService } from 'src/app/services/order-page/order-page-service.service';

@Component({
  selector: 'app-order-success-page',
  standalone: false,
  templateUrl: './order-success-page.component.html',
  styleUrl: './order-success-page.component.scss'
})
export class OrderSuccessPageComponent {
  orderSuccessForm: FormGroup;

  displayedColumns: string[] = [
    'orderId',
    'itemName',
    'customerName',
    'color',
    'customizeNote',
    'size',
    'quantity',
    'totalPrice',
    'date',
    'status',
  ];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isButtonDisabled = false;
  saveButtonLabel: string = 'Save';
  submitted = false;
  mode = 'add';
  selectedData!: { orderId: any; };
  showForm = false;
  selectedRow: any = null;

  constructor(
    private fb: FormBuilder,
    private orderSuccessService: CheckoutPageServiceService,
    private orderPage: OrderPageServiceService,
    // private dateFilterService: OrderListServiceService,
    private messageService: MessageServiceService,
    private httpService: HttpService
  ) {

    this.orderSuccessForm = this.fb.group({
      orderId: new FormControl('', []),
      itemName: new FormControl('', []),
      customerName: new FormControl('', []),
      contactNumber: new FormControl('', []),
      email: new FormControl('', []),
      address: new FormControl('', []),
      status: new FormControl('', []),
      user: new FormControl('', []),
      date: new FormControl('', []),
      size: new FormControl('',[]),
      color: new FormControl('',[]),
      customizeNote: new FormControl('',[]),
      totalPrice: new FormControl('',[]),
      quantity: new FormControl('',[]),
    });

  }

  ngOnInit(): void {
    this.populateData();
  }

  public populateData(): void {
    try {
      this.orderSuccessService.getData().subscribe({
        next: (dataList: any) => {
          console.log('Component received dataList:', dataList);
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

  onRowClicked(row: any) {
    this.selectedRow = row;
    console.log('Selected Row:', row);
  }

  // onSubmit() {
  //   try {
  //     this.submitted = true;
  //     if (this.orderSuccessForm.invalid) {
  //       return;
  //     }

      
  //     if (this.mode === 'edit') {

  //       const updatedStatus = this.orderSuccessForm.value.status;
  //       if (!updatedStatus) {
  //         this.messageService.showError('Please select a status to update.');
  //         return;
  //       }

  //       const orderId = this.selectedData?.orderId;

  //       this.orderSuccessService.editData(orderId, { status: updatedStatus }).subscribe({
  //         next: (response) => {
  //           let elementIndex = this.dataSource.data.findIndex((element) => element.orderId === orderId);
  //           this.dataSource.data[elementIndex] = response;
  //           this.dataSource = new MatTableDataSource(this.dataSource.data);
  //           this.messageService.showSuccess('Data edited successfully!');
  //           this.populateData();
  //         },
  //         error: (error) => {
  //           this.messageService.showError('Action failed with error' + error);
  //         }
  //       })
  //     }

  //     this.mode = 'add';
  //     this.orderSuccessForm.disable();
  //     this.isButtonDisabled = true;

  //   }
  //   catch (error) {
  //     this.messageService.showError('Action failed with error' + error);
  //   }
  // }


  public resetData(): void {
    this.orderSuccessForm.reset();
    this.orderSuccessForm.updateValueAndValidity();
    this.saveButtonLabel = 'Save';
    this.orderSuccessForm.enable();
    this.isButtonDisabled = false;
    this.submitted = false;
  }

  public editData(data: any): void {
    this.orderSuccessForm.patchValue(data);
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
  }

  public refreshData(): void {
    this.populateData();
  }

  closeForm() {
    this.orderSuccessForm.reset();
    this.showForm = false;
    this.submitted = false;
  }
}
