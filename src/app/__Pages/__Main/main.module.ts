import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './common/header/header.component';
import { MenuDropdownDirective } from 'src/app/__Directives/menuDropdown.directive';
import { ListComponent } from './common/list/list.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrmbsComponent } from './common/brdCrmbs/breadCrmbs.component';
const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data:{breadcrumb:'Home'},
    children: [
      {
        path: 'home',
        loadChildren: () => import('../__Main/home/home.module').then(m => m.HomeModule),
        data: { id: 3, title: "NuEdge - Home", pageTitle: "", has_menubar: 'Y' }

      },
      {
        path:'master',
        loadChildren:()=> import('./Master/MainMst.module').then(m => m.MainMstModule),
        data:{id:4,title:"NuEdge - Master",pageTitle:"",has_menubar:"Y"}
      },
      {
        path:'operations',
        loadChildren:()=> import('./Operations/MainOp.module').then(m => m.MainOpModule),
        data:{id:5,title: "NuEdge - Operation Dashboard", pageTitle: "Operation Dashboard" }
      }   ,{
        path: 'kyc',
        loadChildren: () => import('./Kyc/kyc.module').then(m => m.KycModule),
        data: { id: 6, title: "NuEdge - Kyc", pageTitle: "Kyc", has_menubar: 'Y' }
      },
      {
        path: 'rcvForm',
        loadChildren: () => import('../__Main/Operations/RcvFrm/RcvFrm.module').then(m => m.RcvFrmModule),
        data: { id: 19, title: "NuEdge - Operation Recieve Form", pageTitle: "Recieve Form" }
      },
      {
        path:'rcvFormmodification',
        loadChildren:()=> import('../__Main/Operations/RcvFrm/rcvFormModification/rcvFormModification.module').then(m => m.RcvFormModificationModule),
        data:{id:52,title:"NuEdge - Operation Form Recievable", pageTitle:"Recievable Form"}
      },
      {
        path:'rcvDashboard',
        loadChildren:()=> import('../__Main/Operations/RcvFrm/rcvDashboard/rcvDashboard.module').then(m => m.RcvDashboardModule),
        data:{id:53,title:"NuEdge - Operation Form Recievable Dashboard", pageTitle:"Recievable Form dashboard"}
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },

    ]
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatMenuModule,
    MatButtonModule,
    MatIconModule
  ],
  declarations: [
    MainComponent,
    HeaderComponent,
    ListComponent,
    BreadcrmbsComponent,
    MenuDropdownDirective,
  ],
})
export class MainModule {
  constructor() {
    console.log('Main Module Loaded');
  }
}
