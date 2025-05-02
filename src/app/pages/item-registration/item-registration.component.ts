import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormControl,FormGroup, Validators } from '@angular/forms';
import {ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { ItemRegistrationFormService } from 'src/app/services/item-registration/item-registration-form.service';


interface Item {
  value: string;
  viewValue: string;
}

interface Category {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-item-registration',
  standalone: false,
  templateUrl: './item-registration.component.html',
  styleUrl: './item-registration.component.scss'
})
export class ItemRegistrationComponent implements OnInit{
  ItemRegForm: FormGroup;



  item: Item[] = [
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
    {value: 'foodColors', viewValue: 'Food colors'},
  ];

  category: Category[] = [
    {value: 'weight', viewValue: 'Weight'},
    {value: 'quantity', viewValue: 'Quantity'},
  ];

  
  displayedColumns: string[] = [
    'itemId',
    'item',
    'category',
    'unitQuantity',
    'supplierId',
    'totalCost',
    'totalQuantity',
    'unitCost',
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

  constructor(private fb: FormBuilder,
    private itemService: ItemRegistrationFormService,
    private messageService: MessageServiceService,
  ){

    this.ItemRegForm = this.fb.group({
      itemId : new FormControl('',[Validators.required]),
      item : new FormControl('',[Validators.required]),
      category : new FormControl('',[Validators.required]),
      unitQuantity : new FormControl('',[Validators.required]),
      supplierId : new FormControl('',[Validators.required]),
      totalCost : new FormControl('',[Validators.required]),
      totalQuantity: new FormControl('',[Validators.required]),
      unitCost: new FormControl('',[Validators.required]),
    });
  }

  calculateUnitCost():void{
    const totalCost = this.ItemRegForm.get('totalCost')?.value;
    const totalQuantity = this.ItemRegForm.get('totalQuantity')?.value;
    const unitQuantity = this.ItemRegForm.get('unitQuantity')?.value;

    if (totalCost && totalQuantity && unitQuantity !== 0){
      const unitCost = (totalCost/totalQuantity) * unitQuantity;
      this.ItemRegForm.get('unitCost')?.setValue(unitCost.toFixed(0));
    }
  }

  ngOnInit(): void {
    
    this.ItemRegForm.get('totalCost')?.valueChanges.subscribe(()=>this.calculateUnitCost());
    this.ItemRegForm.get('totalQuantity')?.valueChanges.subscribe(()=>this.calculateUnitCost());
    this.ItemRegForm.get('unitQuantity')?.valueChanges.subscribe(()=>this.calculateUnitCost());

    this.populateData();
  }

  public populateData(): void{
    try{
      this.itemService.getData().subscribe({
      next: (dataList: any) => {
        if(dataList.length <= 0){
          return;
        }

      this.dataSource = new MatTableDataSource(dataList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
    error: (error) => {
      this.messageService.showError('Action failed with error ' + error);
    }
  });
    }
    catch(error){
      this.messageService.showError('Action failed with error ' + error);
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
      if(this.ItemRegForm.invalid){
        return;
      }
      if(this.mode === 'add'){

      //   this.empService.serviceCall(this.EmpRegForm.value).subscribe((Response)=>{
      //     if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0){
      //       this.dataSource = new MatTableDataSource([Response, ...this.dataSource.data,]);
      //     }
      //     else{
      //         this.dataSource = new MatTableDataSource([Response]);
      //     }
      //     this.messageService.showSuccess('Data saved successfully!');

      // });


        this.itemService.serviceCall(this.ItemRegForm.value).subscribe({
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
            this.messageService.showError('Action failed with error ' + error);
          }
        });
    }
    else if(this.mode === 'edit'){
      this.itemService.editData(this.selectedData?.id, this.ItemRegForm.value).subscribe({
        next:(response) =>{
          let elementIndex = this.dataSource.data.findIndex((element) => element.id === this.selectedData?.id);
          this.dataSource.data[elementIndex] = response;
          this.dataSource = new MatTableDataSource(this.dataSource.data);
          this.messageService.showSuccess('Data edited successfully!');
        },
        error: (error) => {
          this.messageService.showError('Action failed with error ' + error);
        }
      })
    }
    this.mode = 'add';
    this.ItemRegForm.disable();
    this.isButtonDisabled = true;
    }
    catch(error){
      this.messageService.showError('Action failed with error ' + error);
    }
  }

  public resetData(): void{
    this.ItemRegForm.reset();
    this.ItemRegForm.updateValueAndValidity();
    this.saveButtonLabel = 'Save';
    this.ItemRegForm.enable();
    this.isButtonDisabled = false;
    this.submitted = false;
  }

  public editData(data: any): void {
    this.ItemRegForm.patchValue(data);
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
  }

  public deleteData(data: any): void {
    
    const id = data.id;

    try{
      this.itemService.deleteData(id).subscribe({
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
