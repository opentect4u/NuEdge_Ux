import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CityEntryComponent } from '../Dialog/city-entry/city-entry.component';

const routes: Routes = [{path:'',component:HomeComponent}]


@NgModule({
  declarations: [
    HomeComponent,
    CityEntryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class HomeModule { }
