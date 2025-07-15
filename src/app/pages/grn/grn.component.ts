import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime } from 'rxjs';
import { GrnServiceService } from 'src/app/services/grn/grn-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';


interface Items {
  id: number;
  itemName: string;
  itemId: string;
}

interface Suppliers {
  id: number;
  supplierName: string;
  supplierId: string;
}


@Component({
  selector: 'app-grn',
  standalone: false,
  templateUrl: './grn.component.html',
  styleUrl: './grn.component.scss'
})
export class GrnComponent implements OnInit{

  grnForm: FormGroup;
  innerForm: FormGroup;


  allOuterBtnDisabled: boolean = false;
  resetOuterDisabled: boolean = false;
  editDisable: boolean = false;
  deleteDisable: boolean = false;

  items: any;
  innerColumns: string[] = ['item', 'qty', 'cost', 'ucost', 'actions'];
  dataSource = new MatTableDataSource<any>();

  suppliers: any;
  displayedColumns: string[] = ['grnno', 'supplier', 'tcost', 'addedDate', 'actions'];
  dataSourceOuter = new MatTableDataSource<any>();


  filteredItems: any;

  saveBtnLabel = 'Save';
  addBtnLabel = 'Add';

  innermode = 'inneradd';
  mode = 'Save';

  selectedData: any;
  innerselectedData: any;

  isButtonDisabled: boolean = true;
  isInnerButtonDisabled: boolean = true;

  selectedRow: any = null;
  innerselectedRow: any = null;

  lastAddedRow: any = null;
  innerlastAddedRow: any = null;

  lastGrnNo: any = null;
  allItems: any;
  tcost: number | undefined;
  tableHidden: boolean = true;
  originalData: any;
  isinnerEdit: boolean = false;



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input', { static: false }) inputField!: ElementRef;
  @ViewChild('formDirective', { static: false }) formDirectiveRef:
    | FormGroupDirective
    | undefined;
  @ViewChild('innerformDirective', { static: false }) innerformDirectiveRef:
    | FormGroupDirective
    | undefined;


  constructor(
  private fb: FormBuilder,
  private grnService: GrnServiceService,
  private messageService: MessageServiceService
  ){
  // GRN form
  this.grnForm = this.fb.group({
    grnno: new FormControl(''),
    supplier: new FormControl('', Validators.required),
    supplierId: new FormControl(''),
    addedUser: new FormControl(localStorage.getItem('user_name')),
    tcost: new FormControl('',Validators.min(1)),
    addedDate: new FormControl(new Date(), Validators.required),
  });


  // Inner form
  this.innerForm = this.fb.group({
    grnno: new FormControl(''),
    itemID: new FormControl(''),
    item: new FormControl(''),
    expdate: new FormControl('', Validators.required),
    qty: new FormControl('', Validators.required),
    cost: new FormControl('', Validators.required),
    ucost: new FormControl(''),
    availableQty: new FormControl(''),
    itemCategory: new FormControl(''),
  })
  }


  ngOnInit(): void {
    this.getItems();
    this.getSupplier();
    this.getGrn();
    this.getInnerGRN();
    this.dataPopulate();

    this.grnForm.valueChanges.subscribe((values)=>{
    // console.log('Form changed:', values);
    });

    this.innerForm.valueChanges.pipe(
    debounceTime(300)
  )
  .subscribe((values)=>{
    this.getUnitCost(values.qty, values.cost)
  });

  }


  dataPopulate():void{
  try{
    this.grnService.getData().subscribe((response: any)=>{
      console.log('get GRN all Server Response', response);
      this.dataSourceOuter = new MatTableDataSource(response);
      this.dataSourceOuter.paginator = this.paginator;
      this.dataSourceOuter.sort = this.sort;
    });
  }
  catch(error){
    console.log(error);
    
  }
  }
  
