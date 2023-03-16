import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsMainComponent } from './ins-main.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    component:InsMainComponent,
    children:[
      {
        path:'',
        loadChildren:()=> import('./insurance-dashboard/insurance-dashboard.module').then(m => m.InsuranceDashboardModule)
      },
      {
        path:'rcvForm',
        loadChildren:()=> import('./RcvForm/rcv-form.module').then(m => m.RcvFormModule)
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
