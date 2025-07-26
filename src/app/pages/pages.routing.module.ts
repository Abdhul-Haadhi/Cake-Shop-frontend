import { Routes } from '@angular/router';
import { FormDemoComponent } from './form-demo/form-demo.component';
import { FormTaskComponent } from './form-task/form-task.component';
import { EmployeeRegistrationComponent } from './employee-registration/employee-registration.component';
import { CustomerRegistrationComponent } from './customer-registration/customer-registration.component';
import { ItemRegistrationComponent } from './item-registration/item-registration.component';
import { ProductRegistrationComponent } from './product-registration/product-registration.component';
import { FeaturedProductsComponent } from './featured-products/featured-products.component';
import { FeedbackAndRatingComponent } from './feedback-and-rating/feedback-and-rating.component';
import { OrderPageComponent } from './order-page/order-page.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { SupplierRegistrationComponent } from './supplier-registration/supplier-registration.component';
import { CheckoutPageComponent } from './checkout-page/checkout-page.component';
import { GrnComponent } from './grn/grn.component';
import { EmployeeListComponent } from './reports/Static Report/app/components/employee-list/employee-list.component';
import { OrderListComponent } from './order-list/order-list.component';
import { ItemListComponent } from './reports/Static Report/app/components/item-list/item-list.component';
import { CutomerFeedbackComponent } from './cutomer-feedback/cutomer-feedback.component';
import { ProdItemMapComponent } from './prod-item-map/prod-item-map.component';
import { OrderSuccessPageComponent } from './order-success-page/order-success-page.component';
import { ManualStockAdjustComponent } from './manual-stock-adjust/manual-stock-adjust.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MonthlySalesComponent } from './monthly-sales/monthly-sales.component';
import { MonthlySalesIncomeComponent } from './monthly-sales-income/monthly-sales-income.component';
import { WeeklyOrderStatusComponent } from './weekly-order-status/weekly-order-status.component';

export const PagesRoutes: Routes = [
  {
    path: 'form-demo',
    component: FormDemoComponent,
  },
  {
    path: 'form-task',
    component: FormTaskComponent,
  },
  {
    path: 'employee-registration',
    component: EmployeeRegistrationComponent,
  },
  {
    path: 'customer-registration',
    component: CustomerRegistrationComponent,
  },
  {
    path: 'item-registration',
    component: ItemRegistrationComponent,
  },
  {
    path: 'product-registration',
    component: ProductRegistrationComponent,
  },
  {
    path: 'featured-products',
    component: FeaturedProductsComponent,
  },
  {
    path: 'feedback-and-rating',
    component: FeedbackAndRatingComponent,
  },
  {
    path: 'order-page',
    component: OrderPageComponent,
  },
  {
    path: 'cart-page',
    component: CartPageComponent,
  },
  {
    path: 'supplier-registration',
    component: SupplierRegistrationComponent,
  },
  {
    path: 'checkout-page',
    component: CheckoutPageComponent,
  },
  {
    path: 'grn',
    component: GrnComponent,
  },
  {
    path: 'employee-report',
    component: EmployeeListComponent,
  },
  {
    path: 'order-list',
    component: OrderListComponent,
  },
  {
    path: 'item-report',
    component: ItemListComponent,
  },
  {
    path: 'customer-feedback',
    component: CutomerFeedbackComponent,
  },
  {
    path: 'prod-item-map',
    component: ProdItemMapComponent,
  },
  {
    path: 'order-success-page',
    component: OrderSuccessPageComponent,
  },
  {
    path: 'manual-stock-adjust',
    component: ManualStockAdjustComponent,
  },
  {
    path: 'landing-page',
    component: LandingPageComponent,
  },
  {
    path: 'monthly-sales',
    component: MonthlySalesComponent,
  },
  {
    path: 'monthly-sales-income',
    component: MonthlySalesIncomeComponent,
  },
  {
    path: 'weekly-order-status',
    component: WeeklyOrderStatusComponent,
  },
];
