import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client_manageComponent } from './client_manage.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
// import { ClModifcationComponent } from '../Operations/cl-mst/client/addNew/client_manage/home/clModifcation/clModifcation.component';
// import { ClientRptComponent } from '../Operations/cl-mst/client/addNew/client_manage/home/clientRpt/clientRpt.component';


const routes: Routes = [{path:'',component:Client_manageComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [Client_manageComponent,
    // ClModifcationComponent,ClientRptComponent
  ]
})
export class Client_manageModule {
  constructor() {
    console.log("Client_manageModule Loaded");
  }
 }
