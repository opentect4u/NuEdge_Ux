import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmpMstComponent } from './cmp-mst.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes = [{
  path:'',
  component:CmpMstComponent,
  children:[
    {
      path:'',
      loadChildren:()=> import('./home/home.module').then(m => m.HomeModule)
    },
      {
        path:'uploadcompany',
        loadChildren:()=> import('./upload-cmp/upload-cmp.module').then(m => m.UploadCmpModule),
        data:{breadcrumb:'Upload Company'}
      },

  ]
}]

@NgModule({
  declarations: [
    CmpMstComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CmpMstModule { }
