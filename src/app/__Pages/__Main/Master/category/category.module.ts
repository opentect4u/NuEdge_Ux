import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatTableModule } from '@angular/material/table';
import { CategoryModificationComponent } from './categoryModification/categoryModification.component';
import { MatDialogModule } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CatrptComponent } from './catRpt/catRpt.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';


const routes:Routes = [{path:'',component:CategoryComponent}]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    MatTableModule,
    MatDialogModule,
    OverlayModule,
    DragDropModule,
    SharedModule,
    MatButtonToggleModule,
    MatTableExporterModule,
    MatRadioModule,
    MatMenuModule,
    MatSortModule
  ],
  declarations: [
    CategoryComponent,
    CatrptComponent,
    CategoryModificationComponent]
})
export class CategoryModule {
  constructor() {
    console.log('CategoryModule loaded');
  }
}
