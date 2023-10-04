import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestorStaticReportComponent } from './investor-static-report.component';
import { RouterModule, Routes } from '@angular/router';
import { TabModule } from '../../../../../__Core/tab/tab.module';
import { SharedModule } from '../../../../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: InvestorStaticReportComponent,
    data: {
      breadcrumb: 'Investor Static Report',
      title: 'Investor Static Report',
      pageTitle: 'Investor Static Report'
    }
  }
]

@NgModule({
  declarations: [
    InvestorStaticReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TabModule,
    SharedModule
  ]
})
export class InvestorStaticReportModule { }
