import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsLndComponent } from './ins-lnd.component';
import { RouterModule, Routes } from '@angular/router';

 const routes : Routes = [{
  path:'',
  component:InsLndComponent,
  data:{breadcrumb:'Insurance'},
  children:[
    {
      path:'',
      loadChildren:()=> import('./ins-home/ins-home.module').then(m => m.InsHomeModule)
    },
    {
      path:'company',
      loadChildren:()=> import('./cmp-mst/cmp-mst.module').then(m => m.CmpMstModule),
      data:{breadcrumb:'Company'}
    },
    {
      path:'producttype',
      loadChildren:()=> import('./prdType/prd-type.module').then(m => m.PrdTypeModule),
      data:{breadcrumb:'Product Type'}
    },
    {
      path:'product',
      loadChildren:()=> import('./product/product.module').then(m => m.ProductModule),
      data:{breadcrumb:'Product'}
    },

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
