import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RNTComponent } from './RNT.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatTableModule } from '@angular/material/table';
import { RntModificationComponent } from './rntModification/rntModification.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { ReplacePipe } from 'src/app/__Pipes/replace.pipe';
import { RntrptComponent } from './rntRpt/rntRpt.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatRadioModule } from '@angular/material/radio';
import { SharedModule } from 'src/app/shared/shared.module';
const __routes: Routes = [{ path: '', component: RNTComponent}]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(__routes),
    SearchModule,
    MatTableModule,
    MatDialogModule,
    ReactiveFormsModule,
    SharedModule,
    OverlayModule,
    DragDropModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatTableExporterModule,
    MatRadioModule
  ],
  declarations: [RNTComponent,RntModificationComponent,RntrptComponent,ReplacePipe]
})
export class RNTModule {

  constructor() {
    console.log('RNT Module Loaded');
  }
}
