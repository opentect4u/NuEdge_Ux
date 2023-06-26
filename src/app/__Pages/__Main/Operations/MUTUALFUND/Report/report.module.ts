import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmnReportForMFComponent } from './cmn-report-for-mf.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabModule } from 'src/app/__Core/tab/tab.module';
import { FinancialRPTComponent } from './financial-rpt/financial-rpt.component';
import { NonFinancialRPTComponent } from './non-financial-rpt/non-financial-rpt.component';
import { NfoRPTComponent } from './nfo-rpt/nfo-rpt.component';
const routes: Routes = [{path:'',component:CmnReportForMFComponent,data: { breadcrumb: 'Report'}}]

@NgModule({
  declarations: [
    CmnReportForMFComponent,
    FinancialRPTComponent,
    NonFinancialRPTComponent,
    NfoRPTComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TabModule,
    RouterModule.forChild(routes)
  ]
})
export class ReportModule { }
