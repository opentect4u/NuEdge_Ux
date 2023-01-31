import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RntDashboardComponent } from './rntDashboard.component';
import { RouterModule, Routes } from '@angular/router';
const routes:Routes =[{path:'',component:RntDashboardComponent}]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RntDashboardComponent]
})
export class RntDashboardModule {
  constructor() {
    console.log('RntDashboardModule loaded');
  }
 }
