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
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from 'src/app/services/notification-service/notification.service';

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

  selectedFile: File | null = null;

  displayedColumns: string[] = [
    'itemName', 
    'size', 
    'quantity', 
    'itemPrice', 
    'totalPrice'
  ];
    
    isButtonDisabled = false;
    saveButtonLabel: string = 'Order';
    submitted = false;
    mode = 'add';
    selectedData!: { id: any; };
    selection: any;
    isFileSelected = false;
    selectedImageUrl: any;
  
  
    constructor(private fb: FormBuilder,
      private checkoutService: CheckoutPageServiceService,
      private messageService: MessageServiceService,
      private router: Router,
      private productState: ProductStateServiceService, 
      // private notificationService: NotificationService,
      private httpService: HttpService,
      private sanitizer: DomSanitizer,
    ){

      const nav = this.router.getCurrentNavigation();
      const products = nav?.extras.state?.['products'] || [];
      this.dataSource = new MatTableDataSource(products);

      this.product = this.productState.getProduct();
  
      this.BillingForm = this.fb.group({
        date : new FormControl('',[]),
        user : new FormControl('',[]),
        orderId : new FormControl('',[]),
        totalPrice: new FormControl('',[]),
        items: new FormControl([],[]),
        selectedSize: new FormControl([],[]),
        quantities: new FormControl([],[]),
        customerName : new FormControl([],[Validators.required]),
        email : new FormControl('',[Validators.required,Validators.email]),
        address : new FormControl('',[Validators.required,Validators.maxLength(150)]),
        contactNumber : new FormControl([],[Validators.required, Validators.pattern('^[0-9]{10}$')]),
        orderStatus : new FormControl([],[]), 
        receipt: new FormControl(''),
        receiptName: new FormControl(''),
        receiptType: new FormControl(''),
      });
    }


  onReceiptFileSelected(event: any): void {
    this.isFileSelected = true;
    
    if (event.target?.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      this.selectedImageUrl = url;
      this.isFileSelected = true;
      this.BillingForm.get('receipt')?.setValue(file);
      this.BillingForm.get('receiptName')?.setValue(file.name);
      this.BillingForm.get('receiptType')?.setValue(file.type);
    }
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

    }
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

  // onSubmit(){
  //   try{
  //     console.log(this.BillingForm.value);
  //     // console.log(this.dataSource.data);
  //     this.submitted = true;
  //     if(this.BillingForm.invalid || !this.selectedFile){
  //       return;
  //     }

  //     let userId = this.httpService.getUserId();
  //       let currentDate = new Date();
  //       this.BillingForm.patchValue({
  //         user: userId,
  //         date: currentDate
  //       });


  //       const formDataDto =  this.prepareOrderFormData(this.BillingForm.value, this.dataSource.data)

  //     if(this.mode === 'add'){
        
  //       this.checkoutService.serviceCall(this.prepareFormData()).subscribe({
  //         next: (response: any) => {
  //           if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0){
  //                   this.dataSource = new MatTableDataSource([response, ...this.dataSource.data,]);
  //                 }
  //                 else{
  //                     this.dataSource = new MatTableDataSource([response]);
  //                 }
  //                 this.messageService.showSuccess('Data saved successfully!');
  //         },
  //         error: (error) =>{
  //           this.messageService.showError('Action failed with error' + error);
  //         }
  //       });
  //   }
    
  //   this.mode = 'add';
  //   this.BillingForm.disable();
  //   this.isButtonDisabled = true;
  //   }
  //   catch(error){
  //     this.messageService.showError('Action failed with error' + error);
  //   }
  // }

  onSubmit() {
  try {
    this.submitted = true;

    if (this.BillingForm.invalid || !this.selectedFile) {
      return;
    }

    const userId = this.httpService.getUserId();
    const currentDate = new Date();

    this.BillingForm.patchValue({
      user: userId,
      date: currentDate
    });

    const formDataDto = this.prepareFormData();

    if (this.mode === 'add') {
      this.checkoutService.serviceCall(formDataDto).subscribe({
        next: (response: any) => {
          this.messageService.showSuccess('Order placed successfully!');
      
          this.dataSource = new MatTableDataSource<any>([]);
          this.BillingForm.disable();
          this.isButtonDisabled = true;

      
          // this.router.navigate(['/pages/featured-products']);
        },
        error: (error) => {
          this.messageService.showError('Action failed with error: ' + error);
        }
      });
    }

    this.mode = 'add';

  } catch (error) {
    this.messageService.showError('Action failed with error: ' + error);
  }
}


  public prepareFormData(): FormData {
    const formData = new FormData();
    // demoFormData.append('demoForm', this.demoForm.value);
    console.log(JSON.stringify(this.prepareOrderFormData(this.BillingForm.value, this.dataSource.data)));
    formData.append('orderDetailsForm', new Blob([JSON.stringify(this.prepareOrderFormData(this.BillingForm.value, this.dataSource.data))], { type: 'application/json' }));
    
    if (this.isFileSelected) {
      formData.append('receipt', this.BillingForm.get('receipt')?.value, this.BillingForm.get('receipt')?.value.name);
    } else {
      const imageBlob = this.base64ToBlob(this.BillingForm.get('image')?.value, this.BillingForm.get('imageType')?.value);
      const file = new File([imageBlob], this.BillingForm.get('imageName')?.value, { type: this.BillingForm.get('imageType')?.value });
      formData.append('image', file, file.name);
    }

    return formData;
  }

  base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  public prepareOrderFormData(billingFormData: any, orderItemsData: any): any {


    let orderItems: Object[] = [];

    orderItemsData.forEach((item: any) => {
      const itemData = {
        orderId: null,
        itemName: item.item,
        itemQty: item.quantity,
        itemPrice: item.totalPrice
      };

      orderItems.push(itemData);
    });

    const billingData = {
      customerName: billingFormData.customerName,
      email: billingFormData.email,
      address: billingFormData.address,
      contactNumber: billingFormData.contactNumber,
      receipt: billingFormData.receipt,
    };

    const orderDetailsDto = {
      user: this.httpService.getUserId(),
      date: new Date(),
      totalPrice: this.grandTotal,
      items: orderItems,

      billingFormDto: billingData
    };

    return orderDetailsDto;
  }

  backToCartPage(){
    this.product = this.router.getCurrentNavigation()?.extras.state?.['product'];
    if (!this.product) {
        this.router.navigate(['/pages/cart-page']); 
      }
  }

  // public addNotification(details: any): void{
  //   this.notificationService.addNotification('Order placed Successfully', 'success',1);
  // }

  closePage(){
    this.router.navigate(['/pages/featured-products']);
  }

  public resetData(): void{
    this.BillingForm.reset();
    this.BillingForm.updateValueAndValidity();
    this.saveButtonLabel = 'Order';
    this.BillingForm.enable();
    this.isButtonDisabled = false;
    this.submitted = false;
  }
}
