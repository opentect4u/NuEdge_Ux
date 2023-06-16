import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistrictComponent } from './district.component';
import { RouterModule, Routes } from '@angular/router';
 const routes: Routes = [
  {
  path:'',
  component:DistrictComponent,
  data:{breadcrumb:'District'},

  children:[
    {
      path:'home',
      loadChildren:()=> import('./home/home.module').then(home => home.HomeModule)
    },
    {
      path:'uploaddistrict',
      loadChildren:()=> import('./uploadCsv/upload-district.module').then(upload => upload.UploadDistrictModule),
      data:{breadcrumb:'Upload District'},
    },
    {
      path:'',
      pathMatch:'full',
      redirectTo:'home'

    }
  ]
}]

@NgModule({
  declarations: [
    DistrictComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class DistrictModule { }
