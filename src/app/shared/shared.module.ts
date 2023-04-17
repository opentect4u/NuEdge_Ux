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
import { A11yModule } from '@angular/cdk/a11y';
import { CreateClientComponent } from './create-client/create-client.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ManualUpdateEntryForMFComponent } from './manual-update-entry-for-mf/manual-update-entry-for-mf.component';
import { MatChipsModule } from '@angular/material/chips';
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
    MatSelectModule,
    A11yModule,
    MatChipsModule,
    MatTooltipModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
    BnkrplcPipe,
    ClOutsideClickDirective,
    ResizeColumnDirective,
    elipsisPipe,
    DeletemstComponent,
    CreateClientComponent,
    ManualUpdateEntryForMFComponent
  ],
  exports:[
    BnkrplcPipe,
    ClOutsideClickDirective,
    elipsisPipe,
    ResizeColumnDirective,
    A11yModule,
    MatDialogModule,
    MatTableModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    OverlayModule,
    MatSortModule,
    MatChipsModule,
    DragDropModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatTableExporterModule,
    MatTooltipModule,
    MatRadioModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule]
})
export class SharedModule { }
