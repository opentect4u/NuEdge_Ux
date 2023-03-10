import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsMasterComponent } from './docsMaster.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatDialogModule } from '@angular/material/dialog';
import { DocsModificationComponent } from './docsModification/docsModification.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {OverlayModule} from '@angular/cdk/overlay';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DoctyperptComponent } from './docTypeRpt/docTypeRpt.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { DragDropModule } from '@angular/cdk/drag-drop';
const routes: Routes =[{path:'',component:DocsMasterComponent}]
@NgModule({
  imports: [
    CommonModule,
    SearchModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    OverlayModule,
    SharedModule,
    MatButtonToggleModule,
    MatTableExporterModule,
    MatRadioModule,
    MatMenuModule,
    MatSortModule,
    DragDropModule
  ],
  declarations: [DocsMasterComponent,DocsModificationComponent,DoctyperptComponent]
})
export class DocsMasterModule {
  constructor() {
    console.log("Document Master Module Loaded");
  }
}
