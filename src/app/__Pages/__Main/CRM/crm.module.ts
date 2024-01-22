import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmComponent } from './crm.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes = [{
            path:'',
            component:CrmComponent,
            data:{id:1,title:'NuEdge - CRM',pageTitle:'NuEdge - CRM',breadcrumb:'CRM'},
            children:[
              {
                path:'',
                loadChildren:()=> import('./CRM__Dashboard/crm-dashboard.module').then(crm => crm.CRMDashboardModule),

              },
              {
                path:'utility',
                loadChildren:()=> import('./utility/utility.module').then(utility=> utility.UtilityModule),
              }
            ]
}]

@NgModule({
  declarations: [
    CrmComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CrmModule { }
