import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AumBySchemeCodeComponent } from './aum-by-scheme-code.component';
import { RouterModule, Routes } from '@angular/router';
import { AumGlobalModule } from '../component/aumGlobal.module';

export const routes: Routes = [
  {
    path:'',
    component:AumBySchemeCodeComponent,
    data:{breadcrumb:'AUM Report By Scheme',type:'Scheme',has_sub_column:false},
  }
]

@NgModule({
  declarations: [
    AumBySchemeCodeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AumGlobalModule
  ]
})
export class AumBySchemeCodeModule { }
