import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeoGraphicComponent } from './geo-graphic.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [{
  path:'',
  component:GeoGraphicComponent,
  data:{breadcrumb:'Geographical Master'},
  children:[
    {
      path:'',
      loadChildren:()=> import('./Home/home.module').then(home => home.HomeModule)
    },
    {
      path:'country',
      loadChildren:()=> import('./country/country.module').then(country => country.CountryModule)
    },
    {
      path:'state',
      loadChildren:()=> import('./state/state.module').then(state => state.StateModule)
    },
    {
      path:'district',
      loadChildren:()=> import('./district/district.module').then(district => district.DistrictModule)
    },
    {
      path:'city',
      loadChildren:()=> import('./city/city.module').then(city => city.CityModule)
    },
    {
      path:'pincode',
      loadChildren:()=> import('./pincode/pincode.module').then(pincode => pincode.PincodeModule)
    },
    {
      path:'cityType',
      loadChildren:() => import('./cityType/city-type.module').then(cityType => cityType.CityTypeModule)
    }

  ]
}]

@NgModule({
  declarations: [
    GeoGraphicComponent  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class GeoGraphicModule { }
