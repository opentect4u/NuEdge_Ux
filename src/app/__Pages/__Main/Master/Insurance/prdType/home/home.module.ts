import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { PrdTypeCrudComponent } from '../Dialog/prdTypeCrud/prd-type-crud.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrdTypeRPTComponent } from '../Dialog/prd-type-rpt/prd-type-rpt.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{path:'',component:HomeComponent}]

@NgModule({
  declarations: [
    HomeComponent,
    PrdTypeCrudComponent,
    PrdTypeRPTComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class HomeModule { }
