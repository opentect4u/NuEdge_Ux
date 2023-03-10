
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule, Routes } from '@angular/router';
import { MatTableExporterModule } from 'mat-table-exporter';
import { SharedModule } from 'src/app/shared/shared.module';
import { AckentryComponent } from './ackEntry.component';
import { AckrptComponent } from './ackRPT/ackRPT.component';
import { AckuploadComponent } from './ackUpload/ackUpload.component';
import { ManualentrforackfinComponent } from './manualEntrForAckFin/manualEntrforAckFin.component';
const routes : Routes = [
  {
    path:'',
    component:AckentryComponent
}
]

@NgModule({
    
 
 declarations: [
    ManualentrforackfinComponent,
    AckuploadComponent,
    AckrptComponent,
    AckentryComponent],
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
    providers: []
})
export class AckentryModule { }