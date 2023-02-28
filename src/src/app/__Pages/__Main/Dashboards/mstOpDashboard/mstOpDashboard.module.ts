import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MstOpDashboardComponent } from './mstOpDashboard.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes =[{path:'',component:MstOpDashboardComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MstOpDashboardComponent]
})
export class MstOpDashboardModule { 
  /**
   *
   */
  constructor() {
     console.log('Master Operation dashboard module loaded');
  }
}
