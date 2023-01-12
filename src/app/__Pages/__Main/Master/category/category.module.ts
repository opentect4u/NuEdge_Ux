import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { CategoryModificationComponent } from './categoryModification/categoryModification.component';
import { MatButtonModule } from '@angular/material/button';


const routes:Routes = [{path:'',component:CategoryComponent}]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule
  ],
  declarations: [CategoryComponent,CategoryModificationComponent]
})
export class CategoryModule { 
  constructor() {
    console.log('CategoryModule loaded');
  }
}
