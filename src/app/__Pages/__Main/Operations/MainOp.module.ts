import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainOpComponent } from './MainOp.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes= [{
  path:'',component:MainOpComponent,
  children:[
      {
        path: 'ophome',
        loadChildren: () => import('./operationHome/operationHome.module').then(m => m.OperationHomeModule),
        data: {parentId:5,id:1, title: "NuEdge - Operation Dashboard", pageTitle: "Operation Dashboard" }
      },
       {
        path:'mfdashboard/:id',
        loadChildren:()=> import('./MFDashboard/MFDashboard.module').then(m => m.MFDashboardModule),
        data:{parentId:5,id:2,title: "NuEdge - Mutual Fund Dashboard", pageTitle: "", has_member: 'Y'}
      },
        {
        path:'manualEntr',
        loadChildren:()=> import('./manualEntrDashboard/manualEntrDashboard.module').then(m => m.ManualEntrDashboardModule),
        data:{id:3,title: "NuEdge - Manual Entry Dashboard", pageTitle: "", has_member: 'Y'}
      },
        {
        path:'MfTrax',
        loadChildren:()=> import('./MfTraxDashboard/MfTraxDashboard.module').then(m => m.MfTraxDashboardModule),
        data:{id:4,title: "NuEdge - MF Trax Dashboard", pageTitle: "", has_member: 'Y'}
      },
      {
       path:'mfTraxEntry',
       loadChildren:()=> import('./Mutual_Fund/mfTrax.module').then(m => m.MfTraxModule),
       data:{id:5,title:"",pageTitle:"",has_menu:"Y"}
      },
      {
        path:'',
        redirectTo:'ophome',
        pathMatch:'full'
      }
  ]
}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MainOpComponent]
})
export class MainOpModule { }
