import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadDistrictComponent } from './upload-district.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

 const routes: Routes = [{path:'',component:UploadDistrictComponent}]

@NgModule({
  declarations: [
    UploadDistrictComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class UploadDistrictModule { }
