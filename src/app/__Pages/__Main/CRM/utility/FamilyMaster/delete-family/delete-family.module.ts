import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteFamilyComponent } from './delete-family.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

 const routes:Routes = [{path:'',component:DeleteFamilyComponent, data:{id:1,breadcrumb:'Delete Family',pageTitle:'Delete Family',title:'Delete Family'}}]

@NgModule({
  declarations: [
    DeleteFamilyComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class DeleteFamilyModule { }
