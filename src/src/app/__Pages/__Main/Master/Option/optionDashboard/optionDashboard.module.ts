import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionDashboardComponent } from './optionDashboard.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes =[{path:'',component:OptionDashboardComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OptionDashboardComponent]
})
export class OptionDashboardModule { }
