import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatUploadComponent } from './catUpload.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [{path:'',component:CatUploadComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule

  ],
  declarations: [CatUploadComponent]
})
export class CatUploadModule { }
