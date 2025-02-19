import { Routes } from '@angular/router';
import { FormDemoComponent } from './form-demo/form-demo.component';
import { FormTaskComponent } from './form-task/form-task.component';

export const PagesRoutes: Routes = [
    {
        path:'form-demo',
        component: FormDemoComponent
    },
    {
        path:'form-task',
        component: FormTaskComponent
    },
];
