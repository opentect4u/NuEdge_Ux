import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailbackComponent } from './mailback.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes = [
  {
    path:'',
    component:MailbackComponent,
    data:{breadcrumb:'Mail Back'},
    children:[
      {
          path:'home',
          loadChildren:()=> import('./mail-back-home/mail-back-home.module').then(m => m.MailBackHomeModule)
      },
      {
          path:'manualupload',
          loadChildren:()=>import('./manual-upload/manual-upload.module').then(m => m.ManualUploadModule)
      },
      {
          path:'filehelp',
          loadChildren:()=>import('./file-help/file-help.module').then(m => m.FileHelpModule)
      },
      {
        path:'',
        redirectTo:'home',
        pathMatch:'full'
      }
    ]
  }
]

@NgModule({
  declarations: [
    MailbackComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MailbackModule { }
