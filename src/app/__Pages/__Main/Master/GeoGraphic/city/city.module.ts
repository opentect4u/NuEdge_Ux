import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CityComponent } from './city.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [{
  path:'',
  component:CityComponent,
  data:{breadcrumb:'City'},

  children:[
    {
      path:'home',
      loadChildren:()=> import('./home/home.module').then(home => home.HomeModule)
    },
    {
      path:'uploadcity',
      loadChildren:()=> import('./uploadCsv/upload-csv.module').then(uploadCSV => uploadCSV.UploadCsvModule),
      data:{breadcrumb:'Upload City'},
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
    CityComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class CityModule { }
