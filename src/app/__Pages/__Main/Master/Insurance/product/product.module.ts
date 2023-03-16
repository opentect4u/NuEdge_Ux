import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductCrudComponent } from './Dialog/product-crud/product-crud.component';
import { ProductRPTComponent } from './Dialog/product-rpt/product-rpt.component';

const routes:Routes = [{path:'',component:ProductComponent}]

@NgModule({
  declarations: [
    ProductComponent,
    ProductCrudComponent,
    ProductRPTComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ProductModule { }
