import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelcapitalgainComponent } from './relcapitalgain.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabModule } from 'src/app/__Core/tab/tab.module';
import { DivReportComponent } from './components/DivReport/div-report.component';
import { ColumnfilterPipe } from './components/pipe/columnfilter.pipe';
import { SegregrateDivHistoryPipe } from './components/pipe/segregrate-div-history.pipe';
import { FinancialyearwiseReportComponent } from './components/FinancialYearWiseReport/financialyearwise-report.component';
const routes: Routes = [
  {
    path:'',
    component: RelcapitalgainComponent
  }
]

@NgModule({
  declarations: [
    RelcapitalgainComponent,
    DivReportComponent,
    ColumnfilterPipe,
    SegregrateDivHistoryPipe,
    FinancialyearwiseReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    TabModule
  ]
})
export class RelcapitalgainModule { }
