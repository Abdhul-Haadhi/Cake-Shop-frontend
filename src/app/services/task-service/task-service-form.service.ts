import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskServiceFormService {

  constructor(private http:HttpClient, private httpService:HttpService) { }

  serviceCall(from_details:any){
    console.log("In the service");

    const requestUrl = environment.baseUrl + '/form-task';


    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.post(requestUrl, from_details, {headers:headers});
  }

  getData(){
    const requestUrl = environment.baseUrl + '/form-task';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }
    return this.http.get(requestUrl,headers);

  }

  editData(id:number,from_details:any){
    console.log("In edit data");

    const requestUrl = environment.baseUrl + '/form-task/'+id.toString(); // http://localhost:8080/form-task/1


    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.put(requestUrl, from_details, {headers:headers}); // POST, PUT, GET, DELETE
  }

  deleteData(id:number){
    console.log("In delete data");

    const requestUrl = environment.baseUrl + '/form-task/'+id.toString();


    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.delete(requestUrl, {headers:headers});
  }
}

