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



@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [SalesOverviewComponent, MatCard, MatToolbar, MatCardHeader, MatCardTitle, MatCardActions, MatIcon],
	templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements AfterViewInit,OnInit {
	selectedRow: any;
	lastAddedRow: any;
	input: any;

	dataSource = new MatTableDataSource<any>();

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	constructor(
		private feedbackService: FeedbackAndRatingPageService,
		private msgService: MessageServiceService
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

	

}
