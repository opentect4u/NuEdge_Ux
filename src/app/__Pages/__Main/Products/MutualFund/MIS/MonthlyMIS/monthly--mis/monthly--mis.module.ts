import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthlyMisComponent } from './monthly-mis.component';
import { RouterModule, Routes } from '@angular/router';

  const routes:Routes = [{path:'',component:MonthlyMisComponent}]

@NgModule({
  declarations: [
    MonthlyMisComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MonthlyMisModule { }
