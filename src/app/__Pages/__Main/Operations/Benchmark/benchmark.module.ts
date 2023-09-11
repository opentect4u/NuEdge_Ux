import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BenchmarkComponent } from './benchmark.component';
import { RouterModule, Routes } from '@angular/router';
 const routes:Routes = [
   {
    path:'',
    component:BenchmarkComponent,
    data:{breadcrumb:'Scheme Benchmark',title:'Scheme Benchmark',pageTitle:'Scheme Benchmark'},
    children:[
      {
        path:'',
        loadChildren:()=>import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path:'uploadSchemeBenchmark',
        loadChildren:()=> import('./upload-scheme-benchmark/upload-scheme-benchmark.module').then(m => m.UploadSchemeBenchmarkModule),
        data:{breadcrumb:'Upload Scheme Benchmark',title:'Upload Scheme Benchmark',pageTitle:'Upload Scheme Benchmark'}
      }
    ]
   }
 ]

@NgModule({
  declarations: [
    BenchmarkComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

  ]
})
export class BenchmarkModule { }
