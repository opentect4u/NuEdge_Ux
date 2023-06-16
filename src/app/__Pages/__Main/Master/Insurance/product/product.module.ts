import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes:Routes = [{
  path:'',component:ProductComponent,
  children:[
    {
      path:'',
      loadChildren:()=> import('./home/home.module').then(m => m.HomeModule)
    },
    {
      path:'uploadproduct',
      loadChildren:()=> import('./upload-product/upload-product.module').then(m => m.UploadProductModule)
      ,data:{breadcrumb:'Upload Product'}
    }
  ]
}]

@NgModule({
  declarations: [
    ProductComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ProductModule { }
