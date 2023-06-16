import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadISINComponent } from './upload-isin.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
const routes: Routes = [{path:'',component:UploadISINComponent}]

@NgModule({
  declarations: [
    UploadISINComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class UploadISINModule { }
