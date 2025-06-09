import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GrnServiceService {

  constructor(private http:HttpClient, private httpService:HttpService) { }

  innerEditData(id: number, form_details:any){
    const requestUrl = environment.baseUrl + '/innergrn/' + id.toString();

    let headers = {};

    if(this.httpService.getAuthToken() !== null){
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.put(requestUrl,form_details,{headers:headers});
  }

  editDataOuterForm(id: number, form_details: any){
    const requestUrl = environment.baseUrl + '/outeredit/' + id.toString();

    let headers = {};

    if(this.httpService.getAuthToken() !== null){
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.put(requestUrl,form_details,{headers:headers});

  }


  deleteDataOuter(id: number){
    console.log("delete data" + id);

    const requestUrl = environment.baseUrl + '/deleteOuter/' + id.toString();

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

     return this.http.delete(requestUrl,{headers:headers});
  }


  //get all GRN
  getData(){
    console.log("get data");

    const requestUrl = environment.baseUrl + '/allgrn';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl,{headers:headers});
  }


  //stock update
  stockUpdate(item_list: any) {

    const requestUrl = environment.baseUrl + '/stockupdate';
    
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.put(requestUrl,item_list,{headers:headers});
  }



  stockUpdateEdit(item_list: any){
    const requestUrl = environment.baseUrl + '/stockupdateEdit';
    let headers = {};


    if (this.httpService.getAuthToken() !== null) {
        headers = {
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }

      return this.http.put(requestUrl,item_list,{headers:headers});
  }
  


  serviceCallPost(form_details:any){
    console.log("service call");

    const requestUrl = environment.baseUrl + '/grn';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.post(requestUrl,form_details,{headers:headers});
  }



  serviceCallPostInner(form_details:any){

    const requestUrl = environment.baseUrl + '/inner';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.post(requestUrl,form_details,{headers:headers});

  }


  getGRNs(){
    console.log("get data");

    const requestUrl = environment.baseUrl + '/grn';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }
    return this.http.get(requestUrl,{headers:headers});
  }


  getQty(itemID:number){
    console.log("get data");

    const requestUrl = environment.baseUrl + '/getQty/'+ itemID.toString();

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }
    return this.http.get(requestUrl,{headers:headers});
  }


  getItem(){
    console.log("get items");

    const requestUrl = environment.baseUrl + '/grn/get-item';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl,{headers:headers});
  }


  getInnerGRN(grnno:number){
    const requestUrl = environment.baseUrl + '/get-inner/' + grnno.toString();

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

    return this.http.get(requestUrl,{headers:headers});
  }


  deleteInnerData(id: number){
    console.log("delete data" + id);

    const requestUrl = environment.baseUrl + '/innergrn/' + id.toString();

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }

     return this.http.delete(requestUrl,{headers:headers});
  }


}
