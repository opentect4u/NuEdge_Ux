import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes = [
  {
    path:'',
    component:HomeComponent,
    data:{breadcrumb:'Monthly MIS',pageTitle:'Monthly MIS',title:'Monthly MIS'},
    children:[
      {
        path:'',
        loadChildren:()=> import('./monthly--mis/monthly--mis.module').then(m => m.MonthlyMisModule)
      }
    ]
  }]

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
