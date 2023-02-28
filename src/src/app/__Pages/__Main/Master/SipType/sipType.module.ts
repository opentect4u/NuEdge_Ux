
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SiptypeComponent } from './sipType.component';
import { RouterModule, Routes } from '@angular/router';
// import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatTableModule } from '@angular/material/table';
import { SiptypemodificationComponent } from './sipTypeModification/sipTypeModification.component';
import { SiptyperptComponent } from './sipTypeRpt/sipTypeRpt.component';
const routes: Routes = [
  {
    path:'',
    component:SiptypeComponent,
    data: { breadcrumb: 'Sip Type' },
  }]


@NgModule({
    declarations: [SiptypeComponent,SiptypemodificationComponent,SiptyperptComponent],
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      SearchModule,
      MatIconModule,
      MatDialogModule,
      DragDropModule,
      OverlayModule,
      MatButtonToggleModule,
      SharedModule,
      MatRadioModule,
      MatTableExporterModule,
      MatTableModule
    ],
    providers: []
})
export class SiptypeModule { }
