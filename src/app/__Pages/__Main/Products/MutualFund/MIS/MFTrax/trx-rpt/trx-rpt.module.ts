import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrxRptComponent } from './trx-rpt.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { PanelModule } from 'primeng/panel';
const routes:Routes =[
  {
    path:'',
    component:TrxRptComponent
  }
]

@NgModule({
  declarations: [
    TrxRptComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    PanelModule,

  ]
})
export class TrxRptModule { }
