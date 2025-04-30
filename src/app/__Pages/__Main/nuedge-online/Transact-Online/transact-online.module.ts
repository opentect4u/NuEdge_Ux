import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactOnlineComponent } from './transact-online.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes = [
  {
    path:'',
    component:TransactOnlineComponent,
    data:{title: "Nuedge Online - Transact Online", pageTitle: "Nuedge Online - Transact Online",breadcrumb:"Transact Online"}

  }
]

@NgModule({
  declarations: [
    TransactOnlineComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class TransactOnlineModule { }
