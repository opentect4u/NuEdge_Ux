import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MfTrxHomeComponent } from './mf-trx-home.component';
import { RouterModule, Routes } from '@angular/router';

 const routes:Routes = [
  {
    path:'',
    component:MfTrxHomeComponent,
    data:{breadcrumb:'MF Trax'},
    children:[
       {
        path:'report',
        loadChildren:()=>import('../trx-rpt/trx-rpt.module').then(m => m.TrxRptModule),
        data:{title: "NuEdge - MF Trax", pageTitle: "MF Trax"}
       },
       {
        path:'',
        redirectTo:'report'
       }
    ]
  }
 ]

@NgModule({
  declarations: [
    MfTrxHomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MfTrxHomeModule { }
