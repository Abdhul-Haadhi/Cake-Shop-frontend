import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FeedbackAndRatingPageService } from 'src/app/services/feedback-and-rating/feedback-and-rating-page.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cutomer-feedback',
  standalone: false,
  templateUrl: './cutomer-feedback.component.html',
  styleUrl: './cutomer-feedback.component.scss'
})
export class CutomerFeedbackComponent {


  displayedColumns: string[] = [
    'user',
    'date',
    'feedbackNote',
    'rating',
    'actions'
  ];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private customerFeedback: FeedbackAndRatingPageService,
    private messageService: MessageServiceService,
  ) { }

  ngOnInit(): void {
    this.populateData();
  }

  public populateData(): void {
    try {
      this.customerFeedback.getData().subscribe({
        next: (dataList: any) => {
          if (dataList.length <= 0) {
            return;
          }

          this.dataSource = new MatTableDataSource(dataList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (error) => {
          this.messageService.showError('Action failed with error' + error);
        },
      });
    } catch (error) {
      this.messageService.showError('Action failed with error' + error);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public refreshData(): void {
    this.populateData();
  }


  public deleteData(data: any): void {
    const id = data.id;

    try {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete this?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      }).then((result) => {


        this.customerFeedback.deleteData(id).subscribe({
          next: (response) => {
            const index = this.dataSource.data.findIndex(
              (element) => element.id === id
            );
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            this.messageService.showSuccess('Data deleted successfully!');
          },
          error: (error) => {
            this.messageService.showError('Action failed with error' + error);
          },
        });
      });
    } catch (error) {
      this.messageService.showError('Action failed with error' + error);
    }
  }

}
