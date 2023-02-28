import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubcatDashboardComponent } from './subcatDashboard.component';

import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [{path:'',component:SubcatDashboardComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SubcatDashboardComponent]
})
export class SubcatDashboardModule { }
