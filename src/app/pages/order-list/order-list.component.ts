import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormControl,FormGroup, Validators } from '@angular/forms';
import {provideNativeDateAdapter} from '@angular/material/core';
import {ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import {inject} from '@angular/core';
import { OrderListServiceService } from 'src/app/services/order-list/order-list-service.service';
import { HttpService } from 'src/app/services/http.service';
import { CheckoutPageServiceService } from 'src/app/services/checkout-page/checkout-page-service.service';


interface orderStatus {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-order-list',
  standalone: false,
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnInit{
  orderListForm: FormGroup;

  startDate!: Date;
  endDate!: Date;

  orderStatus: orderStatus[] = [
    {value: 'pending', viewValue: 'Pending'},
    {value: 'inProgress', viewValue: 'In progress'},
    {value: 'done', viewValue: 'Done'},
  ];


  displayedColumns: string[] = [
    'orderId',
    'itemName',
    // 'userId',
    'customerName',
    'contactNumber',
    'email',
    'address',
    'date',
    'orderStatus',
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

  constructor(
    private fb: FormBuilder,
    private orderListService: CheckoutPageServiceService,
    // private dateFilterService: OrderListServiceService,
    private messageService: MessageServiceService,
    private httpService: HttpService
  ){

    this.orderListForm = this.fb.group({
      orderId : new FormControl('',[]),
      itemName: new FormControl('',[]),
      user : new FormControl('',[]),
      customerName : new FormControl('',[]),
      contactNumber : new FormControl('',[]),
      email : new FormControl('',[]),
      address : new FormControl('',[]),
      date : new FormControl('',[]),
      orderStatus : new FormControl('',[]),
    });

  }

  ngOnInit(): void {
    this.populateData();
  }

  public populateData(): void{
    try{
      this.orderListService.getData().subscribe({
      next: (dataList: any) => {
        console.log('Component received dataList:', dataList);
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

  filterOrders(){
    const start = this.startDate.toISOString().split('T')[0];
    const end = this.endDate.toISOString().split('T')[0];

    this.orderListService.filterByDate(start,end).subscribe({
      next: (data:any) => {
        this.dataSource.data = data;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  onSubmit(){
    try{
      this.submitted = true;
      if(this.orderListForm.invalid){
        return;
      }

      let userId = this.httpService.getUserId();
        let currentDate = new Date();
        this.orderListForm.patchValue({
          user: userId,
          date: currentDate
        });


      if(this.mode === 'add'){
        this.orderListService.serviceCall(this.orderListForm.value).subscribe({
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
      this.orderListService.editData(this.selectedData?.id, this.orderListForm.value).subscribe({
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
    this.orderListForm.disable();
    this.isButtonDisabled = true;
    }
    catch(error){
      this.messageService.showError('Action failed with error' + error);
    }
  }

  public resetData(): void{
    this.orderListForm.reset();
    this.orderListForm.updateValueAndValidity();
    this.saveButtonLabel = 'Save';
    this.orderListForm.enable();
    this.isButtonDisabled = false;
    this.submitted = false;
  }

  public editData(data: any): void {
    this.orderListForm.patchValue(data);
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
  }

  public refreshData(): void{
    this.populateData();
  }

  closeForm() {
    this.showForm = false;
    this.orderListForm.reset();
    this.submitted = false;
  }

}
