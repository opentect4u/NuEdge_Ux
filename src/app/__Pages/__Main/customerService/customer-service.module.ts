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
        path:'customer-service-options',
        loadChildren:() => import('./customerServiceHome/customer-service-home.module').then(m => m.CustomerServiceHomeModule),
      },
      {
        path:'transaction-query',
        loadChildren:() => import('./transactionQuery/transaction-query.module').then(m => m.TransactionQueryModule)
      },
      {
        path:'',
        pathMatch:'full',
        redirectTo:'customer-service-options'
      }
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
