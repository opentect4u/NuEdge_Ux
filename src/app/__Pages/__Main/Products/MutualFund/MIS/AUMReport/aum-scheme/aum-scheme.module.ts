import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AumSchemeComponent } from './aum-scheme.component';
import { RouterModule, Routes } from '@angular/router';
import { AumGlobalModule } from '../component/aumGlobal.module';

const routes:Routes =[
  {
    path:'',
    component:AumSchemeComponent,
    data:{breadcrumb:'AUM Report By Scheme',type:'Scheme',has_sub_column:false},

  }
]

@NgModule({
  declarations: [
    AumSchemeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AumGlobalModule
  ]
})
export class AumSchemeModule { }
