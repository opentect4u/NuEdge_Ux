import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubcategoryComponent } from './subcategory.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatDialogModule } from '@angular/material/dialog';
import { SubcateModificationComponent } from './subcateModification/subcateModification.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

const routes: Routes =[{path:'',component:SubcategoryComponent}]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule
  ],
  declarations: [SubcategoryComponent,SubcateModificationComponent]
})
export class SubcategoryModule { 
  constructor() {
    console.log('Sub-category Module Loaded');
  }
}
