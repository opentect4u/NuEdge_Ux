import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionQueryComponent } from './transaction-query.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes:Routes = [
  {
    path:'',
    component:TransactionQueryComponent,
    data:{breadcrumb:'Transaction Query',pageTitle:'Transaction Query',Title:'Transaction Query'}

  }
]

@NgModule({
  declarations: [
    TransactionQueryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class TransactionQueryModule { }
