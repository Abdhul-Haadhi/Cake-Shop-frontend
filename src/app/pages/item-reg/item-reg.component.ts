import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ItemRegServiceService } from 'src/app/services/itemRegService/item-reg-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

@Component({
  selector: 'app-item-reg',
  standalone: false,
  templateUrl: './item-reg.component.html',
  styleUrl: './item-reg.component.scss',
})
export class ItemRegComponent implements OnInit {
  demoForm: FormGroup;

  displayedColumns: string[] = ['name', 'code', 'brand', 'category', 'actions'];
  dataSource = new MatTableDataSource<any>();
  saveBtnLabel = 'Save';
  mode = 'Save';
  selectedData: any;
  isButtonDisabled: boolean | undefined;
  selectedRow: any = null;
  lastAddedRow: any = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input', { static: false }) inputField!: ElementRef; // Reference to the input element

  constructor(
    private fb: FormBuilder,
    private demoService: ItemRegServiceService,
    private msgService: MessageServiceService
  ) {
    this.demoForm = this.fb.group({
      name: new FormControl('', Validators.required),
      code: new FormControl('', Validators.required),
      brand: new FormControl(''),
      material: new FormControl('', Validators.required),
      category: new FormControl(''),
    });
  }
  ngOnInit(): void {
    this.dataPopulate();
  }

  onSubmit() {
    try {
      if (this.mode === 'edit') {
        this.demoService
          .editData(this.selectedData?.id, this.demoForm.value)
          .subscribe({
            next: (response: any) => {
              console.log('put data Server Response', response);
              this.msgService.showSuccess('Record Successfully Edited');
              this.dataPopulate();
              setTimeout(() => {
                this.selectedRow = null;
              }, 2000);
            },
            error: (error) => {
              console.log(error);
              this.msgService.showError('Error in Edit Record' + error);
            },
          });
      } else if (this.mode === 'Save') {
        // const originalDate = this.demoForm.value.birthDate; // Assuming it's a Date object
        // const formattedDate = originalDate.toISOString().split("T")[0]; // Extracts "2025-03-21"

        this.demoForm.patchValue(this.demoForm); // Ensures correct format
        console.log('Form Submitted');
        console.log(this.demoForm.value);

        this.demoService
          .serviceCallPost(this.demoForm.value)
          .subscribe((response) => {
            this.dataSource = new MatTableDataSource([
              response,
              ...this.dataSource.data,
            ]);
            this.dataSource.paginator = this.paginator; // Reassign paginator
            this.dataSource.sort = this.sort; // Reassign sort
            console.log('post data Server Response', response);
            this.msgService.showSuccess('Record Successfully Added');

            this.lastAddedRow = response; // Track the last added row
            console.log('Added new row:', (response as { id: number }).id);
            const addedID = (response as { id: number }).id;

            setTimeout(() => {
              this.lastAddedRow = null;
              const dataObj = {
                stockItemID: addedID,
                qty: 0,
                stockItemName: this.demoForm.value.name,
              };
              console.log(dataObj);

              this.demoService.createStock(dataObj).subscribe({
                next: (response: any) => {
                  console.log('stock data Server Response', response);
                },
                error: (error) => {
                  console.log(error);
                },
              });
            }, 3000);
          });
      }

      setTimeout(() => {
        // this.dataPopulate();
        this.isButtonDisabled = true;
        this.demoForm.disable();
      }, 500);
    } catch (error) {
      console.log(error);
      this.msgService.showError('Error ' + error);
    }
  }

  resetData(formDirective: FormGroupDirective) {
    this.demoForm.enable();
    formDirective.resetForm();
    this.demoForm.reset();
    this.saveBtnLabel = 'Save';
    this.mode = 'Save';
    this.isButtonDisabled = true;
    this.selectedRow = null;
  }

  dataPopulate(): void {
    try {
      this.demoService.getData().subscribe((response: any) => {
        console.log('get data Server Response', response);
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator; // Reassign paginator
        this.dataSource.sort = this.sort; // Reassign sort
      });
    } catch (error) {
      console.log(error);
    }
  }
}
