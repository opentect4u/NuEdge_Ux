import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrdTypeComponent } from './prd-type.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path:'',
    component:PrdTypeComponent,
    children:[
      {
        path:'',
        loadChildren:()=> import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path:'uploadproducttype',
        loadChildren:()=> import('./upload-prd-type/upload-prd-type.module').then(m => m.UploadPrdTypeModule),
        data:{breadcrumb:'Upload Product Type'}
      },
    ]
  }]

@NgModule({
  declarations: [
    PrdTypeComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class PrdTypeModule { }
