import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StpTypeComponent } from './stp-type.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManualEntrComponent } from './Dialog/manual-entr/manual-entr.component';
import { RPTComponent } from './Dialog/rpt/rpt.component';

 const routes: Routes = [{path:'',component:StpTypeComponent,data:{breadcrumb:'STP Type'}}]

@NgModule({
  declarations: [
    StpTypeComponent,
    ManualEntrComponent,
    RPTComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class StpTypeModule { }
