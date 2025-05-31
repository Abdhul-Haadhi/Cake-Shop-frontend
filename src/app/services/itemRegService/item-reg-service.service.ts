import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../http.service';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemRegServiceService {

  constructor(private http:HttpClient, private httpService:HttpService) { }

  editData(id: number, form_details: any) {
    const requestUrl = environment.baseUrl + '/form-demo/' + id.toString(); //'http://localhost:8080/form-demo'

    //get authtoken and set it to header
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.put(requestUrl,form_details,{headers:headers});
  }


  createStock(dataObj:any){
    const requestUrl = environment.baseUrl + '/stock'; //'http://localhost:8080/inner'

    //get authtoken and set it to header
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.post(requestUrl,dataObj,{headers:headers});
  }


  serviceCallPost(form_details:any){
    console.log("service call");

    const requestUrl = environment.baseUrl + '/item-reg'; //'http://localhost:8080/form-demo'

    //get authtoken and set it to header
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.post(requestUrl,form_details,{headers:headers});
  }

  getData() {
    console.log("get data");

    const requestUrl = environment.baseUrl + '/item'; //'http://localhost:8080/item'

    //get authtoken and set it to header
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl,{headers:headers});
  }

  getJobRole(){
    console.log("get job Role");

    const requestUrl = environment.baseUrl + '/form-demo/get-job-role'; //'http://localhost:8080/form-demo/get-job-role'

    //get authtoken and set it to header
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl,{headers:headers});
  }



  deleteData(id: number){
    console.log("delete data" + id);

    const requestUrl = environment.baseUrl + '/form-demo/' + id.toString(); //'http://localhost:8080/form-demo'

    //get authtoken and set it to header
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

     return this.http.delete(requestUrl,{headers:headers});
  }

  }




