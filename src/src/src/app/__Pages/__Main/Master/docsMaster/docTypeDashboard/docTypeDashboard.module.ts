import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocTypeDashboardComponent } from './docTypeDashboard.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes =[{path:'',component:DocTypeDashboardComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DocTypeDashboardComponent]
})
export class DocTypeDashboardModule { }
