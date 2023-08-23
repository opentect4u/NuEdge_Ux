import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BenchmarkComponent } from './benchmark.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { BenchmarkEntryForReportComponent } from './benchmark-entry-for-report/benchmark-entry-for-report.component';

 const routes:Routes = [
   {
    path:'',
    component:BenchmarkComponent,
    data:{breadcrumb:'Benchmark',title:'Benchmark',pageTitle:'Benchmark'}
   }
 ]

@NgModule({
  declarations: [
    BenchmarkComponent,
    BenchmarkEntryForReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class BenchmarkModule { }
