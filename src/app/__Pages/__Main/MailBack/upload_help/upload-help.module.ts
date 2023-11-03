import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadHelpComponent } from './upload-help.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [{
  path:'',
  component:UploadHelpComponent,
  data:{breadcrumb:'File Upload Help',pageTitle:'File Upload Help',Title:'File Upload Help'}
}]

@NgModule({
  declarations: [
    UploadHelpComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class UploadHelpModule { }
