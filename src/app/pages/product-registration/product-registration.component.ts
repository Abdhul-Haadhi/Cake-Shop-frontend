import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormControl,FormGroup, Validators } from '@angular/forms';
import {ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ProductRegistrationFormService } from 'src/app/services/product-registration/product-registration-form.service';
import { ItemRegistrationFormService } from 'src/app/services/item-registration/item-registration-form.service';


// interface Product {
//   value: string;
//   viewValue: string;
// }

interface Category {
  value: string;
  viewValue: string;
}

interface RequiredItem {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-product-registration',
  standalone: false,
  templateUrl: './product-registration.component.html',
  styleUrl: './product-registration.component.scss'
})
export class ProductRegistrationComponent implements OnInit{

  ProdRegForm: FormGroup;
  requiredItemsWithQuantities: {item:string, quantity:number, unitPrice?:number}[]=[];
  itemsWithPrices: any[] = [];

 
  category: Category[] = [
    {value: 'weight', viewValue: 'Weight'},
    {value: 'quantity', viewValue: 'Quantity'},
  ];



  requiredItem: RequiredItem[] = [
    {value: 'flour', viewValue: 'Flour'},
    {value: 'sugar', viewValue: 'Sugar'},
    {value: 'butter', viewValue: 'Butter'},
    {value: 'eggs', viewValue: 'Eggs'},
    {value: 'bakingPowder', viewValue: 'Baking powder'},
    {value: 'bakingSoda', viewValue: 'Baking soda'},
    {value: 'essence', viewValue: 'Essence'},
    {value: 'cocoaPowder', viewValue: 'Cocoa powder'},
    {value: 'icingSugar', viewValue: 'Icing sugar'},
    {value: 'icingButter', viewValue: 'Icing butter'},
    {value: 'milk', viewValue: 'Milk'},
    {value: 'cashewNuts', viewValue: 'Cashew nuts'},
    {value: 'plums', viewValue: 'Plums'},
    {value: 'dates', viewValue: 'Dates'},
    {value: 'dryFruits', viewValue: 'Dry fruits'},
    {value: 'bakingPaper', viewValue: 'Baking paper'},
    {value: 'foodColors', viewValue: 'Food colors'},];



  //   selectedFile: File | null = null;
  //   previewUrl: string | ArrayBuffer | null = null;



  displayedColumns: string[] = [
    'productId',
    'product',
    'description',
    'initialWeight',
    'requiredItems',
    'measurementCategory',
    'usedAmount',
    'unitPrice',
    'totalCost',
    'actions',
  ];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  isButtonDisabled = false;
  saveButtonLabel: string = 'Save';
  submitted = false;
  mode = 'add';
  selectedData!: { id: any; };

  constructor(
    private fb: FormBuilder,
    private prodService: ProductRegistrationFormService,
    private itemService: ItemRegistrationFormService,
    private messageService: MessageServiceService,
  ){

    this.ProdRegForm = this.fb.group({
      productId : new FormControl('',[Validators.required]),
      product : new FormControl('',[Validators.required]),
      initialWeight : new FormControl('',[Validators.required]),
      requiredItems : new FormControl([],[Validators.required]),
      measurementCategory : new FormControl('',[Validators.required]),
      usedAmount : new FormControl('',[Validators.required]),
      unitPrice: new FormControl('',[Validators.required]),
      description: new FormControl('',[Validators.required]),
      image: new FormControl('',[Validators.required]),
      totalCost: new FormControl({ value: '', disabled: true }),
      // requiredItemsQuantities: this.fb.group({}),
      requiredItemsQuantities: new FormControl([],[Validators.required]),
    });
  }

  // onFileSelected(event: Event): void {
  //   const fileInput = event.target as HTMLInputElement;

  //   if (fileInput.files && fileInput.files.length > 0) {
  //     this.selectedFile = fileInput.files[0];

  //     // Preview image
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.previewUrl = reader.result;
  //     };
  //     reader.readAsDataURL(this.selectedFile);
  //   }
  // }

  ngOnInit(): void {
    // this.loadItemsWithPrices();
    this.populateData();

    this.ProdRegForm.get('requiredItems')?.valueChanges.subscribe(items=>{
      this.updateRequiredItemsQuantities(items);
      this.calculateTotalCost();
    })
  }

  // loadItemsWithPrices():void{
  //   this.itemService.getData().subscribe({
  //     next: (items) =>{
  //       this.itemsWithPrices = items;
  //     },
  //     error:(error)=>{
  //       this.messageService.showError('Failed to load items: ' + error);
  //     }
  //   })
  // }

