import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadPrdTypeComponent } from './upload-prd-type.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [{path:'',component:UploadPrdTypeComponent}]


@NgModule({
  declarations: [
    UploadPrdTypeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class UploadPrdTypeModule { }
