import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClntMstDashboardComponent } from './clntMstDashboard.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes =[{path:'',component:ClntMstDashboardComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClntMstDashboardComponent]
})
export class ClntMstDashboardModule { 

  constructor() {
    console.log('ClntMstDashboardComponent loaded');
    
  }
}
