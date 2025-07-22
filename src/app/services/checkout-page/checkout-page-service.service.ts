import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CheckoutPageServiceService {
  constructor(private http: HttpClient, private httpService: HttpService) {}

  serviceCall(from_details: any) {
    console.log('In the service');

    const requestUrl = environment.baseUrl + '/checkout-page';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }
    console.log(from_details);
    return this.http.post(requestUrl, from_details, { headers: headers });
  }

  getData() {
    const requestUrl = environment.baseUrl + '/checkout-page';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl, headers);
  }

  filterByDate(startDate: string, endDate: string){
    const requestUrl = environment.baseUrl + '/order-list/filter';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    const params = {
      startDate: startDate,
      endDate: endDate
    };

    return this.http.get(requestUrl, { headers: headers, params: params });
  }

  editData(id: number, from_details: any) {
    console.log('In edit data');

    const requestUrl = environment.baseUrl + '/checkout-page/' + id.toString();

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.put(requestUrl, from_details, { headers: headers });
  }

  //     deleteData(id:number){
  //       console.log('In delete data');

  //       const requestUrl = environment.baseUrl + '/checkout-page/' + id.toString();

  //       let headers = {};

  //       if (this.httpService.getAuthToken() !== null) {
  //         headers = {
  //           Authorization: 'Bearer ' + this.httpService.getAuthToken(),
  //         };
  //       }

  //       return this.http.delete(requestUrl,{headers:headers})
  //     }
}
