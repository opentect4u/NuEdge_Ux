import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankDashboardComponent } from './bankDashboard.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [{path:'',component:BankDashboardComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BankDashboardComponent]
})
export class BankDashboardModule { }
