import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadCmpComponent } from './upload-cmp.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [{path:'',component:UploadCmpComponent}]

@NgModule({
  declarations: [
    UploadCmpComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class UploadCmpModule { }
