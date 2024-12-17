import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerServiceAttachmentDownloadComponent } from './customer-service-attachment-download.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes = [
  {
    path:'',
    component:CustomerServiceAttachmentDownloadComponent
  }
]

@NgModule({
  declarations: [
    CustomerServiceAttachmentDownloadComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CustomerServiceAttachmentDownloadModule { }
