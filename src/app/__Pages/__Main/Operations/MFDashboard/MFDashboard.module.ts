import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MFDashboardComponent } from './MFDashboard.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [{ path: '', component: MFDashboardComponent }]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MFDashboardComponent]
})
export class MFDashboardModule {
  constructor() {
    console.log('MF Dashboard Module Loaded');
  }
}