  updateRequiredItemsQuantities(selectedItems:string[]): void{
    const quantitiesGroup = this.ProdRegForm.get('requiredItemsQuantities') as FormGroup;

    Object.keys(quantitiesGroup.controls).forEach(controlName => {
      quantitiesGroup.removeControl(controlName);
    });

    selectedItems.forEach(item => {
      quantitiesGroup.addControl(item, new FormControl('', [Validators.required, Validators.min(0.01)]));
    });
  }

  calculateTotalCost(): void {
    const selectedItems = this.ProdRegForm.get('requiredItems')?.value || [];
    const quantities = this.ProdRegForm.get('requiredItemsQuantities')?.value || {};
    let totalCost = 0;

    selectedItems.forEach((item: string) => {
      const quantity = quantities[item] || 0;
      const itemData = this.itemsWithPrices.find(i => i.item === item);
      const unitPrice = itemData?.unitPrice || 0;
      totalCost += quantity * unitPrice;
    });

    this.ProdRegForm.get('totalCost')?.setValue(totalCost.toFixed(2));
  }

  // onFileSelected(){

  // }

  getItemName(itemValue: string): string {
    const item = this.requiredItem.find(i => i.value === itemValue);
    return item ? item.viewValue : itemValue;
  }
  
  getUnitPrice(itemValue: string): number {
    const itemData = this.itemsWithPrices.find(i => i.item === itemValue);
    return itemData?.unitPrice || 0;
  }
  
  getMeasurementCategory(itemValue: string): string {
    const itemData = this.itemsWithPrices.find(i => i.item === itemValue);
    return itemData?.category === 'weight' ? 'kg' : 'units';
  }

  public populateData(): void{
    try{
      this.prodService.getData().subscribe({
      next: (dataList: any) => {
        if(dataList.length <= 0){
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
    catch(error){
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

  onSubmit(){
      try{
        this.submitted = true;
        if(this.ProdRegForm.invalid){
          return;
        }
        if(this.mode === 'add'){

          this.prodService.serviceCall(this.ProdRegForm.value).subscribe({
            next: (response: any) => {
              if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0){
                      this.dataSource = new MatTableDataSource([response, ...this.dataSource.data,]);
                    }
                    else{
                        this.dataSource = new MatTableDataSource([response]);
                    }
                    this.messageService.showSuccess('Data saved successfully!');
            },
            error: (error) =>{
              this.messageService.showError('Action failed with error' + error);
            }
          });
      }
      else if(this.mode === 'edit'){
        this.prodService.editData(this.selectedData?.id, this.ProdRegForm.value).subscribe({
          next:(response) =>{
            let elementIndex = this.dataSource.data.findIndex((element) => element.id === this.selectedData?.id);
            this.dataSource.data[elementIndex] = response;
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            this.messageService.showSuccess('Data edited successfully!');
          },
          error: (error) => {
            this.messageService.showError('Action failed with error' + error);
          }
        })
      }
      this.mode = 'add';
      this.ProdRegForm.disable();
      this.isButtonDisabled = true;
      }
      catch(error){
        this.messageService.showError('Action failed with error' + error);
   }
}

  public resetData(): void{
    this.ProdRegForm.reset();
    this.ProdRegForm.updateValueAndValidity();
    this.saveButtonLabel = 'Save';
    this.ProdRegForm.enable();
    this.isButtonDisabled = false;
    this.submitted = false;
  }

  public editData(data: any): void {
    this.ProdRegForm.patchValue({
      productId: data.productId,
      product: data.product,
      initialWeight: data.initialWeight,
      requiredItems: data.requiredItems,
      measurementCategory: data.measurementCategory,
      usedAmount: data.usedAmount,
      totalCost: data.totalCost
    });

    if (data.requiredItemsQuantities) {
      const quantitiesGroup = this.ProdRegForm.get('requiredItemsQuantities') as FormGroup;
      Object.keys(data.requiredItemsQuantities).forEach(item => {
        if (quantitiesGroup.get(item)) {
          quantitiesGroup.get(item)?.setValue(data.requiredItemsQuantities[item]);
        }
      });
    }

    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
  }

  public deleteData(data: any): void {
    
    const id = data.id;

    try{
      this.prodService.deleteData(id).subscribe({
        next: (response) =>{
          const index = this.dataSource.data.findIndex((element) => element.id === id);
        if(index !== -1){
          this.dataSource.data.splice(index, 1);
        }
        this.dataSource = new MatTableDataSource(this.dataSource.data);
        this.messageService.showSuccess('Data deleted successfully!');
        },
        error: (error) =>{
          this.messageService.showError('Action failed with error ' + error);
        }
      });
    }
    catch(error){
      this.messageService.showError('Action failed with error ' + error);
    }

    
  }
  public refreshData(): void{
    this.populateData();
  }

}
