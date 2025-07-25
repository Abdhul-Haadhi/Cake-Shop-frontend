import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartPageServiceService {

  constructor(private http: HttpClient, private httpService: HttpService) { }

  serviceCall(from_details: any) {
    console.log('In the service');

    const requestUrl = environment.baseUrl + '/order-page';


    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.post(requestUrl, from_details, { headers: headers })
  }

  getData() {
    const requestUrl = environment.baseUrl + '/order-page';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl, headers)
  }

    getDataByUserId() {

    const user = this.httpService.getUserId();

    const requestUrl = environment.baseUrl + '/user-order-page/' + user;

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl, headers)
  }


  deleteData(id: number) {
    console.log('In delete data');

    const requestUrl = environment.baseUrl + '/order-page/' + id.toString();


    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.delete(requestUrl, { headers: headers })
  }
}
