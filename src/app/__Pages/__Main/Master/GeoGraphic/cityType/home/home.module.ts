import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { CityTypeEntryComponent } from '../Dialog/city-type-entry/city-type-entry.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [{path:'',component:HomeComponent}]


@NgModule({
  declarations: [
    HomeComponent,
    CityTypeEntryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class HomeModule { }
