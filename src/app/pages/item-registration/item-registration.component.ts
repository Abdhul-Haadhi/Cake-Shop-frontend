import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ItemRegistrationFormService } from "src/app/services/item-registration/item-registration-form.service";
import { MessageServiceService } from "src/app/services/message-service/message-service.service";
import { NotificationService } from "src/app/services/notification-service/notification.service";
import Swal from 'sweetalert2';





@Component({
  selector: 'app-item-registration',
  standalone: false,
  templateUrl: './item-registration.component.html',
  styleUrl: './item-registration.component.scss'
})
export class ItemRegistrationComponent implements OnInit {
  ItemRegForm: FormGroup;

  displayedColumns: string[] = ['itemName', 'itemId', 'category', 'actions'];
  dataSource = new MatTableDataSource<any>();
  saveButtonLabel: string = 'Save';
  mode = 'Save';
  selectedData: any;
  isButtonDisabled: boolean | undefined;
  selectedRow: any = null;
  lastAddedRow: any = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input', { static: false }) inputField!: ElementRef;


  constructor(
    private fb: FormBuilder,
    private itemService: ItemRegistrationFormService,
    private msgService: MessageServiceService,
    private notificationService: NotificationService,
  ) {
    this.ItemRegForm = this.fb.group({
      itemName: new FormControl('', [Validators.required]),
      itemId: new FormControl('', [Validators.required, Validators.pattern('^ITM[0-9]+$')]),
      category: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.PopulateData();
  }

  onSubmit() {
    try {
      if (this.mode === 'edit') {
        this.itemService.editData(this.selectedData?.id, this.ItemRegForm.value).subscribe({
          next: (response: any) => {
            console.log('put data Server Response', response);
            this.msgService.showSuccess('Record Successfully Edited');
            this.PopulateData();
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


        this.ItemRegForm.patchValue(this.ItemRegForm); // Ensures correct format
        console.log('Form Submitted');
        console.log(this.ItemRegForm.value);

        this.itemService.serviceCallPost(this.ItemRegForm.value).subscribe((response) => {
          this.dataSource = new MatTableDataSource([
            response,
            ...this.dataSource.data,
          ]);
          this.dataSource.paginator = this.paginator; // Reassign paginator
          this.dataSource.sort = this.sort; // Reassign sort
          console.log('post data Server Response', response);
          this.msgService.showSuccess('Record Successfully Added');
          this.addNotification("Item Added Successfully");

          this.lastAddedRow = response; // Track the last added row
          console.log('Added new row:', (response as { id: number }).id);
          const addedID = (response as { id: number }).id;

          setTimeout(() => {
            this.lastAddedRow = null;
            const dataObj = {
              stockItemID: addedID,
              qty: 0,
              stockItemName: this.ItemRegForm.value.itemName,
            };
            console.log(dataObj);

            this.itemService.createStock(dataObj).subscribe({
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
        // this.PopulateData();
        this.isButtonDisabled = true;
        this.ItemRegForm.disable();
      }, 500);
    } catch (error) {
      console.log(error);
      this.msgService.showError('Error ' + error);
    }
  }


  resetData(formDirective: FormGroupDirective) {
    this.ItemRegForm.enable();
    formDirective.resetForm();
    this.ItemRegForm.reset();
    this.saveButtonLabel = 'Save';
    this.mode = 'Save';
    this.isButtonDisabled = true;
    this.selectedRow = null;
  }


  PopulateData(): void {
    try {
      this.itemService.getData().subscribe((response: any) => {
        console.log('get data Server Response', response);
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator; // Reassign paginator
        this.dataSource.sort = this.sort; // Reassign sort
      });
    } catch (error) {
      console.log(error);
    }
  }

  public editData(data: any): void {
    this.ItemRegForm.patchValue(data);
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
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
        if (result && !result.isConfirmed) {
          return;
        }
      this.itemService.deleteData(id).subscribe({
        next: (response) => {
          const index = this.dataSource.data.findIndex((element) => element.id === id);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
          }
          this.dataSource = new MatTableDataSource(this.dataSource.data);
          this.msgService.showSuccess('Data deleted successfully!');
        },
        error: (error) => {
          this.msgService.showError('Action failed with error ' + error);
        }
      });
    });
    }
    catch (error) {
      this.msgService.showError('Action failed with error ' + error);
    }
  }

  public refreshData(): void {
    this.PopulateData();
  }

  public addNotification(details: any): void {
    this.notificationService.addNotification('Item Added Successfully', 'success', 1);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



}
