import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/app/environments/environment';
import { Supplier } from '../models/supplier.model';


@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private mockSuppliers: Supplier[] = [
    {
      id: 1,
      name: 'John',
      age: 28,
      phoneNumber: 545454545,
      birthDate: '2020-01-15',
      salary: 95000
    },
    {
      id: 2,
      name: 'Martha',
      age: 22,
      phoneNumber: 97867890,
      birthDate: '1998-01-15',
      salary: 85000
    },
    {
      id: 3,
      name: 'Harry',
      age: 24,
      phoneNumber: 1234567890,
      birthDate: '2020-05-14',
      salary: 89000
    }
  ];

  supplierList: Supplier[] = [];

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) { }

  private apiUrl = environment.baseUrl + '/suppliers';

  private getHeaders() {
    let headers = {};
    const authToken = this.httpService.getAuthToken();
    if (authToken !== null) {
      headers = {
        Authorization: 'Bearer ' + authToken,
      };
    }
    return headers;
  }


  // getEmployees(): Observable<any> {

  //    return this.http.get(this.apiUrl + "/getAll", { headers: this.getHeaders() });

  // }

  getSuppliers(): Observable<any> {

    return new Observable<Supplier[]>(observer => {
      observer.next(this.mockSuppliers);
      observer.complete();
    });
  }

}
