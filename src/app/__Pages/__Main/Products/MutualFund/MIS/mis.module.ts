import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MisComponent } from './mis.component';
import { RouterModule, Routes } from '@angular/router';


 const routes: Routes = [{
    path:'',
    component:MisComponent,
    data:{breadcrumb:'MIS Report'},
    children:[
      {
        path:'home',
        loadChildren:()=> import('./home/home.module').then(m => m.HomeModule)
      },
      {
       path:'mftrax',
       loadChildren:()=> import('./MFTrax/mf-trx-home/mf-trx-home.module').then(m=> m.MfTrxHomeModule)
      },
      {
       path:'transaction',
       loadChildren:()=> import('./TransactionReport/trxn-rpt/trxn-rpt.module').then(m => m.TrxnRptModule)
      },
      {
        path:'aum',
        loadChildren:()=> import('./AUMReport/aum.module').then(aum => aum.AumModule)
      },
      {
        path:'',
        redirectTo:'home',
        pathMatch:'full'
      }
    ]
}
]

@NgModule({
  declarations: [
    MisComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MisModule { }