   // ------- for item selection---------------
  onItemChange(selectedItem: any): void{
  console.log("selectedItem");

  const newItem = this.items.find(
    (item: { id: any }) => item.id === selectedItem
  );

  if (selectedItem) {
    this.innerForm.patchValue({ item: newItem?.itemName });
    this.innerForm.patchValue({ itemCategory: newItem.category });
    console.log(newItem?.itemName);
  }

  if (selectedItem){
    this.grnService.getQty(selectedItem).subscribe({
        next: (response: any) => {
          console.log('this is item aval qty = ' + JSON.stringify(response));
          //patch value to availableQty from responses qty - response is stock object
          this.innerForm.patchValue({ availableQty: response.qty });
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  else{
    console.log('No item selected or item ID is undefined');
  }

  }

  // ------- for supplier selection---------------
  onSupplierChange(selectedSupplierId: any): void{
    console.log("selectedSupplier");

    const selectedSupplier = this.suppliers.find
      ((supplier: { id: any; }) => supplier.id === selectedSupplierId
    );

    if (selectedSupplier) {
      this.grnForm.patchValue({ supplier: selectedSupplier.id, supplierId: selectedSupplier.supplierId, });
      // console.log(newSupplier?.supplierName);
    }

  }

  refreshData(){
    this.selectedRow = null;
    if (this.inputField){
      this.inputField.nativeElement.value = '';
    }
    this.dataSourceOuter.filter = ''; 
    if (this.dataSourceOuter.paginator) {
      this.dataSourceOuter.paginator.firstPage();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceOuter.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceOuter.paginator) {
      this.dataSourceOuter.paginator.firstPage();
    }
  }

  deleteDataOuter(data: any){
    const id = data.grnno;
    this.grnService.deleteDataOuter(id).subscribe((response)=>{
      console.log('post data Server delete Response', response);
      this.messageService.showSuccess('GRN Record Successfully Deleted');
      this.dataPopulate();
      this.getGrn();
      this.getInnerGRN();
    })
  }

  editDataOuter(data: any){
    this.grnForm.patchValue(data);
    this.grnForm.patchValue({addedDate: new Date(data.addedDate)});
    this.originalData = this.grnForm.value;
    console.log(data.grnno);
    this.saveBtnLabel = 'edit';
    this.mode = 'edit';
    this.selectedData = data;
    this.grnForm.enable();
    this.isButtonDisabled = false;
    this.getInnerGRN();
    this.getItems();
    this.editDisable = false;
    this.deleteDisable = false;

    if(this.selectedRow && this.selectedRow.grnno === data.grnno){
      this.selectedRow = null;
    }
    else{
      this.selectedRow = data;
    }
  }

  checkEdit(formData: any): number{
    const hasChanges = Object.keys(formData).some((key)=>{
      const originalValue = this.originalData[key];
      const formValue = formData[key];

      console.log(formValue + ' this is form value');
      console.log(originalValue + ' this is orignal value');

      const normalizedOriginal = originalValue == null ? '' : originalValue;
      const normalizedForm = formValue == null ? '' : formValue;
      return normalizedOriginal !== normalizedForm;
    });

    if (!hasChanges){
      this.messageService.showWarining('No changes made');
      this.isButtonDisabled = false;
      return 0;
    }
    else{
      return 1;
    }
  }

  onSubmit(){
    try{
      if (this.mode === 'edit'){
        const checked = this.checkEdit(this.grnForm.value);
        if (checked == 1 || this.isinnerEdit == true) {
          this.grnService
            .editDataOuterForm(this.selectedData?.grnno, this.grnForm.value)
            .subscribe({
              next: (response: any) => {
                console.log('put edit data Server Response', response);
                this.messageService.showSuccess('GRN Record Successfully Edited');
                this.dataPopulate();

                setTimeout(() => {
                  this.selectedRow = null;
                  this.editDisable = true;
                  this.deleteDisable = true;
                  this.allOuterBtnDisabled = false;
                  this.resetOuterDisabled = false;
                  this.isButtonDisabled = true;
                  this.grnForm.disable();
                  this.isinnerEdit = false;
                }, 1000);
              },
              error: (error) => {
                console.log(error);
                this.messageService.showError('Error in Edit Record' + error);
              },
            });
        } else {
          setTimeout(() => {
            this.isButtonDisabled = false;
          }, 500);
        }
      }
      else if (this.mode === 'Save'){
        const grnnum = this.grnForm.get('grnno')?.value;
        this.grnForm.patchValue({ grnno: grnnum });

        this.grnService.serviceCallPost(this.grnForm.value).subscribe((response)=>{
          this.dataSourceOuter = new MatTableDataSource([
            response,
            ...this.dataSourceOuter.data,
          ]);
          this.dataSourceOuter.paginator = this.paginator;
          this.dataSourceOuter.sort = this.sort;

          console.log('post data Server Response', response);
          this.messageService.showSuccess('GRN Record Successfully Added');

          this.lastAddedRow = response;
          console.log('Added new row:', response);

          setTimeout(() => {
              this.editDisable = true;
              this.deleteDisable = true;
              this.allOuterBtnDisabled = false;
              this.resetOuterDisabled = false;
              this.getInnerGRN();
              this.lastAddedRow = null;
              this.dataPopulate();
            }, 1000);

            setTimeout(() => {
              this.isButtonDisabled = true;
              this.grnForm.disable();
            }, 500);

            try{
              const itemList = this.allItems;
              console.log('items:', itemList);

              this.grnService.stockUpdate(itemList).subscribe({
                next: (response) => {
                  console.log('post data Server Response', response);
                },
                error: (error) => {
                  console.error('Stock update error:', error);
                },
              });
            }
            catch(e){
              console.error('Error in stockUpdate block:', e);
            }
        });
      }
    }
    catch(error){
      console.log(error);
      this.messageService.showError('Error ' + error);
    }
  }
   
  onSubmitInner(){
    try{
      if (this.innermode === 'inneredit'){
        this.isinnerEdit = true;

        console.log(JSON.stringify(this.innerForm.value) + 'on edit inner');

        this.grnService.innerEditData(this.innerselectedData?.id, this.innerForm.value).subscribe({
          next: (response: any)=>{
            console.log('put data Server Response', response);
              this.messageService.showSuccess('Inner Record Successfully Edited');
              this.getInnerGRN();
              this.innerForm.disable();

              this.resetOuterDisabled = true;
              this.allOuterBtnDisabled = true;

              setTimeout(()=>{
                this.innerselectedRow = null;
                if (this.mode == 'edit'){
                  const innerItem = response;

                  this.grnService.stockUpdateEdit(innerItem).subscribe((response)=>{
                    console.log('post data Server Stock update edit Response',response);
                  });
                }
              },1000);
          },
          error: (error) => {
              console.log(error);
              this.messageService.showError('Error in Edit Record' + error);
            },
        });
      }
      else if(this.innermode === 'inneradd'){
        console.log('before' + this.innerForm);

        //take grn number from demoForm current grn
        const grnnum = this.grnForm.get('grnno')?.value; // Access the value of the 'id' FormControl
        this.innerForm.patchValue({ grnno: grnnum });

        const unitCost = this.innerForm.get('ucost')?.value;
        this.innerForm.patchValue({ ucost: unitCost });

        console.log(
          'Inner Form before submit' + JSON.stringify(this.innerForm.value)
        );

        this.grnService.serviceCallPostInner(this.innerForm.value).subscribe({
          next: (response) => {
            console.log('post data Server Response', response);
            this.messageService.showSuccess('Inner Record Successfully Added');

            this.innerlastAddedRow = response; // Track the last added row for CSS (make green color for 3 secs)
            console.log('Added new row:', response);
            this.resetOuterDisabled = true;
            this.allOuterBtnDisabled = true;

            // When a record is inserted, show the table - tableHidden is bound with [hidden] = 'tableHidden'
            this.tableHidden = false;
            this.getInnerGRN();

            setTimeout(() => {
              // After 3 seconds, remove green color
              this.innerlastAddedRow = null;

              if (this.mode === 'edit') {
                const innerItem = response;
                this.grnService.stockUpdateEdit(innerItem).subscribe({
                  next: (updateResponse) => {
                    console.log(
                      'post data Server inner delete Response',
                      updateResponse
                    );
                  },
                  error: (updateError) => {
                    console.error(
                      'Error occurred during stock update:',
                      updateError
                    );
                  },
                });
              }

              this.filterItems();
            }, 3000);
          },
          error: (error) => {
            console.error('Error occurred while adding inner record:', error);
            this.messageService.showError(
              'Error in Adding Inner Record: ' + error.message
            );
          },
        });

        setTimeout(() => {
          this.isInnerButtonDisabled = true;
          this.innerForm.disable();
          this.calculateTotalCost();
        }, 500);
      }
    }
    catch (error) {
      console.log(error);
      this.messageService.showError('Error ' + error);
    }
  }


  resetData(formDirective: FormGroupDirective) {
    this.grnForm.enable();
    formDirective.resetForm();
    this.grnForm.reset();
    this.saveBtnLabel = 'Save';
    this.mode = 'Save';
    this.isButtonDisabled = true;
    this.selectedRow = null;
    this.innerformDirectiveRef?.resetForm();

    setTimeout(() => {
      this.getGrn();
      this.getInnerGRN();
      this.getItems();
      this.grnForm.patchValue({ addedDate: new Date() });
      this.grnForm.patchValue({
        addedUser: localStorage.getItem('user_name'),
      });
      this.editDisable = false;
      this.deleteDisable = false;
      this.allOuterBtnDisabled = false;
    }, 500);
  }

  resetInner(innerformDirective: FormGroupDirective) {
    innerformDirective.resetForm();
    this.innerForm.reset();
    this.innermode = 'inneradd';
    this.addBtnLabel = 'Add';
    this.innerForm.enable();

    setTimeout(() => {
      this.innerselectedRow = null;
    }, 500);
  }

  getItems(): void {
    this.grnService.getItem().subscribe({
      next: (response: any) => {
        console.log(response);
        this.filteredItems = response;
        this.items = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getSupplier(): void {
    this.grnService.getSupplier().subscribe({
      next: (response: any) => {
        console.log(response);
        this.suppliers = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  filterItems() {
    const allItems = this.items;
    const selectedItems = this.allItems;

    console.log(allItems);
    console.log(selectedItems);

    // const selecteditemIDs = selectedItems.map((item: { itemID: any; }) => item.itemID);
    // const allItemIDs = allItems.map((item: { id: any; }) => item.id);

    this.filteredItems = allItems.filter(
      (item: { id: any }) =>
        !selectedItems.some(
          (selected: { itemID: any }) => selected.itemID === item.id
        )
    );

    console.log(this.items);
  }


  getInnerGRN(): void {
    setTimeout(() => {
      //get current grn from demoForm
      const grnnum = this.grnForm.get('grnno')?.value;

      this.grnService.getInnerGRN(grnnum).subscribe({
        next: (response: any) => {
          //set response to table
          this.dataSource = response;

          //create a variable and assign response to it for stock update
          this.allItems = response;

          if (response.length < 2) {
            if (this.mode == 'edit') {
              this.deleteDisable = true;
            }
          } else {
            if (this.mode == 'edit') {
              this.deleteDisable = false;
            }
          }

          //if there are no rows in inner table hide table headers
          if (response == '') {
            this.tableHidden = true;
            this.resetOuterDisabled = false;
          } else {
            this.tableHidden = false;
          }
          this.calculateTotalCost();
        },
        error: (error) => {
          console.log(error);
        },
      });
    }, 500);
  }


  getGrn(): void {
    this.grnService.getGRNs().subscribe({
      next: (response: any) => {
        if (response == '') {
          this.grnForm.patchValue({ grnno: 1 });
        } else {
          // Get the last element of the array
          const lastGrnObject = response[response.length - 1];
          console.log(lastGrnObject.grnno);

          // Extract the grnno from the last object
          this.lastGrnNo = lastGrnObject.grnno;
          console.log('Last GRN Number:', this.lastGrnNo);
          this.grnForm.patchValue({ grnno: this.lastGrnNo + 1 });
        }
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  getUnitCost(quantity: any, cost: any): void {
    const ucostControl = this.innerForm.get('ucost');
    const qtyValue = parseFloat(quantity);
    const costValue = parseFloat(cost);

    if (!isNaN(qtyValue) && !isNaN(costValue) && qtyValue > 0) {
      const unitCost = costValue / qtyValue;
      ucostControl?.setValue(unitCost.toFixed(2));
    } else {
      ucostControl?.setValue(0); // Clear unit cost if quantity is zero or invalid
    }
  }

  calculateTotalCost(): void {
    //allitems are response from all inner table objects for a grn number
    const itemList = this.allItems;

    const ttcost = itemList?.length
      ? itemList.reduce((sum: any, item: { cost: any }) => sum + item.cost, 0)
      : 0;
    this.grnForm.patchValue({ tcost: ttcost });
  }


  deleteInnerData(data: any) {
    const id = data.id;
    this.grnService.deleteInnerData(id).subscribe((response) => {
      console.log('post data Server Response', response);
      // this.deletedResponses.push(response);
      // console.log(this.deletedResponses);
      this.getInnerGRN();
      this.messageService.showSuccess('Inner Record Successfully Deleted');

      if (this.mode == 'edit') {
        this.allOuterBtnDisabled = true;
        this.resetOuterDisabled = true;

        const innerItem = response;
        alert(JSON.stringify(response) + 'added response');
        this.grnService.stockUpdateEdit(innerItem).subscribe((response) => {
          console.log('post data Server delete Response', response);
        });
      }
    });
  }

  editInnerData(data: any) {
    // this.filterItems();
    this.innerForm.patchValue(data);
    this.innerForm.patchValue({ expdate: new Date(data.expdate) });

    console.log(this.innerForm.value);
    this.onItemChange(data.itemID);
    this.addBtnLabel = 'Edit';
    this.innermode = 'inneredit';
    this.innerselectedData = data;
    this.innerForm.enable();
    this.isInnerButtonDisabled = false;

    setTimeout(() => {}, 1000);

    if (this.innerselectedRow && this.innerselectedRow.id === data.id) {
      this.innerselectedRow = null;
    } else {
      this.innerselectedRow = data;
    }
  }

}
