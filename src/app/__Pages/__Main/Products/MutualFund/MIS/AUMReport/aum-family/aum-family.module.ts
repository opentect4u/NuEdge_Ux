import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AumFamilyComponent } from './aum-family.component';
import { RouterModule, Routes } from '@angular/router';
import { AumGlobalModule } from '../component/aumGlobal.module';


const routes:Routes =[
  {
    path:'',
    component:AumFamilyComponent,
    data:{breadcrumb:'AUM Report By Family',type:'Family',has_sub_column:false},
  }
]

@NgModule({
  declarations: [
    AumFamilyComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AumGlobalModule
  ]
})
export class AumFamilyModule { }
