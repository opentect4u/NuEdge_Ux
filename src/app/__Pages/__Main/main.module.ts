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
        data: { id: 3, title: "NuEdge - Home", pageTitle: "", has_menubar: 'N' }
      },
      {
        path:'mst',
        loadChildren:()=> import('./Master/home/home.module').then(m => m.HomeModule),
        data:{id:13,title: "NuEdge - Master Dashboard",pageTitle:"",has_menubar:'N'}
      },
      {
        path: 'clientmaster',
        loadChildren: () => import('../__Main/Master/client_manage/client_manage.module').then(m => m.Client_manageModule),
        data: { id: 4, title: "NuEdge - Client Master", pageTitle: "Client Master", has_menubar: 'Y' }
      },
      {
        path: 'rntmaster',
        loadChildren: () => import('../__Main/Master/RNT/RNT.module').then(m => m.RNTModule),
        data: { id: 5, title: "NuEdge - R&T Master", pageTitle: "R&T Master", has_menubar: 'Y' }
      },
      {
        path: 'amcmaster',
        loadChildren: () => import('../__Main/Master/AMC/AMC.module').then(m => m.AMCModule),
        data: { id: 7, title: "NuEdge - AMC Master", pageTitle: "AMC Master", has_menubar: 'Y' }
      },
      {
        path: 'category',
        loadChildren: () => import('../__Main/Master/category/category.module').then(m => m.CategoryModule),
        data: { id: 8, title: "NuEdge - Category Master", pageTitle: "Category Master", has_menubar: 'Y' }
      },
      {
        path: 'subcategory',
        loadChildren: () => import('../__Main/Master/subcategory/subcategory.module').then(m => m.SubcategoryModule),
        data: { id: 9, title: "NuEdge - Sub-Category Master", pageTitle: "Sub-Category Master", has_menubar: 'Y' }
      },
      {
        path: 'bank',
        loadChildren: () => import('../__Main/Master/bank/bank.module').then(m => m.BankModule),
        data: { id: 14, title: "NuEdge - Bank  Master", pageTitle: "Bank Master", has_menubar: 'Y' }
      },
      {
        path: 'scheme',
        loadChildren: () => import('../__Main/Master/scheme/scheme.module').then(m => m.SchemeModule),
        data: { id: 15, title: "NuEdge - Scheme  Master", pageTitle: "Scheme Master", has_menubar: 'Y' }
      },
      {
        path: 'docsType',
        loadChildren: () => import('../__Main/Master/docsMaster/docsMaster.module').then(m => m.DocsMasterModule),
        data: { id: 17, title: "NuEdge - Document Type", pageTitle: "Document Type", has_menubar: 'Y' }
      },
      {
        path: 'docs',
        loadChildren: () => import('../__Main/Master/document/document.module').then(m => m.DocumentModule),
        data: { id: 18, title: "NuEdge - Document Master", pageTitle: "Document Master" }
      },
      {
        path: 'rcvForm',
        loadChildren: () => import('../__Main/Operations/RcvFrm/RcvFrm.module').then(m => m.RcvFrmModule),
        data: { id: 19, title: "NuEdge - Operation Recieve Form", pageTitle: "Recieve Form" }
      },
      {
        path: 'ophome',
        loadChildren: () => import('../__Main/Operations/operationHome/operationHome.module').then(m => m.OperationHomeModule),
        data: { id: 20, title: "NuEdge - Operation Dashboard", pageTitle: "Operation Dashboard" }
      },
      {
        path: 'kyc',
        loadChildren: () => import('./Kyc/kyc.module').then(m => m.KycModule),
        data: { id: 21, title: "NuEdge - Kyc", pageTitle: "Kyc", has_menubar: 'Y' }
      },
      {
        path: 'mftrax',
        loadChildren: () => import('./Operations/Mutual_Fund/mfTrax.module').then(m => m.MfTraxModule),
        data: { id: 22, title: "NuEdge - MF Trax", pageTitle: "MF Trax", has_member: 'Y' }
      },
      {
         path:'reports',
         loadChildren:()=> import('./Operations/reports/reports.module').then(m => m.ReportsModule),
         data:{id:26,title: "NuEdge - Reports", pageTitle: "Reports", has_member: 'Y'}
      },
      {
         path:'mstOperations',
         loadChildren:()=> import('./Dashboards/mstOpDashboard/mstOpDashboard.module').then(m => m.MstOpDashboardModule),
         data:{id:28,title: "NuEdge - Master Operations Dasboard", pageTitle: "", has_member: 'Y'}
      },
      {
         path:'clntMstHome',
         loadChildren:()=> import('./Dashboards/clntMstDashboard/clntMstDashboard.module').then(m => m.ClntMstDashboardModule),
         data:{id:29,title: "NuEdge - Client Master Dasboard", pageTitle: "", has_member: 'Y'}
      },
      {
        path:'mfdashboard',
        loadChildren:()=> import('./Dashboards/MFDashboard/MFDashboard.module').then(m => m.MFDashboardModule),
        data:{id:30,title: "NuEdge - Mutual Fund Dashboard", pageTitle: "", has_member: 'Y'}
      },
      {
        path:'manualentrdashboard',
        loadChildren:()=> import('./Dashboards/manualEntrDashboard/manualEntrDashboard.module').then(m => m.ManualEntrDashboardModule),
        data:{id:31,title: "NuEdge - Manual Entry Dashboard", pageTitle: "", has_member: 'Y'}
      },
      {
        path:'MfTraxDashboard',
        loadChildren:()=> import('./Dashboards/MfTraxDashboard/MfTraxDashboard.module').then(m => m.MfTraxDashboardModule),
        data:{id:32,title: "NuEdge - MF Trax Dashboard", pageTitle: "", has_member: 'Y'}
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
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
