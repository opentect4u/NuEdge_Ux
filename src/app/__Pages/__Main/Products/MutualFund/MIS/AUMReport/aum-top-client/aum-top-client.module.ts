import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AumTopClientComponent } from './aum-top-client.component';
import { RouterModule, Routes } from '@angular/router';
import { AumGlobalModule } from '../component/aumGlobal.module';
import { SharedModule } from 'src/app/shared/shared.module';


const routes:Routes =[
  {
    path:'',
    component:AumTopClientComponent,
    data:{breadcrumb:'AUM Top Client Report',type:'Top Clients',has_sub_column:true},
  }
]

@NgModule({
  declarations: [
    AumTopClientComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AumGlobalModule,
    SharedModule
  ]
})
export class AumTopClientModule { }
