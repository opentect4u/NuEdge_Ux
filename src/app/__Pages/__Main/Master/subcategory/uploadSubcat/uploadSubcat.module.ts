import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadSubcatComponent } from './uploadSubcat.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
const routes: Routes = [{path:'',component:UploadSubcatComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
     SharedModule
  ],
  declarations: [UploadSubcatComponent]
})
export class UploadSubcatModule { }
