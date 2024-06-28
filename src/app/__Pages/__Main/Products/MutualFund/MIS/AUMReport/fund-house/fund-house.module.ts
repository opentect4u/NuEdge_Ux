import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FundHouseComponent } from './fund-house.component';
import { RouterModule, Routes } from '@angular/router';
import { AumGlobalModule } from '../component/aumGlobal.module';


const routes:Routes = [
  {
    path:'',
    component:FundHouseComponent,
    data:{breadcrumb:'AUM Report By Fund House',type:'FUND'},
  }
]

@NgModule({
  declarations: [
    FundHouseComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AumGlobalModule
  ],
  // exports:[AumGlobalModule]
})
export class FundHouseModule { }
