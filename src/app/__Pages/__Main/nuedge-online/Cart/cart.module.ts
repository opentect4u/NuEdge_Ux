import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';
import { RouterModule, Routes } from '@angular/router';


const routes:Routes = [
  {
    path:'',
    component:CartComponent,
    data:{title: "Nuedge Online - Cart", pageTitle: "Nuedge Online - Cart",breadcrumb:'Cart'}
  }
]

@NgModule({
  declarations: [
    CartComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CartModule { }
