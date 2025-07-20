import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';

// export interface Item {
//   id?: string;
//   itemId: string;
//   item: string;
//   category: string;
//   unitQuantity: number;
//   supplierId: string;
//   totalCost: number;
//   totalQuantity: number;
//   unitCost: number;
// }

@Injectable({
  providedIn: 'root'
})
export class ItemRegistrationFormService {

  constructor(private http: HttpClient, private httpService: HttpService) { }

  // serviceCall(from_details:any){
  //       console.log('In the service');
    
  //       const requestUrl = environment.baseUrl + '/item-registration';
    
    
  //       let headers = {};
    
  //       if (this.httpService.getAuthToken() !== null) {
  //         headers = {
  //           Authorization: 'Bearer ' + this.httpService.getAuthToken(),
  //         };
  //       }
    
  //       return this.http.post(requestUrl,from_details,{headers:headers})
  //     }

      
  
      // getData(){
      //   const requestUrl = environment.baseUrl + '/item-registration';
    
      //   let headers = {};
    
      //   if (this.httpService.getAuthToken() !== null) {
      //     headers = {
      //       Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      //     };
      //   }
    
      //   return this.http.get(requestUrl,headers)
      // }


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


      getReportData() {
        console.log("get data");

        const requestUrl = environment.baseUrl + '/item-report'; //'http://localhost:8080/item-report'

        //get authtoken and set it to header
        let headers = {};

        if (this.httpService.getAuthToken() !== null) {
          headers = {
            Authorization: 'Bearer ' + this.httpService.getAuthToken(),
          };
        }

        return this.http.get(requestUrl,{headers:headers});
      }
  
  
      // editData(id:number,from_details: any){
      //   console.log('In edit data');
    
      //   const requestUrl = environment.baseUrl + '/item-registration/' + id.toString();
    
    
      //   let headers = {};
    
      //   if (this.httpService.getAuthToken() !== null) {
      //     headers = {
      //       Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      //     };
      //   }
    
      //   return this.http.put(requestUrl,from_details,{headers:headers})
      // }
    

      editData(id: number, form_details: any) {
        const requestUrl = environment.baseUrl + '/item-registration/' + id.toString();

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

        const requestUrl = environment.baseUrl + '/item-registration';

        let headers = {};

        if (this.httpService.getAuthToken() !== null) {
          headers = {
            Authorization: 'Bearer ' + this.httpService.getAuthToken(),
          };
        }

        return this.http.post(requestUrl,form_details,{headers:headers});
      }


      // deleteData(id:number){
      //   console.log('In delete data');
    
      //   const requestUrl = environment.baseUrl + '/item-registration/' + id.toString();
    
    
      //   let headers = {};
    
      //   if (this.httpService.getAuthToken() !== null) {
      //     headers = {
      //       Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      //     };
      //   }
    
      //   return this.http.delete(requestUrl,{headers:headers})
      // }


      deleteData(id: number){
        console.log("delete data" + id);

        const requestUrl = environment.baseUrl + '/item-registration/' + id.toString();

        let headers = {};

        if (this.httpService.getAuthToken() !== null) {
          headers = {
            Authorization: 'Bearer ' + this.httpService.getAuthToken(),
          };
        }

        return this.http.delete(requestUrl,{headers:headers});
      }


      // getJobRole(){
      //   console.log("get job Role");

      //   const requestUrl = environment.baseUrl + '/form-demo/get-job-role'; //'http://localhost:8080/form-demo/get-job-role'

      //   let headers = {};

      //   if (this.httpService.getAuthToken() !== null) {
      //     headers = {
      //       Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      //     };
      //   }

      //   return this.http.get(requestUrl,{headers:headers});
      // }


}
