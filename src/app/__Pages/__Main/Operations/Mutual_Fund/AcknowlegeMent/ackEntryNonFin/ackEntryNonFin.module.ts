import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AckEntryNonFinComponent } from './ackEntryNonFin.component';
import { RouterModule, Routes } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import { MatTableExporterModule } from 'mat-table-exporter';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManualEntryForNonFinComponent } from './manualEntryForNonFin/manualEntryForNonFin.component';
import { AckUploadForNonFinComponent } from './ackUploadForNonFin/ackUploadForNonFin.component';
import { AckRPTForNonFinComponent } from './ackRPTForNonFin/ackRPTForNonFin.component';
import { MatSortModule } from '@angular/material/sort';
const routes: Routes = [
  {
    path: '',
    component: AckEntryNonFinComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTableModule,
    DragDropModule,
    OverlayModule,
    SharedModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatButtonToggleModule,
    SharedModule,
    MatRadioModule,
    MatSelectModule,
    MatTableExporterModule,
    MatMenuModule,
    MatIconModule,
    MatChipsModule,
    MatSortModule
  ],
  declarations: [
    AckEntryNonFinComponent,
    AckUploadForNonFinComponent,
    AckRPTForNonFinComponent,
    ManualEntryForNonFinComponent],
})
export class AckEntryNonFinModule {}
