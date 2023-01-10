import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubcategoryComponent } from './subcategory.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { SubcateModificationComponent } from './subcateModification/subcateModification.component';

const routes: Routes =[{path:'',component:SubcategoryComponent}]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    MatIconModule,
    MatDialogModule
  ],
  declarations: [SubcategoryComponent,SubcateModificationComponent]
})
export class SubcategoryModule { 
  constructor() {
    console.log('Sub-category Module Loaded');
  }
}
