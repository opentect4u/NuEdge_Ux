import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { ScmCrudComponent } from '../Dialog/scm-crud/scm-crud.component';
import { ScmRptComponent } from '../Dialog/scm-rpt/scm-rpt.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [{path:'',component:HomeComponent,data:{title:'FD - Scheme',pageTitle:'Fd - Scheme'}}]

@NgModule({
  declarations: [
    HomeComponent,
    ScmCrudComponent,
    ScmRptComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class HomeModule { }
