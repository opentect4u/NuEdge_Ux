import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ScmBenchMarkRptComponent } from './scm-bench-mark-rpt.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { LazyLoadPipe } from 'src/app/__Pipes/lazy-load.pipe';

 const routes:Routes = [{path:'',component:ScmBenchMarkRptComponent,data:{breadcrumb:'Scheme Benchmark Report',title:'Scheme Benchmark Report',pageTitle:'Scheme Benchmark Report'}}]

@NgModule({
  declarations: [
    ScmBenchMarkRptComponent,
    LazyLoadPipe
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  providers:[DatePipe]
})
export class ScmBnchMarkRptModule { }
