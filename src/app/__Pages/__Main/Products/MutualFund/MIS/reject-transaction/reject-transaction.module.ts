import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RejctTransactionComponent } from './rejct-transaction.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
/*************PRIMENG DIALOG BOX********************* */
import { DialogModule } from 'primeng/dialog';
/******************END***************************** */
const routes:Routes = [
  {
    path:'',
    component:RejctTransactionComponent,
    data:{breadcrumb:'Reject Transaction',
      pageTitle:'Reject Transaction',
      title:'Reject Transaction'
     }
  }
]

@NgModule({
  declarations: [
    RejctTransactionComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonModule,
    SharedModule,
    DialogModule
  ]
})
export class RejectTransactionModule { }
