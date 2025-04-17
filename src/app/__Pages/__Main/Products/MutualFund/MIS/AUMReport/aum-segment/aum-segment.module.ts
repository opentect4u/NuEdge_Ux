import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuMSegmentComponent } from './au-m-segment.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AumGlobalModule } from '../component/aumGlobal.module';

const routes:Routes =[
  {
    path:'',
    component:AuMSegmentComponent,
    data:{breadcrumb:'AUM Report By Segment',type:'Segment',has_sub_column:false},
  }
]



@NgModule({
  declarations: [
    AuMSegmentComponent
  ],
  imports: [
     SharedModule,
    CommonModule,
    RouterModule.forChild(routes),
    AumGlobalModule
  ]
})
export class AumSegmentModule { }
