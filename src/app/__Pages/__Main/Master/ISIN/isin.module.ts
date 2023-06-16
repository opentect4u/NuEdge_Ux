import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsinComponent } from './isin.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [
  {

  path:'',
  component:IsinComponent,
  children:[
    {
      path:'',
      loadChildren:()=> import('./home/home.module').then(m => m.HomeModule)
    },
    {
      path:'uploadIsin',
      loadChildren:()=> import('./uploadISIN/upload-isin.module').then(m => m.UploadISINModule),
      data:{
        breadcrumb: 'Upload ISIN',
        parentId: 4,
        id: 32,
        title: 'NuEdge - Upload ISIN',
        pageTitle: 'ISIN Upload',
        has_menubar: 'Y',
      }

    }
  ]
}]

@NgModule({
  declarations: [
    IsinComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class IsinModule { }
