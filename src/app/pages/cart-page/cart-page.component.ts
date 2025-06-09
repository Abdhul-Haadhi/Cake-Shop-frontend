import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder,FormControl,FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'src/app/services/http.service';
import { CartPageServiceService } from 'src/app/services/cart-page/cart-page-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductStateServiceService } from 'src/app/services/product-registration/product-state-service.service';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
  selector: 'app-cart-page',
  standalone: false,
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent implements OnInit{
    product: any;

    selection = new SelectionModel<any>(true, []);

    displayedColumns: string[] = [
    'select',
    'image',
    'item',
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
      private router: Router, 
      private cartService: CartPageServiceService,
      private messageService: MessageServiceService,
    ){

      const nav = this.router.getCurrentNavigation();
      this.selectedProducts = nav?.extras.state?.['product'] || [];

      this.product = this.productState.getProduct();

      if (!this.product) {
        this.router.navigate(['/pages/cart-page']); 
      }
        
    }

     ngOnInit(): void {
    this.populateData();
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


  public populateData(): void{
    try{
      this.cartService.getData().subscribe({
      next: (dataList: any) => {
        if(dataList.length <= 0){
          return;
        }

        const updatedDataList = dataList.map((item:any) => ({
          ...item,
          totalPrice:(item.price) * (item.quantity)
        }));

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


  public deleteData(data: any): void {
    
    const id = data.id;

    try{
      this.cartService.deleteData(id).subscribe({
        next: (response) =>{
          const index = this.dataSource.data.findIndex((element) => element.id === id);
        if(index !== -1){
          this.dataSource.data.splice(index, 1);
        }
        this.dataSource = new MatTableDataSource(this.dataSource.data);
        this.messageService.showSuccess('Data deleted successfully!');
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

  backToOrderPage(){
    this.product = this.router.getCurrentNavigation()?.extras.state?.['product'];
    if (!this.product) {
        this.router.navigate(['/pages/order-page']); 
      }
  }

  checkOutBtn(){
    const selectedProducts = this.selection.selected;
    if(!selectedProducts || selectedProducts.length === 0){
      this.messageService.showError('Please select at least one product to proceed to checkout');
      return;
    }
    
    this.router.navigate(['/pages/checkout-page'],{state:{
      products: selectedProducts
    }});
  }



}
