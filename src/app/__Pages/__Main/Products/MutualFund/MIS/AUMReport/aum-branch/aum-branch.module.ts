import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AumBranchComponent } from './aum-branch.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AumGlobalModule } from '../component/aumGlobal.module';

const routes:Routes =[
  {
    path:'',
    component:AumBranchComponent,
    data:{breadcrumb:'AUM Report By Branch',type:'Branch',has_sub_column:false},
  }
]


@NgModule({
  declarations: [
    AumBranchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AumGlobalModule
  ]
})
export class AumBranchModule { }
