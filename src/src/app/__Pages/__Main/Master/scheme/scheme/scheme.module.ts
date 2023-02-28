import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchemeComponent } from './scheme.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatTableModule } from '@angular/material/table';
import { ScmModificationComponent } from './scmModification/scmModification.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ScmRptComponent } from './scmRpt/scmRpt.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatRadioModule } from '@angular/material/radio';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

const routes: Routes = [{ path: '', component: SchemeComponent }]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    MatTableModule,
    MatDialogModule,
    DragDropModule,
    OverlayModule,
    SharedModule,
    MatButtonToggleModule,
    MatTableExporterModule,
    MatRadioModule,
    NgMultiSelectDropDownModule
  ],
  declarations: [SchemeComponent,ScmModificationComponent,ScmRptComponent]
})
export class SchemeModule {

  constructor() {
    console.log('Scheme Module Loaded');
  }
}
