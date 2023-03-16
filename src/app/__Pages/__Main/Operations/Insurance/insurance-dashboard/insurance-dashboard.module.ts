import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsuranceDashboardComponent } from './insurance-dashboard.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [{path:'',component:InsuranceDashboardComponent}]

@NgModule({
  declarations: [
    InsuranceDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class InsuranceDashboardModule { }
