import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagesRoutes } from './pages.routing.module';
import { DemoMaterialModule } from '../demo-material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormDemoComponent } from './form-demo/form-demo.component';
import { FormTaskComponent } from './form-task/form-task.component';
import { EmployeeRegistrationComponent } from './employee-registration/employee-registration.component';
import { MatTableModule } from '@angular/material/table';
import { CustomerRegistrationComponent } from './customer-registration/customer-registration.component';
import { ItemRegistrationComponent } from './item-registration/item-registration.component';
import { ProductRegistrationComponent } from './product-registration/product-registration.component';
import { FeaturedProductsComponent } from './featured-products/featured-products.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PopupBoxComponent } from './popup-box/popup-box.component';
import { FeedbackAndRatingComponent } from './feedback-and-rating/feedback-and-rating.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrderPageComponent } from './order-page/order-page.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { SupplierRegistrationComponent } from './supplier-registration/supplier-registration.component';
import { CheckoutPageComponent } from './checkout-page/checkout-page.component';
import { GrnComponent } from './grn/grn.component';
import { EmployeeListComponent } from './reports/Static Report/app/components/employee-list/employee-list.component';
import { OrderListComponent } from './order-list/order-list.component';
import { ItemListComponent } from './reports/Static Report/app/components/item-list/item-list.component';
import { CutomerFeedbackComponent } from './cutomer-feedback/cutomer-feedback.component';
import { RegDialogComponent } from './employee-registration/reg-dialog/reg-dialog.component';
import { ProdItemMapComponent } from './prod-item-map/prod-item-map.component';

@NgModule({
  declarations: [
    FormDemoComponent,
    FormTaskComponent,
    EmployeeRegistrationComponent,
    CustomerRegistrationComponent,
    ItemRegistrationComponent,
    ProductRegistrationComponent,
    FeaturedProductsComponent,
    PopupBoxComponent,
    FeedbackAndRatingComponent,
    OrderPageComponent,
    CartPageComponent,
    SupplierRegistrationComponent,
    CheckoutPageComponent,
    GrnComponent,
    EmployeeListComponent,
    OrderListComponent,
    ItemListComponent,
    CutomerFeedbackComponent,
    RegDialogComponent,
    ProdItemMapComponent
  ],
  imports: [
    CommonModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    NgApexchartsModule,
    MatDialogModule,
    MatButtonModule,
    FontAwesomeModule,
    RouterModule.forChild(PagesRoutes),
  ],
  exports: [],
})
export class PagesModule { }
