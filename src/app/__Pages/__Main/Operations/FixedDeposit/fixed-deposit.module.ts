import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FixedDepositComponent } from './fixed-deposit.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [
  {
    path:'',
    component:FixedDepositComponent,
    children:[
      {
             path:'',
             loadChildren:()=>import('./fixdeposit-home/fixdeposit-home.module').then(m => m.FixdepositHomeModule)
      },
      {
        path:'rcvForm',
        loadChildren:()=> import('./RcvForm/rcv-form.module').then(m => m.RcvFormModule)
      },
      {
        path:'fdtrax',
        loadChildren:()=> import('./ManualEntry/fd-trax.module').then(m => m.FdTraxModule)
      }
    ]
  }
]

@NgModule({
  declarations: [
    FixedDepositComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class FixedDepositModule { }