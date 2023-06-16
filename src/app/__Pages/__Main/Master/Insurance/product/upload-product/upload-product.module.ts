import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadProductComponent } from './upload-product.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';


const routes: Routes= [{path:'',component:UploadProductComponent}]

@NgModule({
  declarations: [
    UploadProductComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class UploadProductModule { }
