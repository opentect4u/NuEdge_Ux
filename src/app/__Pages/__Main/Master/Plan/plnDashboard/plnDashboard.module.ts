import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlnDashboardComponent } from './plnDashboard.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes =[{path:'',component:PlnDashboardComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PlnDashboardComponent]
})
export class PlnDashboardModule { }