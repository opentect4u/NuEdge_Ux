import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualEntrDashboardComponent } from './manualEntrDashboard.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes=[{path:'',component:ManualEntrDashboardComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ManualEntrDashboardComponent]
})
export class ManualEntrDashboardModule {

   constructor() {
    console.log('Menual Entry Dashboard Module Loaded');
   }
   
 }
