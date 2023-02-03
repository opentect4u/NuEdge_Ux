import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatDashboardComponent } from './catDashboard.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [{path:'',component:CatDashboardComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CatDashboardComponent]
})
export class CatDashboardModule { }
