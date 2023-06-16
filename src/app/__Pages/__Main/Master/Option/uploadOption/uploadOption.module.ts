import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadOptionComponent } from './uploadOption.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes= [{path:'',component:UploadOptionComponent}]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule

  ],
  declarations: [UploadOptionComponent]
})
export class UploadOptionModule { }
