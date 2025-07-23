import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'src/app/services/http.service';
import { CartPageServiceService } from 'src/app/services/cart-page/cart-page-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductStateServiceService } from 'src/app/services/product-registration/product-state-service.service';
import { SelectionModel } from '@angular/cdk/collections';
import { ProductRegistrationFormService } from 'src/app/services/product-registration/product-registration-form.service';
import { OrderPageServiceService } from 'src/app/services/order-page/order-page-service.service';


@Component({
  selector: 'app-cart-page',
  standalone: false,
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent implements OnInit {
  product: any;

  selection = new SelectionModel<any>(true, []);

  displayedColumns: string[] = [
    'select',
    'image',
    'item',
    'baseSize',
    'size',
    'quantity',
    'itemPrice',
    'totalPrice',
    'actions'
  ];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // isButtonDisabled = false;
  saveButtonLabel: string = 'Add to cart';
  submitted = false;
  mode = 'add';
  selectedData!: { id: any; };
  selectedProducts: any;

  constructor(private fb: FormBuilder,
    private productState: ProductStateServiceService,
    private productService: ProductRegistrationFormService,
    private router: Router,
    private cartService: CartPageServiceService,
    private messageService: MessageServiceService,
  ) {

    const nav = this.router.getCurrentNavigation();
    this.selectedProducts = nav?.extras.state?.['product'] || [];

    this.product = this.productState.getProduct();

    if (!this.product) {
      this.router.navigate(['/pages/cart-page']);
    }

  }

  ngOnInit(): void {
    this.populateData();
    // this.populateDatas();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }


  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }


  public populateData(): void {
    try {
      this.cartService.getData().subscribe({
        next: (dataList: any) => {
          if (dataList.length <= 0) {
            return;
          }


          // ------------the correct one---------
          const updatedDataList = dataList.map((item: any) => ({
            ...item
            // totalPrice:(item.price) * (item.quantity)
          }));


          // ----------Total price = initial price × (selected weight ÷ initial weight) × quantity-----------

          // const updatedDataList = dataList.map((item: any) => {
          //   const initialPrice = item.price;            // price for base weight
          //   const initialWeight = this.product.initialWeight;      // e.g. 500g
          //   const selectedWeight = item.size;  // e.g. 1000g
          //   const quantity = item.quantity;

          //   const unitPrice = initialPrice * (selectedWeight / initialWeight);
          //   const totalPrice = unitPrice * quantity;

          //   return {
          //     ...item,
          //     unitPrice: unitPrice,
          //     totalPrice: totalPrice
          //   };
          // });


          // updatedDataList.forEach((product: any) => {
          //   this.cartService.getData().subscribe({
          //     next: () => console.log('Product state updated for item', product),
          //     error: err => this.messageService.showError('Failed to update product state: ' + err)
          //   });
          // });


          // const updatedDataList = dataList.map((item: any) => {
          //   const price = parseFloat(item.itemPrice) || 0;
          //   const quantity = parseFloat(item.quantity) || 0;
          //   return {
          //     ...item,
          //     price,
          //     quantity,
          //     totalPrice: price * quantity
          //   };
          // });
          // ---------------------------------------------------------------------
          // const updatedDataList = dataList.map((item: any) => {
          //   const price = parseFloat(item.price) || 0;
          //   const quantity = parseFloat(item.quantity) || 0;
          //   return {
          //     ...item,
          //     totalPrice: price * quantity
          //   };
          // });

          // console.log(updatedDataList);


          this.dataSource = new MatTableDataSource(updatedDataList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.getProductListData(dataList);
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


  public getProductListData(dataList: any): void {
    dataList.forEach((data: any) => {

      let prodId = data.productId

      if (prodId) {
        this.getProdData(prodId);
      }

    })
  }

  public getProdData(prodId: any) {
    //  backend call to get image and item name

    this.productService.getCartProductDetails(prodId).subscribe({
      next: (dataList: any) => {
        console.log(dataList);

        let tableData = this.dataSource.data;

        tableData.forEach((data: any) => {
          if (data.productId) {
            const prodItem = dataList.find((dataItem: any) => dataItem.id === data.productId);
            console.log(prodItem);

            data.item = prodItem.product;
            data.image = prodItem.image;
            data.baseSize = prodItem.initialWeight;

            const initialPrice = data.price;
            const baseWeight = prodItem.initialWeight;
            const selectedWeight = data.size;
            const quantity = data.quantity;

            const unitPrice = initialPrice * (selectedWeight / baseWeight);
            const totalPrice = unitPrice * quantity;

            data.unitPrice = unitPrice;
            data.totalPrice = totalPrice;
          }
        });
        this.dataSource = new MatTableDataSource(tableData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error: any) => {
        console.log(error);

      }
    })
  }


  public deleteData(data: any): void {

    const id = data.id;

    try {
      this.cartService.deleteData(id).subscribe({
        next: (response) => {
          const index = this.dataSource.data.findIndex((element) => element.id === id);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
          }
          this.dataSource = new MatTableDataSource(this.dataSource.data);
          this.messageService.showSuccess('Data deleted successfully!');
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

  // backToOrderPage(){
  //   this.product = this.router.getCurrentNavigation()?.extras.state?.['product.'];
  //   if (!this.product) {
  //       this.router.navigate(['/pages/order-page']); 
  //     }
  // }

  checkOutBtn() {
    const selectedProducts = this.selection.selected;
    if (!selectedProducts || selectedProducts.length === 0) {
      this.messageService.showError('Please select at least one product to proceed to checkout');
      return;
    }

    this.router.navigate(['/pages/checkout-page'], {
      state: {
        products: selectedProducts
      }
    });
  }

  closePage() {
    this.router.navigate(['/pages/featured-products']);
  }



  public base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }



}
