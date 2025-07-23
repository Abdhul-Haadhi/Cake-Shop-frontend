import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductStateServiceService {

  private product: any = null;

  setProduct(product: any) {
    this.product = product;

    localStorage.setItem('SelectedProduct', JSON.stringify(product));
  }

  getProduct() {
    if (this.product) {
      return this.product;
    }

    const prod = localStorage.getItem('SelectedProduct');
    return prod ? JSON.parse(prod) : null;
  }

  clearProduct() {
    this.product = null;
    localStorage.removeItem('SelectedProduct');
  }

}
