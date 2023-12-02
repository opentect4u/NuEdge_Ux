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
        loadChildren:() => import('./monthlyMisMenus/monthly-mis-menus.module').then(m => m.MonthlyMisMenusModule)
      },
      {
        path:'report',
        loadChildren:()=> import('./monthly--mis/monthly--mis.module').then(m => m.MonthlyMisModule),
        data:{breadcrumb:'Monthly MIS Report',pageTitle:'Monthly MIS Report',title:'Monthly MIS Report'},
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
