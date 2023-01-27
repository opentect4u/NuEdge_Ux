import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MfTraxDashboardComponent } from './MfTraxDashboard.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes =[{path:'',component:MfTraxDashboardComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MfTraxDashboardComponent]
})
export class MfTraxDashboardModule { 
  constructor() {
    console.log("Mf Trax Module Loaded");
  }

}
