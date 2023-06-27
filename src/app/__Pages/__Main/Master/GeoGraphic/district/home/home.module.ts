import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { DistrictEntryComponent } from '../Dialog/district-entry/district-entry.component';

 const routes: Routes = [{path:'',component:HomeComponent}]

@NgModule({
  declarations: [
    HomeComponent,
    DistrictEntryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class HomeModule { }