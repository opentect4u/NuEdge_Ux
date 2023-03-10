import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubcategoryComponent } from './subcategory.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SubcateModificationComponent } from './subcateModification/subcateModification.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SharedModule } from 'src/app/shared/shared.module';
import { SubcatrptComponent } from './subcatRpt/subcatRpt.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';

const routes: Routes =[{path:'',component:SubcategoryComponent}]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    DragDropModule,
    OverlayModule,
    MatButtonToggleModule,
    SharedModule,
    MatRadioModule,
    MatTableExporterModule,
    MatMenuModule,
    MatSortModule
  ],
  declarations: [SubcategoryComponent,SubcateModificationComponent,SubcatrptComponent]
})
export class SubcategoryModule {
  constructor() {
    console.log('Sub-category Module Loaded');
  }
}
