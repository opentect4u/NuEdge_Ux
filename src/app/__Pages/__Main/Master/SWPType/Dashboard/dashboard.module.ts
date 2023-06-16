import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { RptComponent } from './rpt/rpt.component';
import { ManualEntryComponent } from './manual-entry/manual-entry.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [{path:'',component:DashboardComponent}]

@NgModule({
  declarations: [
    DashboardComponent,
    RptComponent,
    ManualEntryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class DashboardModule { }
