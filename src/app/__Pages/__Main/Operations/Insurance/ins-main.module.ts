import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsMainComponent } from './ins-main.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    component:InsMainComponent,
    data:{breadcrumb:'Insurance'},
    children:[
      {
        path:'',
        loadChildren:()=> import('./insurance-dashboard/insurance-dashboard.module').then(m => m.InsuranceDashboardModule)
      },
      {
        path:'rcvForm',
        loadChildren:()=> import('./RcvForm/rcv-form.module').then(m => m.RcvFormModule)
      },
      {
        path:'trax',
        loadChildren:()=> import('./ManualEntry/Main/main.module').then(m => m.MainModule)
      },
      {
        path:'ack',
        loadChildren:()=> import('./Acknowledgement/ack-home.module').then(m => m.AckHomeModule)
      },
      {
        path:'manualupdate',
        loadChildren:()=> import('./Manual_Update/manual-update.module').then(m => m.ManualUpdateModule)
      }
    ]
  }
]

@NgModule({
  declarations: [
    InsMainComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class InsMainModule { }
