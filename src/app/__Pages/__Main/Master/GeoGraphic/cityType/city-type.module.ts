import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CityTypeComponent } from './city-type.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path:'',
  component:CityTypeComponent,
  data:{breadcrumb:'City Type'},
  children:[
    {
      path:'home',
      loadChildren:() => import('./home/home.module').then(home => home.HomeModule)
    },
    {
      path:'uploadcityType',
      loadChildren:() => import('./uploadCsv/upload-csv.module').then(upload => upload.UploadCsvModule),
      data:{breadcrumb:'Upload City Type'},

    },
    {
      path:'',
      redirectTo:'home',
      pathMatch:'full'
    }
  ]
}]

@NgModule({
  declarations: [
    CityTypeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class CityTypeModule { }
