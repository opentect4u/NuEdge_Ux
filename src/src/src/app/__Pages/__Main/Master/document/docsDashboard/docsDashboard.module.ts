import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsDashboardComponent } from './docsDashboard.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes =[{path:'',component:DocsDashboardComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DocsDashboardComponent]
})
export class DocsDashboardModule { }
