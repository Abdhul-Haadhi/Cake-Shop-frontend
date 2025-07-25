import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProdItemMapService {
  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) {}

  addProductItemMap(form_details: any) {
    const requestUrl = environment.baseUrl + '/product-items-map';

    let headers = {};
    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken()
      };
    }

    return this.http.post(requestUrl, form_details, { headers: headers });
  }

  getData() {
    const requestUrl = environment.baseUrl + '/product-items-map';

    let headers = {};
    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken()
      };
    }

    return this.http.get(requestUrl, { headers: headers });
  }

  updateProductItemMap(form_details: any, id: number) {
    const requestUrl = environment.baseUrl + '/product-items-map/' + id.toString();

    let headers = {};
    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken()
      };
    }

    return this.http.put(requestUrl, form_details, { headers: headers });
  }
}
