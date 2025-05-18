import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductStateServiceService } from 'src/app/services/product-registration/product-state-service.service';

@Component({
  selector: 'app-popup-box',
  standalone: false,
  templateUrl: './popup-box.component.html',
  styleUrl: './popup-box.component.scss'
})
export class PopupBoxComponent {
  constructor(private productState: ProductStateServiceService, private router: Router, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PopupBoxComponent>) {}

  closePopup(): void {
    this.dialogRef.close();
  }

  goToOrderPage() {
    this.productState.setProduct(this.data);
    this.dialogRef.close();
    this.router.navigate(['/pages/order-page'])
    //   {
    //   // state: {product:this.data}
    // });

    // this.dialogRef.close(); 
  }

}
