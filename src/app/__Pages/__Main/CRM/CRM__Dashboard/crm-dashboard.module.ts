import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CRMDashboardComponent } from './crm-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
// import { CoreModule } from '../../Products/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';

 const routes:Routes = [
  {
    path:'',
    component:CRMDashboardComponent,
  }
 ]

@NgModule({
  declarations: [
    CRMDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class CRMDashboardModule { }
