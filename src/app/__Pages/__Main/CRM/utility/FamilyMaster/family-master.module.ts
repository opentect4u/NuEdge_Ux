import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FamilyMasterComponent } from './family-master.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes =[{
        path:'',
        component:FamilyMasterComponent,
        data:{id:1,breadcrumb:'Family Master',pageTitle:'NuEdge - Family Master',title:'NuEdge - Family Master'},
        children:[
          {
            path:'',
            loadChildren:()=> import('./home/home.module').then(family_master => family_master.HomeModule)
          },
          {
            path:'create',
            loadChildren:()=> import('./createFamily/create-family.module').then(family_create => family_create.CreateFamilyModule)
          },
          {
             path:'list',
             loadChildren:()=> import('./FamilyList/family-list.module').then(family_list => family_list.FamilyListModule),
          },
          {
            path:'deleteFamily',
            loadChildren:() => import('./delete-family/delete-family.module').then(m => m.DeleteFamilyModule)
          },
          {
            path:'updateFamily',
            loadChildren:()=> import('./update-family/update-family.module').then(updateFamily => updateFamily.UpdateFamilyModule)
          }
        ]
    }]

@NgModule({
  declarations: [
    FamilyMasterComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class FamilyMasterModule { }
