import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { PrintService } from '../../services/print.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { Item } from '../../models/item.model';
import { GrnServiceService } from 'src/app/services/grn/grn-service.service';
import { ItemService } from '../../services/item.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-item-list',
  standalone: false,
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css'
})
export class ItemListComponent implements OnInit{
  items: Item[] = [];
  filteredItems: Item[] = [];
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  loading: boolean = true;
  error: string | null = null;


  displayedColumns: string[] = [
      'itemNumber',
      'itemName',
      'category',
      'addedDate',
      'expDate',
      'quantity'
    ];


    dataSource!: MatTableDataSource<any>;
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private itemService: ItemService,
    private printService: PrintService,
    private itmService: GrnServiceService,
    private messageService: MessageServiceService
  ) {}



    ngOnInit(): void {
    this.populateData();
  }


  // public populateData(): void{
  //   try{
  //     this.itmService.getData().subscribe({
  //     next: (dataList: any) => {
  //       this.itmService.getItem().subscribe({
  //         next: (itemList: any) => {
  //           const bothService = [...dataList, ...itemList];
  //           this.dataSource = new MatTableDataSource(bothService);
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         },
  //         error: (error) => {
  //           this.messageService.showError('Action failed with error' + error);
  //         }
  //       });

  //       // if(dataList.length <= 0){
  //       //   return;
  //       // }

  //         // this.dataSource = new MatTableDataSource(dataList);
  //         // this.dataSource.paginator = this.paginator;
  //         // this.dataSource.sort = this.sort;
  //       },
  //       error: (error) => {
  //         this.messageService.showError('Action failed with error' + error);
  //       }
  //     });

  //     // this.itmService.getItem().subscribe({
  //     //   next: (datalist: any) => {
  //     //     if(datalist.length <= 0){
  //     //       return;
  //     //     }
  //     //     this.dataSource = new MatTableDataSource(datalist);
  //     //   }
  //     // });
  //     }
  //     catch(error){
  //       this.messageService.showError('Action failed with error' + error);
  //     }
    
  // }

  public populateData(): void{
    try{
      forkJoin([
        this.itmService.getData(),this.itmService.getItem()
      ]).subscribe({
        next:([dataList,itemList]) =>{
          const bothService = [...dataList, ...itemList];
          this.dataSource = new MatTableDataSource(bothService);

          // console.log('dataList:', dataList);
          // console.log('itemList:', itemList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (error) => {
          this.messageService.showError('Action failed with error ' + error);
        }
      });
    }
    catch (error) {
      this.messageService.showError('Action failed with error ' + error);
    }
    
  }

  loadEmployees(): void {
    this.loading = true;
    this.itemService.getItems().subscribe({
      next: (data) => {
        this.items = data;
        this.filteredItems = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load item data. Please try again later.';
        this.loading = false;
        console.error('Error fetching items:', err);
      }
    });
  }


  search(): void {
    if (!this.searchTerm.trim()) {
      this.filteredItems = this.items;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      item.name.toLowerCase().includes(term)||
      item.age.toString() .includes(term)||
      item.phoneNumber.toString().includes(term) ||
      item.salary.toString().includes(term)||
       item.id.toString().includes(term)
    );
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredItems = [...this.filteredItems].sort((a: any, b: any) => {
      const valueA = a[column];
      const valueB = b[column];

      if (typeof valueA === 'string') {
        const comparison = valueA.localeCompare(valueB);
        return this.sortDirection === 'asc' ? comparison : -comparison;
      } else {
        return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return '↕';
    }
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  printReport(): void {
    this.printService.printItemReport(this.dataSource.filteredData);
  }

  getDate(): string {
    const today = new Date();
    return today.toLocaleDateString();
  }

  public refreshData(): void{
    this.populateData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
