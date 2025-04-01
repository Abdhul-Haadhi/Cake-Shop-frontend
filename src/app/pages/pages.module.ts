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
import { HomePageComponent } from './home-page/home-page.component';


@NgModule({
  declarations: [FormDemoComponent,FormTaskComponent,EmployeeRegistrationComponent,HomePageComponent],
  imports: [
    CommonModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    NgApexchartsModule,
    RouterModule.forChild(PagesRoutes),
    
  ],
  exports: [],
})
export class PagesModule {}
