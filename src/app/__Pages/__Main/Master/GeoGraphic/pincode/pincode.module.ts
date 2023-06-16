import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PincodeComponent } from './pincode.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [{
  path:'',
  component:PincodeComponent,
  data:{breadcrumb:'Pincode'},

  children:[
    {
      path:'home',
      loadChildren:()=> import('./home/home.module').then(home => home.HomeModule)
    },
    {
      path:'uploadpincode',
      loadChildren:()=> import('./uploadCsv/upload-csv.module').then(upload => upload.UploadCsvModule),
      data:{breadcrumb:'Upload Pincode'},

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
    PincodeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class PincodeModule { }
