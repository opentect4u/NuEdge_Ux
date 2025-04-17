import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AumCityWiseComponent } from './aum-city-wise.component';
import { RouterModule, Routes } from '@angular/router';
import { AumGlobalModule } from '../component/aumGlobal.module';
import { SharedModule } from 'src/app/shared/shared.module';

export const routes: Routes = [
  {
    path:'',
    component:AumCityWiseComponent,
    data:{breadcrumb:'AUM Report By City Type',type:'City Type',has_sub_column:false},
  }
]


@NgModule({
  declarations: [
    AumCityWiseComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AumGlobalModule,
    SharedModule
  ]
})
export class AumCityWiseModule { }
