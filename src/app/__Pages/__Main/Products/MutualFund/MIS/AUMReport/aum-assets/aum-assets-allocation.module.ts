import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AumAssetsAllocationComponent } from './aum-assets-allocation.component';
import { RouterModule, Routes } from '@angular/router';
import { AumGlobalModule } from '../component/aumGlobal.module';


const routes:Routes =[
  {
    path:'',
    component:AumAssetsAllocationComponent,
    data:{breadcrumb:'AUM Report By Assets Allocation',type:'Assets Allocation',has_sub_column:true},
  }
]

@NgModule({
  declarations: [
    AumAssetsAllocationComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AumGlobalModule
  ]
})
export class AumAssetsAllocationModule { }
