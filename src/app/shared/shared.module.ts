import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BnkrplcPipe } from '../__Pipes/bnkrplc.pipe';
import { ClOutsideClickDirective } from '../__Directives/clOutsideClick.directive';
import { elipsisPipe } from '../__Pipes/elipsis.pipe';
import { ResizeColumnDirective } from '../__Directives/resize-column.directive';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort';
import { DeletemstComponent } from './deleteMst/deleteMst.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    ReactiveFormsModule,
    OverlayModule,
    MatSortModule,
    DragDropModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatTableExporterModule,
    MatRadioModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatSelectModule
  ],
  declarations: [
    BnkrplcPipe,
    ClOutsideClickDirective,
    elipsisPipe,
    DeletemstComponent,
    ResizeColumnDirective],
  exports:[BnkrplcPipe,ClOutsideClickDirective,elipsisPipe,ResizeColumnDirective,
    MatDialogModule,
    MatTableModule,
    ReactiveFormsModule,
    OverlayModule,
    MatSortModule,
    DragDropModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatTableExporterModule,
    MatRadioModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule]
})
export class SharedModule { }
