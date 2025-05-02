import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';

export interface Item {
  id?: string;
  itemId: string;
  item: string;
  category: string;
  unitQuantity: number;
  supplierId: string;
  totalCost: number;
  totalQuantity: number;
  unitCost: number;
}

@Injectable({
  providedIn: 'root'
})
export class ItemRegistrationFormService {

  constructor(private http: HttpClient, private httpService: HttpService) { }

  serviceCall(from_details:any){
        console.log('In the service');
    
        const requestUrl = environment.baseUrl + '/item-registration';
    
    
        let headers = {};
    
        if (this.httpService.getAuthToken() !== null) {
          headers = {
            Authorization: 'Bearer ' + this.httpService.getAuthToken(),
          };
        }
    
        return this.http.post(requestUrl,from_details,{headers:headers})
      }

      
  
      getData(){
        const requestUrl = environment.baseUrl + '/item-registration';
    
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
    
        const requestUrl = environment.baseUrl + '/item-registration/' + id.toString();
    
    
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
    
        const requestUrl = environment.baseUrl + '/item-registration/' + id.toString();
    
    
        let headers = {};
    
        if (this.httpService.getAuthToken() !== null) {
          headers = {
            Authorization: 'Bearer ' + this.httpService.getAuthToken(),
          };
        }
    
        return this.http.delete(requestUrl,{headers:headers})
      }
}
