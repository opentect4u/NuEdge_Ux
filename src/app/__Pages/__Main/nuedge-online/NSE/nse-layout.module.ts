import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NseLayoutComponent } from './nse-layout.component';

export const routes: Routes = [
  {
    path:'',
    component:NseLayoutComponent,
    data:{title: "NuEdge Online - NSE", pageTitle: "NuEdge Online - NSE",breadcrumb:'NSE'}
  }
]

@NgModule({
  declarations: [
    NseLayoutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class NseLayoutModule { }
