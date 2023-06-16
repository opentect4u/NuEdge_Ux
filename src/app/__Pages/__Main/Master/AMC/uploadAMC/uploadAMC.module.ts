import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadAMCComponent } from './uploadAMC.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';


const routes: Routes= [{path:'',component:UploadAMCComponent}]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [UploadAMCComponent]
})
export class UploadAMCModule { }
