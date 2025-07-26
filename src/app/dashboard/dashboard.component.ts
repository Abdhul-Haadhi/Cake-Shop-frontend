import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { SalesOverviewComponent } from './dashboard-components/sales-overview/sales-overview.component';
import { OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductRegistrationFormService } from 'src/app/services/product-registration/product-registration-form.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { MatCard, MatCardHeader, MatCardTitle, MatCardActions } from "@angular/material/card";
import { MatToolbar } from "@angular/material/toolbar";
import { MatIcon } from "@angular/material/icon";
import { FeedbackAndRatingPageService } from '../services/feedback-and-rating/feedback-and-rating-page.service';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

import { ElementRef} from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormGroupDirective } from "@angular/forms";
import { ItemRegistrationFormService } from "src/app/services/item-registration/item-registration-form.service";
import { Router } from '@angular/router';

interface MenuItem {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [SalesOverviewComponent, MatCard, MatToolbar, MatCardHeader, MatCardTitle, MatCardActions, MatIcon],
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit,OnInit {
	selectedRow: any;
	lastAddedRow: any;
	input: any;

	dataSource = new MatTableDataSource<any>();

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	menuItems: MenuItem[] = [
    {
      title: 'Employee Registration',
      description: 'Register the employees to the system',
      icon: '👨‍🏫',
      route: '/pages/employee-registration'
    },
    {
      title: 'Customer Registration',
      description: 'Register Customers to the system',
      icon: '👨‍🏫',
      route: '/pages/customer-registration'
    },
    {
      title: 'Supplier Registraton',
      description: 'Register Suppliers to the system',
      icon: '👨‍🏫',
      route: '/pages/supplier-registration'
    },
    {
      title: 'Employee Reports',
      description: 'Get Employees List',
      icon: '📚',
      route: '/pages/employee-report'
    },
    {
      title: 'Item Reports',
      description: 'Get Item List',
      icon: '📚',
      route: '/pages/item-report'
    }
  ];

	constructor(
		private feedbackService: FeedbackAndRatingPageService,
		private msgService: MessageServiceService,
		private router: Router
	){

	}


	ngAfterViewInit() { }

	ngOnInit(): void {
    this.PopulateData();
  }

  PopulateData(): void {
	  try {
		this.feedbackService.getData().subscribe((response: any) => {
		  console.log('get data Server Response', response);
		  this.dataSource = new MatTableDataSource(response);
		  this.dataSource.paginator = this.paginator; // Reassign paginator
		  this.dataSource.sort = this.sort; // Reassign sort

		  this.dataSource = new MatTableDataSource([
              response,
              ...this.dataSource.data,
            ]);

		});
	  } catch (error) {
		console.log(error);
	  }
	}
  navigateToSection(route: string) {
    this.router.navigate([route]);
  }

}
