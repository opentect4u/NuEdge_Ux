import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadScmComponent } from './uploadScm.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [{ path: '', component: UploadScmComponent }]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [UploadScmComponent]
})
export class UploadScmModule { }
