import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FamilyListComponent } from './family-list.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

  const routes: Routes = [{
    path:'',
    component:FamilyListComponent,
    data:{id:1,breadcrumb:'Family List',pageTitle:'Family List',title:'Family List'},
  }]

@NgModule({
  declarations: [
    FamilyListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class FamilyListModule { }
