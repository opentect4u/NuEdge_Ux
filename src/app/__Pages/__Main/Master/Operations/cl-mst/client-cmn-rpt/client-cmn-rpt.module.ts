import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientCmnRptComponent } from './client-cmn-rpt.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabModule } from 'src/app/__Core/tab/tab.module';
import { SharedClModuleModule } from '../sharedClientModule/shared-cl-module.module';

 const routes:Routes = [{path:'',component:ClientCmnRptComponent}]

@NgModule({
  declarations: [
    ClientCmnRptComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    // SharedModule,
    SharedClModuleModule,
    TabModule
  ]
})
export class ClientCmnRptModule { }
