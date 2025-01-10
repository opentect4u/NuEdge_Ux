import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AumClientComponent } from './aum-client.component';
import { RouterModule, Routes } from '@angular/router';
import { AumGlobalModule } from '../component/aumGlobal.module';

const routes:Routes =[
  {
    path:'',
    component:AumClientComponent,
    data:{breadcrumb:'AUM Report By Clients',type:'Clients',has_sub_column:true},
  }
]


@NgModule({
  declarations: [
    AumClientComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AumGlobalModule
  ]
})
export class AumClientModule { }
