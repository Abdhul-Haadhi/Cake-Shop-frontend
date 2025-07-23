import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../http.service';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRegistrationFormService {

  constructor(private http: HttpClient, private httpService: HttpService) { }

  serviceCall(from_details: any) {
    console.log('In the service');

    const requestUrl = environment.baseUrl + '/employee-registration';


    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.post(requestUrl, from_details, { headers: headers })
  }

  getData() {
    const requestUrl = environment.baseUrl + '/employee-registration';

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

    const requestUrl = environment.baseUrl + '/employee-registration/' + id.toString();


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

    const requestUrl = environment.baseUrl + '/employee-registration/' + id.toString();


    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.delete(requestUrl, { headers: headers })
  }

}
