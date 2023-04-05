import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company.component';
import { RouterModule, Routes } from '@angular/router';
import { RptComponent } from './Dialog/rpt/rpt.component';
import { CrudComponent } from './Dialog/crud/crud.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [{path:'',component:CompanyComponent}]

@NgModule({
  declarations: [
    CompanyComponent,
    RptComponent,
    CrudComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  SharedModule
  ]
})
export class CompanyModule { }
