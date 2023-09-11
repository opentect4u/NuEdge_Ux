import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { BenchmarkEntryForReportComponent } from '../benchmark-entry-for-report/benchmark-entry-for-report.component';
import { SharedModule } from 'src/app/shared/shared.module';

 const routes:Routes = [{
   path:'',
   component:HomeComponent
 }]

@NgModule({
  declarations: [
    HomeComponent,
    BenchmarkEntryForReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class HomeModule { }
