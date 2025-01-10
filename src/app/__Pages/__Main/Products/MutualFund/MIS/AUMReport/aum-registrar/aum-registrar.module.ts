import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AumRegistrarComponent } from './aum-registrar.component';
import { RouterModule, Routes } from '@angular/router';
import { AumGlobalModule } from '../component/aumGlobal.module';

const routes:Routes =[
  {
    path:'',
    component:AumRegistrarComponent,
    data:{breadcrumb:'AUM Report By Registrar',type:'Registrar',has_sub_column:false},
  }
]

@NgModule({
  declarations: [
    AumRegistrarComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AumGlobalModule
  ]
})
export class AumRegistrarModule { }
