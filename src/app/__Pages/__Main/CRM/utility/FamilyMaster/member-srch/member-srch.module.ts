import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberSrchComponent } from './member-srch.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

 const routes:Routes = [
   {
      path:'',
      component:MemberSrchComponent,
      data:{id:1,breadcrumb:'Member Search',pageTitle:'Member Search',title:'Member Search'}
   }
]

@NgModule({
  declarations: [
    MemberSrchComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class MemberSrchModule { }
