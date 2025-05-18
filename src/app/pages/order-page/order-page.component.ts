import {Component, OnInit} from '@angular/core';
import {FormBuilder,FormControl,FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { OrderPageServiceService } from 'src/app/services/order-page/order-page-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'src/app/services/http.service';
import { ProductStateServiceService } from 'src/app/services/product-registration/product-state-service.service';


@Component({
  selector: 'app-order-page',
  standalone: false,
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.scss'
})


export class OrderPageComponent implements OnInit {
  OrderForm: FormGroup;

  product: any;

  dataSource!: MatTableDataSource<any>;

  // isButtonDisabled = false;
  saveButtonLabel: string = 'Add to cart';
  submitted = false;
  mode = 'add';
  selectedData!: { id: any; };

  constructor(private fb: FormBuilder,
    private productState: ProductStateServiceService, 
    private router: Router, 
    private orderService: OrderPageServiceService,
    private messageService: MessageServiceService,
    private httpService: HttpService,
  ){

      this.product = this.productState.getProduct();

      if (!this.product) {
        this.router.navigate(['/pages/featured-products']); 
      }

      this.OrderForm = this.fb.group({
        user : new FormControl('',[]),
        date : new FormControl('',[]),
        customizeNote : new FormControl('',[]),
        size: new FormControl('',[Validators.required]),
        price: new FormControl('',[]),
        quantity : new FormControl('',[Validators.required,Validators.min(1)]),
    });
  }

  ngOnInit(): void {
    this.populateData();
  }

  public populateData(): void{
    try{
      this.orderService.getData().subscribe({
      next: (dataList: any) => {
        if(dataList.length <= 0){
          return;
        }

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
      if(this.OrderForm.invalid){
        return;
      }

      let userId = this.httpService.getUserId();
      let currentDate = new Date();
      let product = this.productState.getProduct();
      let itemPrice = product ? product.price:null;
      this.OrderForm.patchValue({
        user: userId,
        date: currentDate,
        price: itemPrice,
      })

      if(this.mode === 'add'){
        this.orderService.serviceCall(this.OrderForm.value).subscribe({
          next: (response: any) => {
            if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0){
                    this.dataSource = new MatTableDataSource([response, ...this.dataSource.data,]);
                  }
                  else{
                      this.dataSource = new MatTableDataSource([response]);
                  }
                  this.messageService.showSuccess('This item has been added to your cart');
          },
          error: (error) =>{
            this.messageService.showError('Action failed with error' + error);
          }
        });
    }
    this.mode = 'add';
    // this.OrderForm.disable();
    // this.isButtonDisabled = true;
    }
    catch(error){
      this.messageService.showError('Action failed with error' + error);
    }
  }

  goToCart(){
    this.router.navigate(['/pages/cart-page']);
  }

  closePage(){
    this.router.navigate(['/pages/featured-products']);
  }

  
}


