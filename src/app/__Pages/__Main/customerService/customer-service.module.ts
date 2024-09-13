import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerServiceComponent } from './customer-service.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes = [
  {
    path:'',
    component:CustomerServiceComponent,
    data: { breadcrumb: 'Customer Service',Title:'Customer Service',pageTitle:'Customer Service' },
    children:[
      {
        path:'',
        loadChildren:() => import('./customerServiceHome/customer-service-home.module').then(m => m.CustomerServiceHomeModule),
      },
      {
        path:':queryId/:productId',
        loadChildren:() => import('./query-entry-screen/query-entry-screen.module').then(m => m.QueryEntryScreenModule)
      },
      // {
      //   path:'',
      //   pathMatch:'full',
      //   redirectTo:'customer-service-options'
      // }, customer-service-options
    ]
  }
]

@NgModule({
  declarations: [
    CustomerServiceComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CustomerServiceModule { }
