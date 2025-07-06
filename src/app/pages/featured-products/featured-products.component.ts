import { Component, OnInit } from '@angular/core';
import { PopupBoxComponent } from '../popup-box/popup-box.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductRegistrationFormService } from 'src/app/services/product-registration/product-registration-form.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

@Component({
  selector: 'app-featured-products',
  standalone: false,
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.scss',
})
export class FeaturedProductsComponent implements OnInit{

  products: any[] = [];


  constructor(
    private dialog:MatDialog,
    private productService: ProductRegistrationFormService,
    private messageService: MessageServiceService,  
  ){
    
  }
  

  ngOnInit(): void {
    this.getProducts();
  }
  // products = [
  //   {
  //     name: 'sponge cake',
  //     // image: '../../../assets/images/cupCakes.jpg',
  //     image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnnqkk1UEVPaQGwcmHUaDba9rpIIDkEbA01w&s',
  //     description: 'this is sponge cake',
  //     price: 4000,
  //     size: ' 1000'
  //   },
  //   {
  //     name: 'Birthday cake',
  //     image: '../../../assets/images/birthdayCake.jpg',
  //     description: 'this is sponge cake',
  //     price: 3000,
  //     size: ' 1000'
  //   },
  //   {
  //     name: 'Wedding cake',
  //     image: '../../../assets/images/weddingCake.jpg'
  //   },
  //   {
  //     name: 'Chocolate cake',
  //     image: '../../../assets/images/ChocolateCake.jpg'
  //   },
  //   {
  //     name: 'Red Velvet cake',
  //     image: '../../../assets/images/redVelvetCake.jpg'
  //   },
  //   {
  //     name: 'Jar cake',
  //     image: '../../../assets/images/jarCake.jpg'
  //   },
  //   {
  //     name: 'Fruits cake',
  //     image: '../../../assets/images/fruitsCake.jpg'
  //   },
  //   {
  //     name: 'Dates cake',
  //     image: '../../../assets/images/datesCake.jpg'
  //   },
  //   {
  //     name: 'Chocolate Mousse',
  //     image: '../../../assets/images/chocolateMousse.jpg'
  //   },
  //   {
  //     name: 'Eggless ribbon cake',
  //     image: '../../../assets/images/egglessRibbonCake.jpg'
  //   },
  //   {
  //     name: 'Brownie cake',
  //     image: '../../../assets/images/brownieCake.jpg'
  //   },
  //   {
  //     name: 'Cakesicles',
  //     image: '../../../assets/images/cakesicles.jpg'
  //   },
  // ];

  public getProducts(){
    try{
      this.products = [];
      this.productService.getAllProducts().subscribe(response =>{
        response.forEach((element:(any)) =>{
          element.image = 'data:image/jpge;base64,'+element.image;
          this.products.push(element);
        })
      });
    }
    catch(error){
      this.messageService.showError('Action failed with error' + error);
    }
  }


  openPopup(product:any){
    this.dialog.open(PopupBoxComponent,{
      width: '60%',
      height: '400px',
      // data: product
    });
  }
}


