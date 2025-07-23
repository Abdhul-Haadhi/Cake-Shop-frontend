import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductRegistrationFormService {

  private product: any = null;
  constructor(private http: HttpClient, private httpService: HttpService) { }

  // serviceCall(from_details:any){
  //     console.log('In the service');

  //     const requestUrl = environment.baseUrl + '/product-registration';


  //     let headers = {};

  //     if (this.httpService.getAuthToken() !== null) {
  //       headers = {
  //         Authorization: 'Bearer ' + this.httpService.getAuthToken(),
  //       };
  //     }

  //     return this.http.post(requestUrl,from_details,{headers:headers})
  //   }

  serviceCall(formDetails: any) {
    console.log('In the service');

    const requestUrl = environment.baseUrl + '/product-registration';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }


    return this.http.post(requestUrl, formDetails, { headers: headers });
  }

  getData() {
    const requestUrl = environment.baseUrl + '/product-registration';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl, { headers: headers })
  }

  getOrderData() {
    const requestUrl = environment.baseUrl + '/order-page';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl, headers)
  }


  getAllProducts(): Observable<any> {
    const requestUrl = environment.baseUrl + '/featured-products';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl, headers)
  }

  getCartProducts(): Observable<any> {
    const requestUrl = environment.baseUrl + '/cart-page';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    if (this.product) {
      return this.product;
    }


    return this.http.get(requestUrl, headers)
  }

  getCartProductDetails(id: any): Observable<any> {
    const requestUrl = environment.baseUrl + '/cart-page/' + id.toString();

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl, headers)
  }


  editData(id: number, from_details: any) {
    console.log('In edit data');

    const requestUrl = environment.baseUrl + '/product-registration/' + id.toString();


    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.put(requestUrl, from_details, { headers: headers })
  }

  deleteData(id: number) {
    console.log('In delete data');

    const requestUrl = environment.baseUrl + '/product-registration/' + id.toString();


    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.delete(requestUrl, { headers: headers })
  }


}
