import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ItemRegistrationFormService } from 'src/app/services/item-registration/item-registration-form.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { ProdItemMapService } from 'src/app/services/prod-item-map-service/prod-item-map.service';
import { ProductRegistrationFormService } from 'src/app/services/product-registration/product-registration-form.service';

@Component({
  selector: 'app-prod-item-map',
  standalone: false,
  templateUrl: './prod-item-map.component.html',
  styleUrl: './prod-item-map.component.scss',
})
export class ProdItemMapComponent implements OnInit {
  itemMapForm: FormGroup;
  productItems: any[] = [];
  filteredItems: any[] = [];
  isDisabled = false;
  saveButtonLabel = 'Save';
  mode = 'add';
  selectedData: any;
  showForm = false;
  submitted = false;
  isButtonDisabled = false;

  displayedColumns: string[] = [
    'productId',
    'productName',
    'initialWeight',
    'actions',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageServiceService,
    private productService: ProductRegistrationFormService,
    private itemService: ItemRegistrationFormService,
    private prodItemsMapService: ProdItemMapService
  ) {
    this.itemMapForm = this.fb.group({
      product: new FormControl(''),
      initialWeight: new FormControl({ value: '', disabled: true }),
      productId: new FormControl(''),
      productName: new FormControl(''),
      itemList: this.fb.array([]),
    });
  }
  ngOnInit(): void {
    this.getFeaturedProducts();
    this.getRegisteredItems();
    this.populateData();
  }

  onSubmit() {
    if (this.mode == 'add') {
      this.prodItemsMapService
        .addProductItemMap(this.itemMapForm.getRawValue())
        .subscribe({
          next: (response: any) => {
            console.log(this.itemMapForm.getRawValue());
            this.populateData();

            this.messageService.showSuccess('Data saved successfully!');
          },
          error: (error: any) => {
            this.messageService.showError(error);
          },
        });
    } else if ((this.mode = 'edit')) {
      this.prodItemsMapService
        .updateProductItemMap(
          this.itemMapForm.getRawValue(),
          this.selectedData?.id
        )
        .subscribe({
          next: (response: any) => {
            console.log(this.itemMapForm.getRawValue());
            this.populateData();

            this.messageService.showSuccess('Data Updated successfully!');
          },
          error: (error: any) => {
            this.messageService.showError(error);
          },
        });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource && this.dataSource.filter) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    if (this.dataSource && this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public onProductChange(input: any) {
    // set product name to form here [todo]

    const product = this.productItems.find(
      (item: any) => item.id == +input.value
    );

    this.itemMapForm.patchValue({
      initialWeight: product.initialWeight,
      productId: product.productId,
      productName: product.product,
    });
  }

  get itemList() {
    return this.itemMapForm.get('itemList') as FormArray;
  }

  public onItemChange(inputValue: any, index: number) {
    const selectedItem: any = this.filteredItems.find(
      (item: any) => item.id == inputValue.value
    );

    const itemGroup = this.itemList.at(index) as FormGroup;
    itemGroup.get('itemName')?.patchValue(selectedItem.itemName);
    itemGroup.get('category')?.patchValue(selectedItem.category);
  }

  removeItem(index: number) {
    this.itemList.removeAt(index);
  }

  addItem() {
    this.itemList.push(
      this.fb.group({
        id: [null],
        itemId: [''],
        itemName: [''],
        category: [{ value: '', disabled: true }],
        itemQuantity: [''],
      })
    );
  }

  resetItem() {
    this.resetData();
  }

  public resetData() {
    const itemListFormArray = this.itemList;
    itemListFormArray.clear();
    this.resetFormManually();
    this.itemMapForm.reset();
    this.saveButtonLabel = 'Save';
    // this.isButtonDisable = false;
    this.enableFormManually();

    while (itemListFormArray.length !== 0) {
      itemListFormArray.removeAt(0);
    }
  }

  public resetFormManually() {
    this.itemMapForm.get('product')?.reset({}, { emitEvent: false });
    this.itemMapForm.get('productName')?.reset();
  }

  public enableFormManually() {
    this.itemMapForm.get('product')?.enable({ emitEvent: false });
    this.itemMapForm.get('productName')?.enable();
  }

  refreshData() {
    this.populateData();
  }

  populateData() {
    try {
      this.prodItemsMapService.getData().subscribe({
        next: (response: any) => {
          if (response && response.length <= 0) {
            return;
          }
          this.dataSource = new MatTableDataSource(response);
          if (this.dataSource && this.dataSource.paginator && this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
          if (this.dataSource && this.dataSource.sort && this.sort) {
            this.dataSource.sort = this.sort;
          }
        },
        error: (error: any) => {},
      });
    } catch (error) {
      this.messageService.showError('Action failed with error ' + error);
    }
  }

  editItem(data: any) {
    this.resetData();
    this.mode = 'edit';
    this.itemMapForm.patchValue({
      product: data.product,
      productName: data.productName,
      initialWeight: data.initialWeight,
      productId: data.productId,
    });
    this.itemMapForm.enable();

    data.itemList.forEach((item: any) => {
      this.itemList.push(
        this.fb.group({
          id: [item.id],
          itemId: [item.itemId],
          itemName: [item.itemName],
          category: [item.category],
          itemQuantity: [item.itemQuantity],
        })
      );
    });

    this.selectedData = data;
    this.saveButtonLabel = 'Edit';
  }

  closeForm() {
    this.showForm = false;
    this.itemMapForm.reset();
    this.submitted = false;
  }

  public getFeaturedProducts(): void {
    try {
      this.productItems = [];
      this.productService.getAllProducts().subscribe((response) => {
        response.forEach((element: any) => {
          this.productItems.push(element);
        });
      });
    } catch (error) {
      this.messageService.showError(
        'Action failed while getting featured products ' + error
      );
    }
  }

  public getRegisteredItems(): void {
    try {
      this.itemService.getData().subscribe((response: any) => {
        if (response.length > 0) {
          this.filteredItems = response;
        }
      });
    } catch (error) {
      this.messageService.showError(
        'Action failed while getting registered items ' + error
      );
    }
  }
}
