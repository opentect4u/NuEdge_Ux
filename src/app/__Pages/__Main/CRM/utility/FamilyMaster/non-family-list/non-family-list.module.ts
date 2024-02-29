import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonFamilyListComponent } from './non-family-list.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes:Routes = [{
  path:'',
  component:NonFamilyListComponent,
  data:{id:1,breadcrumb:'Non Family List',pageTitle:'NuEdge - Update Family',title:'NuEdge - Update Family'},
}]

@NgModule({
  declarations: [
    NonFamilyListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class NonFamilyListModule { }
