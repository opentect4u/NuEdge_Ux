import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AumGrowthComponent } from './aum-growth.component';
import { RouterModule, Routes } from '@angular/router';
import { AumGlobalModule } from '../component/aumGlobal.module';
import { ChartModule } from 'src/app/__Core/chart/chart.module';

const routes:Routes = [
  {
      path:'',
      component:AumGrowthComponent,
      data:{breadcrumb:'AUM Growth Report',type:'Growth',has_sub_column:false},
  }
]

@NgModule({
  declarations: [
    AumGrowthComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AumGlobalModule,
    ChartModule
  ]
})
export class AumGrowthModule { }
