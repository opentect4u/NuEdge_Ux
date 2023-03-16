import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsLndComponent } from './ins-lnd.component';
import { RouterModule, Routes } from '@angular/router';

 const routes : Routes = [{
  path:'',
  component:InsLndComponent,
  children:[
    {path:'',redirectTo:'menu',pathMatch:'full'},
    {
      path:'menu',
      loadChildren:()=> import('./ins-home/ins-home.module').then(m => m.InsHomeModule)
    },
    {
      path:'company',
      loadChildren:()=> import('./cmp-mst/cmp-mst.module').then(m => m.CmpMstModule)
    },
    {
      path:'producttype',
      loadChildren:()=> import('./prdType/prd-type.module').then(m => m.PrdTypeModule)
    },
    {
      path:'uploadproducttype',
      loadChildren:()=> import('./prdType/upload-prd-type/upload-prd-type.module').then(m => m.UploadPrdTypeModule)
    },
    {
      path:'uploadcompany',
      loadChildren:()=> import('./cmp-mst/upload-cmp/upload-cmp.module').then(m => m.UploadCmpModule)
    },
    {
      path:'product',
      loadChildren:()=> import('./product/product.module').then(m => m.ProductModule)
    },
    {
      path:'uploadproduct',
      loadChildren:()=> import('./product/upload-product/upload-product.module').then(m => m.UploadProductModule)
    }
  ]
}]

@NgModule({
  declarations: [
    InsLndComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class InsLndModule { }
