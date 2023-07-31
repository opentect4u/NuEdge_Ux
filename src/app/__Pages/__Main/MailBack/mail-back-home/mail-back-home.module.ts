import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailbackhomeComponent } from './mailbackhome.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

 const routes:  Routes = [{path:'',
 component:MailbackhomeComponent,
 data:{title:' MailBack',pageTitle:'MailBack'}
}]

@NgModule({
  declarations: [
    MailbackhomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class MailBackHomeModule { }
