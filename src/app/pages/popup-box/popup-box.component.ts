// import { Component, Inject, OnInit } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { Router } from '@angular/router';
// import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
// import { ProductRegistrationFormService } from 'src/app/services/product-registration/product-registration-form.service';
// import { ProductStateServiceService } from 'src/app/services/product-registration/product-state-service.service';

// @Component({
//   selector: 'app-popup-box',
//   standalone: false,
//   templateUrl: './popup-box.component.html',
//   styleUrl: './popup-box.component.scss'
// })
// export class PopupBoxComponent implements OnInit{


//   // products: any[]=[];

//   constructor(
//     private productState: ProductStateServiceService, 
//     private productService: ProductRegistrationFormService,
//     private messageService: MessageServiceService,
//     private router: Router, @Inject(MAT_DIALOG_DATA) public data: any,
//     public dialogRef: MatDialogRef<PopupBoxComponent>,
//   ) {

//   }


//   ngOnInit(): void {
//     this.getProducts();
//   }


//   closePopup(): void {
//     this.dialogRef.close();
//   }

//   goToOrderPage() {
//     this.productState.setProduct(this.data);
//     this.dialogRef.close();
//     this.router.navigate(['/pages/order-page'])
//     //   {
//     //   state: {product:this.data}
//     // });

//     // this.dialogRef.close(); 
//   }

//   public getProducts(){
//     try{
//       // this.products = [];
//       this.productService.getAllProducts().subscribe(response =>{
//         response.forEach((element:(any)) =>{
//           element.image = 'data:image/jpge;base64,'+element.image;
//           // this.products.push(element);
//         })
//       });
//     }
//     catch(error){
//       this.messageService.showError('Action failed with error' + error);
//     }
//   }

// }


import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { ProductRegistrationFormService } from 'src/app/services/product-registration/product-registration-form.service';
import { ProductStateServiceService } from 'src/app/services/product-registration/product-state-service.service';

@Component({
  selector: 'app-popup-box',
  standalone: false,
  templateUrl: './popup-box.component.html',
  styleUrl: './popup-box.component.scss'
})
export class PopupBoxComponent implements OnInit {

  products: any[] = [];


  constructor(private productState: ProductStateServiceService,
    private router: Router,
    private productService: ProductRegistrationFormService,
    private messageService: MessageServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PopupBoxComponent>) { }



  ngOnInit(): void {
    this.getProducts();
  }


  closePopup(): void {
    this.dialogRef.close();
  }

  goToOrderPage() {
    this.productState.setProduct(this.data);
    this.dialogRef.close();
    this.router.navigate(['/pages/order-page'])

  }

  public getProducts() {
    try {
      this.products = [];
      this.productService.getAllProducts().subscribe(response => {
        response.forEach((element: (any)) => {
          element.image = 'data:image/jpge;base64,' + element.image;
          this.products.push(element);
        })
      });
    }
    catch (error) {
      this.messageService.showError('Action failed with error' + error);
    }
  }



}

