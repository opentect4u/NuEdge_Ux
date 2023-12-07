import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrendRptComponent } from './trend-rpt.component';
import {RouterModule} from '@angular/router';
import { MisCoreModule } from '../core/mis-core.module';
import { ChartModule } from 'src/app/__Core/chart/chart.module';
// import { TabModule } from 'src/app/__Core/tab/tab.module';
 const routes=[{path:'',component:TrendRptComponent}]

@NgModule({
  declarations: [TrendRptComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MisCoreModule,
    ChartModule,
    // TabModule
  ]
})
export class MonthlyMISTrendModule { }
