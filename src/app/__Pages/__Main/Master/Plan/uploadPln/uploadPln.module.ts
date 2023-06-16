import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadPlnComponent } from './uploadPln.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';


const routes: Routes= [{path:'',component:UploadPlnComponent}]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [UploadPlnComponent]
})
export class UploadPlnModule { }
