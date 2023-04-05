import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchemeComponent } from './scheme.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScmCrudComponent } from './Dialog/scm-crud/scm-crud.component';
import { ScmRptComponent } from './Dialog/scm-rpt/scm-rpt.component';

const routes: Routes = [{path:'',component:SchemeComponent}]

@NgModule({
  declarations: [
    SchemeComponent,
    ScmCrudComponent,
    ScmRptComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class SchemeModule { }
