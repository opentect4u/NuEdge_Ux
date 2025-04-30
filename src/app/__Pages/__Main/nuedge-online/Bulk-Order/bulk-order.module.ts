import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulkOrderComponent } from './bulk-order.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes = [
  {
    path:'',
    component:BulkOrderComponent,
    data:{title: "Nuedge Online - Bulk Order", pageTitle: "Nuedge Online - Bulk Order",breadcrumb:'Bulk Order'}
  }
]

@NgModule({
  declarations: [
    BulkOrderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class BulkOrderModule { }
