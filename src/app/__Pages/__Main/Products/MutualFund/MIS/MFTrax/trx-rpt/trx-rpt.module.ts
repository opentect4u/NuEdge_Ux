import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrxRptComponent } from './trx-rpt.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonReportModule } from 'src/app/__Pages/__Main/Operations/MUTUALFUND/Report/commonRpt.module';
import { TabModule } from 'src/app/__Core/tab/tab.module';
import { FormsModule } from '@angular/forms';
// import { PanelModule } from 'primeng/panel';
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
    FormsModule,
    TabModule,
    CommonReportModule
  ]
})
export class TrxRptModule { }






