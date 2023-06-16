import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { RptComponent } from '../dialog/rpt/rpt.component';
import { ComptypeCrudComponent } from '../dialog/comptype-crud/comptype-crud.component';

 const routes: Routes = [{
    path:'',
    component:HomeComponent
 }]

@NgModule({
  declarations: [
    HomeComponent,
    RptComponent,
    ComptypeCrudComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class HomeModule { }
