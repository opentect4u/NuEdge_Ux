import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadCsvComponent } from './upload-csv.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

 const routes: Routes = [{path:'',component:UploadCsvComponent,data:{title:'FD - Upload Scheme',pageTitle:'Fd - Upload Scheme'}}]

@NgModule({
  declarations: [
    UploadCsvComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class UploadCsvModule { }
