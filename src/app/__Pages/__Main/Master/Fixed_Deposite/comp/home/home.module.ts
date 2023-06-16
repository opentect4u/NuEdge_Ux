import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { RptComponent } from '../Dialog/rpt/rpt.component';
import { CrudComponent } from '../Dialog/crud/crud.component';

const routes: Routes = [{
  path:'',
  component:HomeComponent
}]

@NgModule({
declarations: [
  HomeComponent,
  RptComponent,
  CrudComponent
],
imports: [
  CommonModule,
  SharedModule,
  RouterModule.forChild(routes)
]
})
export class HomeModule { }
