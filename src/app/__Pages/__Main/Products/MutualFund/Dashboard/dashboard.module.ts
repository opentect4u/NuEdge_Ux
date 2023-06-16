import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from '../../core/core.module';

const routes: Routes = [{path:'',component:DashboardComponent}]

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreModule
  ]
})
export class DashboardModule {

  /**
   *
   */
  constructor() {
    console.log('dashboard page Loaded');
  }


}
