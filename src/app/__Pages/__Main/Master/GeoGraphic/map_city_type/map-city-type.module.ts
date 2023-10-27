import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapCityTypeComponent } from './map-city-type.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

 const routes: Routes = [
  {
    path:'',
    component:MapCityTypeComponent,
    data:{breadcrumb:'Map City Type',pageTitle:'Map City Type',title:'Map City Type'}
  }
 ]

@NgModule({
  declarations: [
    MapCityTypeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class MapCityTypeModule { }
