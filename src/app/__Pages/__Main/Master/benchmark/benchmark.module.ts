import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BenchmarkComponent } from './benchmark.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { BenchmarkEntryComponent } from './Dialog/benchmark-entry/benchmark-entry.component';

const routes:Routes = [{path:'',component:BenchmarkComponent,data:{breadcrumb:'Benchmark',title:'Benchmark',pageTitle:'Benchmark'}}]


@NgModule({
  declarations: [
    BenchmarkComponent,
    BenchmarkEntryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class BenchmarkModule { }
