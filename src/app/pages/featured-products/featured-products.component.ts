import { Component } from '@angular/core';
import {ChangeDetectionStrategy} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { PopupBoxComponent } from '../popup-box/popup-box.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-featured-products',
  standalone: false,
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.scss',
})
export class FeaturedProductsComponent {

  constructor(private dialog:MatDialog){
    
  }
  
  products = [
    {
      name: 'Cup cakes',
      image: '../../../assets/images/cupCakes.jpg'
    },
    {
      name: 'Birthday cake',
      image: '../../../assets/images/birthdayCake.jpg'
    },
    {
      name: 'Wedding cake',
      image: '../../../assets/images/weddingCake.jpg'
    },
    {
      name: 'Chocolate cake',
      image: '../../../assets/images/ChocolateCake.jpg'
    },
    {
      name: 'Red Velvet cake',
      image: '../../../assets/images/redVelvetCake.jpg'
    },
    {
      name: 'Jar cake',
      image: '../../../assets/images/jarCake.jpg'
    },
    {
      name: 'Fruits cake',
      image: '../../../assets/images/fruitsCake.jpg'
    },
    {
      name: 'Dates cake',
      image: '../../../assets/images/datesCake.jpg'
    },
    {
      name: 'Chocolate Mousse',
      image: '../../../assets/images/chocolateMousse.jpg'
    },
    {
      name: 'Eggless ribbon cake',
      image: '../../../assets/images/egglessRibbonCake.jpg'
    },
    {
      name: 'Brownie cake',
      image: '../../../assets/images/brownieCake.jpg'
    },
    {
      name: 'Cakesicles',
      image: '../../../assets/images/cakesicles.jpg'
    },
  ];




  openPopup(product:any){
    this.dialog.open(PopupBoxComponent,{
      width: '60%',
      height: '400px',
      data: product
    });
  }
}


