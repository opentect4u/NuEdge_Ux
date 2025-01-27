import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmnReportForMFComponent } from './cmn-report-for-mf.component';
import { RouterModule, Routes } from '@angular/router';
import { TabModule } from 'src/app/__Core/tab/tab.module';
import { FormsModule } from '@angular/forms';
import { CommonReportModule } from './commonRpt.module';
const routes: Routes = [{path:'',
component:CmnReportForMFComponent,
data: { breadcrumb: 'Report',title:'Mutual Fund Report',pageTitle:'Mutual Fund Report'}}]

@NgModule({
  declarations: [
    CmnReportForMFComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TabModule,
    CommonReportModule,
    RouterModule.forChild(routes)
  ]
})
export class ReportModule { }
