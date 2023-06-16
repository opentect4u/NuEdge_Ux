import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { RouterModule, Routes } from '@angular/router';

  const routes: Routes = [{
    path:'',
    component:ProductComponent,
    data:{breadcrumb:'Products'},
    children:[
      {
        path:'',
        loadChildren:()=> import('./Home/home.module').then(m => m.HomeModule)
      },
      {
        path:'mf',
        loadChildren:()=> import('./MutualFund/mf-landing.module').then(m=> m.MfLandingModule)
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
