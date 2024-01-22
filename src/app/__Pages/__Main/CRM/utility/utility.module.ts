import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityComponent } from './utility.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes = [{
            path:'',
            component:UtilityComponent,
            data:{id:1,title:'NuEdge - Utility',pageTitle:'NuEdge - Utility',breadcrumb:'Utility'},
            children:[
              {
                path:'',
                loadChildren:()=> import('./home/home.module').then(utility => utility.HomeModule),
              },
              {
                path:'family',
                loadChildren:()=> import('./FamilyMaster/family-master.module').then(family_master => family_master.FamilyMasterModule),
              }
            ]
  }]

@NgModule({
  declarations: [
    UtilityComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class UtilityModule { }
