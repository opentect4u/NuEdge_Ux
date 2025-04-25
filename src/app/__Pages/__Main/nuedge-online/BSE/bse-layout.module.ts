import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BseLayoutComponent } from './bse-layout.component';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:'',
    component:BseLayoutComponent,
    data:{title: "NuEdge Online - BSE", pageTitle: "NuEdge Online - BSE",breadcrumb:'BSE'}
  }
]

@NgModule({
  declarations: [
    BseLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class BseLayoutModule { }
