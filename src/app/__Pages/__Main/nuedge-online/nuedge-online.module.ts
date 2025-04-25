import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NuedgeOnlineLayoutComponent } from './nuedge-online-layout.component';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:'',
    component:NuedgeOnlineLayoutComponent,
    data:{breadcrumb:'Nuedge Online'},
    children:[
      {
        path:'',
        loadChildren:() => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path:'nse',
        loadChildren:() => import('./NSE/nse-layout.module').then(m => m.NseLayoutModule)
      },
      {
        path:'bse',
        loadChildren:() => import('./BSE/bse-layout.module').then(m => m.BseLayoutModule)
      }
    ]
  }
]

@NgModule({
  declarations: [
    NuedgeOnlineLayoutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class NuedgeOnlineModule { }
