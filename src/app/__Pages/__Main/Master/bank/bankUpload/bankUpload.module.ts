import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankUploadComponent } from './bankUpload.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
const routes: Routes = [{path:'',component:BankUploadComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
     SharedModule
  ],
  declarations: [BankUploadComponent]
})
export class BankUploadModule { }
