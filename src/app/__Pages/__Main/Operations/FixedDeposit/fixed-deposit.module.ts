import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FixedDepositComponent } from './fixed-deposit.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [
  {
    path:'',
    component:FixedDepositComponent,
    data:{breadcrumb:'Fixed Deposit'},
    children:[
      {
             path:'',
             loadChildren:()=>import('./fixdeposit-home/fixdeposit-home.module').then(m => m.FixdepositHomeModule),
      },
      {
        path:'rcvForm',
        loadChildren:()=> import('./RcvForm/rcv-form.module').then(m => m.RcvFormModule)
      },
      {
        path:'fdtrax',
        loadChildren:()=> import('./ManualEntry/fd-trax.module').then(m => m.FdTraxModule)
      },
      {
        path:'ack',
        loadChildren:()=> import('./Acknowledgement/ack.module').then(m => m.AckModule)
      },
      {
        path:'manualupdate',
        loadChildren:()=> import('./ManualUpdate/manual-update.module').then(m => m.ManualUpdateModule)
      },
      {
        path:'fdcertificate',
        loadChildren:()=> import('./FDCertificate/fdcertificate.module').then(m => m.FDCertificateModule)
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
