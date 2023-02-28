import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RcvDashboardComponent } from './rcvDashboard.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [{path:'',component:RcvDashboardComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RcvDashboardComponent]
})
export class RcvDashboardModule { }
