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
const routes: Routes = [
  {
    path: '',
    component: MainComponent,
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
      }
       ,
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
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      // {
      //   path: 'docs',
      //   loadChildren: () => import('../__Main/Master/document/document.module').then(m => m.DocumentModule),
      //   data: { id: 18, title: "NuEdge - Document Master", pageTitle: "Document Master" }
      // },
      {
        path: 'rcvForm',
        loadChildren: () => import('../__Main/Operations/RcvFrm/RcvFrm.module').then(m => m.RcvFrmModule),
        data: { id: 19, title: "NuEdge - Operation Recieve Form", pageTitle: "Recieve Form" }
      },
    //  {
    //     path: 'mftrax',
    //     loadChildren: () => import('./Operations/Mutual_Fund/mfTrax.module').then(m => m.MfTraxModule),
    //     data: { id: 22, title: "NuEdge - MF Trax", pageTitle: "MF Trax", has_member: 'Y' }
    //   },
   
     
      // {
      //    path:'reports',
      //    loadChildren:()=> import('./Operations/reports/reports.module').then(m => m.ReportsModule),
      //    data:{id:26,title: "NuEdge - Reports", pageTitle: "Reports", has_member: 'Y'}
      // },
      // {
      //    path:'mstOperations',
      //    loadChildren:()=> import('./Dashboards/mstOpDashboard/mstOpDashboard.module').then(m => m.MstOpDashboardModule),
      //    data:{id:28,title: "NuEdge - Master Operations Dasboard", pageTitle: "", has_member: 'Y'}
      // },
      // {
      //    path:'clntMstHome',
      //    loadChildren:()=> import('./Dashboards/clntMstDashboard/clntMstDashboard.module').then(m => m.ClntMstDashboardModule),
      //    data:{id:29,title: "NuEdge - Client Master Dasboard", pageTitle: "", has_member: 'Y'}
      // },
      // {
      //   path:'manualEntr',
      //   loadChildren:()=> import('./Dashboards/manualEntrDashboard/manualEntrDashboard.module').then(m => m.ManualEntrDashboardModule),
      //   data:{id:31,title: "NuEdge - Manual Entry Dashboard", pageTitle: "", has_member: 'Y'}
      // },
      // {
      //   path:'MfTraxDashboard',
      //   loadChildren:()=> import('./Dashboards/MfTraxDashboard/MfTraxDashboard.module').then(m => m.MfTraxDashboardModule),
      //   data:{id:32,title: "NuEdge - MF Trax Dashboard", pageTitle: "", has_member: 'Y'}
      // },
     
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
    MenuDropdownDirective,
  ],
})
export class MainModule {
  constructor() {
    console.log('Main Module Loaded');
  }
}
