import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeographicRPTComponent } from '../geographic-rpt/geographic-rpt.component';
import { ButtonModule } from 'primeng/button';
const routes: Routes = [{path:'',component:HomeComponent,data:{title:"NuEdge - Geographical Master",pageTitle:'Geographical Master'}}]

@NgModule({
  declarations: [
    HomeComponent,
    GeographicRPTComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ButtonModule,
    RouterModule.forChild(routes)
  ]
})
export class HomeModule { }
