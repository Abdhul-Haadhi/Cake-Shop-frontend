import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { HttpService } from 'src/app/services/http.service';
import { GrnServiceService } from 'src/app/services/grn/grn-service.service';

@Component({
  selector: 'app-manual-stock-adjust',
  standalone: false,
  templateUrl: './manual-stock-adjust.component.html',
  styleUrl: './manual-stock-adjust.component.scss'
})
export class ManualStockAdjustComponent {
  stockAdjustForm: FormGroup;

  displayedColumns: string[] = [
    'id',
    'qty',
    'stockItemID',
    'stockItemName',
    'thresholdQty',
    'actions',
  ];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isButtonDisabled = false;
  saveButtonLabel: string = 'Save';
  submitted = false;
  mode = 'add';
  selectedData!: { orderId: any; };
  showForm = false;
  selectedRow: any = null;


  constructor(
    private fb: FormBuilder,
    private stockAdjustService: GrnServiceService,
    private messageService: MessageServiceService,
    private httpService: HttpService
  ) {

    this.stockAdjustForm = this.fb.group({
      id: new FormControl('', []),
      qty: new FormControl('', []),
      stockItemID: new FormControl('', []),
      stockItemName: new FormControl('', []),
      thresholdQty: new FormControl('', []),
    });

  }

  ngOnInit(): void {
    this.populateData();
  }

  public populateData(): void {
    try {
      this.stockAdjustService.getStockItem().subscribe({
        next: (dataList: any) => {
          console.log('Component received dataList:', dataList);
          if (dataList.length <= 0) {
            return;
          }

          this.dataSource = new MatTableDataSource(dataList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (error) => {
          this.messageService.showError('Action failed with error' + error);
        }
      });
    }
    catch (error) {
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


  onSubmit() {
    try {
      this.submitted = true;
      if (this.stockAdjustForm.invalid) {
        return;
      }

      if (this.mode === 'edit') {

        // const updatedStatus = this.stockAdjustForm.value.status;
        // if (!updatedStatus) {
        //   this.messageService.showError('Please select a status to update.');
        //   return;
        // }

        // const orderId = this.selectedData?.orderId;

        this.stockAdjustService.stockEdit(this.stockAdjustForm.getRawValue()).subscribe({
          next: (response) => {
            // let elementIndex = this.dataSource.data.findIndex((element) => element.orderId === orderId);
            // this.dataSource.data[elementIndex] = response;
            // this.dataSource = new MatTableDataSource(this.dataSource.data);
            // this.populateData();
            this.messageService.showSuccess('Stock edited successfully!');
            this.populateData();
          },
          error: (error) => {
            this.messageService.showError('Action failed with error' + error);
          }
        })
      }

      this.mode = 'add';
      this.stockAdjustForm.disable();
      this.isButtonDisabled = true;

    }
    catch (error) {
      this.messageService.showError('Action failed with error' + error);
    }
  }


  public resetData(): void {
    this.stockAdjustForm.reset();
    this.stockAdjustForm.updateValueAndValidity();
    this.saveButtonLabel = 'Save';
    this.stockAdjustForm.enable();
    this.isButtonDisabled = false;
    this.submitted = false;
  }

  public editData(data: any): void {
    this.stockAdjustForm.patchValue(data);
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
  }

  public refreshData(): void {
    this.populateData();
  }

  closeForm() {
    this.stockAdjustForm.reset();
    this.showForm = false;
    this.submitted = false;
  }


}
