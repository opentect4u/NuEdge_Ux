import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentComponent } from './document.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { DocsModificationComponent } from './docsModification/docsModification.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'src/app/shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DocrptComponent } from './docRPT/docRPT.component';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatSortModule } from '@angular/material/sort';

const routes: Routes =[{path:'',component:DocumentComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    SharedModule,
    DragDropModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatRadioModule,
    MatMenuModule,
    MatTableExporterModule,
    MatSortModule
  ],
  declarations: [
    DocumentComponent,
    DocrptComponent,
    DocsModificationComponent]
})
export class DocumentModule {
  constructor() {
    console.log('Document Module Loaded');
  }
 }
