import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Routes } from '@angular/router';
import { ProductModificationComponent } from './ProductModification/ProductModification.component';

const routes: Routes = [{path:'',component:ProductComponent}]

@NgModule({
  imports: [
    CommonModule,
    SearchModule,
    MatDialogModule,
    MatIconModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProductComponent,ProductModificationComponent]
})
export class ProductModule { 
  constructor() {
    console.log('Product Module Loaded');
  }
}
