import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenewalmainComponent } from './renewalmain.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes= [
    {
      path:'',
      component:RenewalmainComponent,
      data:{breadcrumb:'Renewal Buisness opportunity'},
      children:[
        {
          path:'',
          loadChildren:()=> import('./renwal-dashboard/renwal-dashboard.module').then(m => m.RenwalDashboardModule)
        }
      ]
    }
 ]

@NgModule({
  declarations: [
    RenewalmainComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class RenewalmainModule { }
