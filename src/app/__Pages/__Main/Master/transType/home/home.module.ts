import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes =[
  {
    path:'',
    component:HomeComponent,
    data: {breadcrumb: 'Transaction Type'},
    children:[
      {
        path:'',
        loadChildren:() => import('../transType.module').then(m => m.TransTypeModule),
      }
    ]
  }
 ]

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class HomeModule { }
