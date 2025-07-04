import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductRegistrationFormService {
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
      // DO NOT set 'Content-Type' header here for multipart
    };
  }

  // const formData = new FormData();
  // formData.append('product', new Blob([JSON.stringify(formDetails)], { type: 'application/json' }));
  // formData.append('image', imageFile);

  return this.http.post(requestUrl, formDetails, { headers: headers });
}

    getData(){
      const requestUrl = environment.baseUrl + '/product-registration';
  
      let headers = {};
  
      if (this.httpService.getAuthToken() !== null) {
        headers = {
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }
  
      return this.http.get(requestUrl,headers)
    }


    editData(id:number,from_details: any){
      console.log('In edit data');
  
      const requestUrl = environment.baseUrl + '/product-registration/' + id.toString();
  
  
      let headers = {};
  
      if (this.httpService.getAuthToken() !== null) {
        headers = {
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }
  
      return this.http.put(requestUrl,from_details,{headers:headers})
    }
  
    deleteData(id:number){
      console.log('In delete data');
  
      const requestUrl = environment.baseUrl + '/product-registration/' + id.toString();
  
  
      let headers = {};
  
      if (this.httpService.getAuthToken() !== null) {
        headers = {
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }
  
      return this.http.delete(requestUrl,{headers:headers})
    }


}
