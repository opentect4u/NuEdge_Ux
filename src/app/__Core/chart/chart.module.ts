import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [
    ChartComponent
  ],
  imports: [
    CommonModule,
    HighchartsChartModule
  ],
  exports:[ChartComponent]
})
export class ChartModule { }
