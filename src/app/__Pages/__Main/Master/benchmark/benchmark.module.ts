import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BenchmarkComponent } from './benchmark.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { BenchmarkEntryComponent } from './Dialog/benchmark-entry/benchmark-entry.component';
import { BenchmarkReportComponent } from './Dialog/benchmark-report/benchmark-report.component';

const routes:Routes = [
  {
  path:'',
  component:BenchmarkComponent,
  data:{breadcrumb:'Benchmark',title:'Benchmark',pageTitle:'Benchmark'},
  children:[
    {
      path:'',
      loadChildren:() => import('./home/home.module').then(m => m.HomeModule)
    },
    {
      path:'upload',
      loadChildren:()=> import('./upload-benchmark/upload-benchmark.module').then(m => m.UploadBenchmarkModule),
      data:{breadcrumb:'Upload Benchmark',title:'Upload Benchmark',pageTitle:'Upload Benchmark'}
    }
  ]
 }
]


@NgModule({
  declarations: [
    BenchmarkComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class BenchmarkModule { }
