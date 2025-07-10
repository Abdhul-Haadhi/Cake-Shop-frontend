import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CheckoutPageServiceService } from 'src/app/services/checkout-page/checkout-page-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import {CurrencyPipe} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import { Router } from '@angular/router';
import { ProductStateServiceService } from 'src/app/services/product-registration/product-state-service.service';
import { HttpService } from 'src/app/services/http.service';

export interface Transaction {
  item: string;
  cost: number;
}

@Component({
  selector: 'app-checkout-page',
  standalone: false,
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss'
})
export class CheckoutPageComponent implements OnInit{
  product: any;
  BillingForm: FormGroup;

  dataSource!: MatTableDataSource<any>;
  

  // displayedColumns = ['item', 'cost'];
  // transactions: Transaction[] = [
  //   {item: 'Beach ball', cost: 4},
  //   {item: 'Towel', cost: 5},
  //   {item: 'Frisbee', cost: 2},
  //   {item: 'Sunscreen', cost: 4},
  //   {item: 'Cooler', cost: 25},
  //   {item: 'Swim suit', cost: 15},
  // ];

  displayedColumns: string[] = [
    'itemName', 
    'size', 
    'quantity', 
    'itemPrice', 
    'totalPrice'
  ];
    
    isButtonDisabled = false;
    saveButtonLabel: string = 'Save';
    submitted = false;
    mode = 'add';
    selectedData!: { id: any; };
    selection: any;
  
  
    constructor(private fb: FormBuilder,
      private checkoutService: CheckoutPageServiceService,
      private messageService: MessageServiceService,
      private router: Router,
      private productState: ProductStateServiceService, 
      private httpService: HttpService
    ){

      const nav = this.router.getCurrentNavigation();
      const products = nav?.extras.state?.['products'] || [];
      this.dataSource = new MatTableDataSource(products);

      this.product = this.productState.getProduct();
  
      this.BillingForm = this.fb.group({
        date : new FormControl('',[]),
        user : new FormControl('',[]),
        name : new FormControl('',[Validators.required]),
        email : new FormControl('',[Validators.required,Validators.email]),
        address : new FormControl('',[Validators.required,Validators.maxLength(100)]),
        contactNumber : new FormControl('',[Validators.required,Validators.minLength(10),Validators.maxLength(10)]),
      });
    }

     ngOnInit(): void {
    // this.populateData();
  }

  get grandTotal(): number {
    return this.dataSource?.data?.reduce((acc: number, item: any) => acc + (item.totalPrice || 0), 0) || 0;
  }

  public populateData(): void{
    try{
      this.checkoutService.getData().subscribe({
      next: (dataList: any) => {
        if(dataList.length <= 0){
          return;
        }

        const updatedDataList = dataList.map((item:any) => ({
          ...item,
          totalPrice:(item.price) * (item.quantity)
        }));

      this.dataSource = new MatTableDataSource(updatedDataList);

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

  onSubmit(){
    try{
      this.submitted = true;
      if(this.BillingForm.invalid){
        return;
      }


      let userId = this.httpService.getUserId();
        let currentDate = new Date();
        this.BillingForm.patchValue({
          user: userId,
          date: currentDate
        })


      if(this.mode === 'add'){
        
        this.checkoutService.serviceCall(this.BillingForm.value).subscribe({
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
    // else if(this.mode === 'edit'){
    //   this.checkoutService.editData(this.selectedData?.id, this.BillingForm.value).subscribe({
    //     next:(response) =>{
    //       let elementIndex = this.dataSource.data.findIndex((element) => element.id === this.selectedData?.id);
    //       this.dataSource.data[elementIndex] = response;
    //       this.dataSource = new MatTableDataSource(this.dataSource.data);
    //       this.messageService.showSuccess('Data edited successfully!');
    //     },
    //     error: (error) => {
    //       this.messageService.showError('Action failed with error' + error);
    //     }
    //   })
    // }
    this.mode = 'add';
    this.BillingForm.disable();
    }
    catch(error){
      this.messageService.showError('Action failed with error' + error);
    }
  }

  backToCartPage(){
    this.product = this.router.getCurrentNavigation()?.extras.state?.['product'];
    if (!this.product) {
        this.router.navigate(['/pages/cart-page']); 
      }
  }

  closePage(){
    this.router.navigate(['/pages/featured-products']);
  }
}
