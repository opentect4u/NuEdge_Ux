import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionLogComponent } from './transaction-log.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes = [
  {
    path:'',
    component:TransactionLogComponent,
    data:{title: "Nuedge Online - Transaction Log ", pageTitle: "Nuedge Online - Transaction Log",breadcrumb:"Transaction Log"}

  }
]

@NgModule({
  declarations: [
    TransactionLogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class TransactionLogModule { }
