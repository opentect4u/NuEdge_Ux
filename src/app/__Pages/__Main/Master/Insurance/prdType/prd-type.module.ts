import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrdTypeComponent } from './prd-type.component';
import { RouterModule, Routes } from '@angular/router';
import { PrdTypeCrudComponent } from './Dialog/prdTypeCrud/prd-type-crud.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrdTypeRPTComponent } from './Dialog/prd-type-rpt/prd-type-rpt.component';

const routes: Routes = [{path:'',component:PrdTypeComponent}]

@NgModule({
  declarations: [
    PrdTypeComponent,
    PrdTypeCrudComponent,
    PrdTypeRPTComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class PrdTypeModule { }
