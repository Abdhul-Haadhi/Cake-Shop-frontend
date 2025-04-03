import { Routes } from '@angular/router';
import { FormDemoComponent } from './form-demo/form-demo.component';
import { FormTaskComponent } from './form-task/form-task.component';
import { EmployeeRegistrationComponent } from './employee-registration/employee-registration.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CustomerRegistrationComponent } from './customer-registration/customer-registration.component';

export const PagesRoutes: Routes = [
    {
        path:'form-demo',
        component: FormDemoComponent
    },
    {
        path:'form-task',
        component: FormTaskComponent
    },
    {
        path:'employee-registration',
        component: EmployeeRegistrationComponent
    },
    {
        path:'home-page',
        component: HomePageComponent
    },
    {
        path:'customer-registration',
        component: CustomerRegistrationComponent
    },
];
