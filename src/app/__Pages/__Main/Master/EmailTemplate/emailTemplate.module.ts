
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailtemplateComponent } from './emailTemplate.component';
import { ModificationComponent } from './Modification/modification.component';
import { RptComponent } from './RPT/Rpt.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
const routes: Routes = [
  {
    path:'',
    component:EmailtemplateComponent
  }
]

@NgModule({
    declarations: [
      EmailtemplateComponent,
      RptComponent,
      ModificationComponent
    ],
    imports: [
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      RouterModule.forChild(routes),
      MatTableModule,
      MatDialogModule,
      DragDropModule,
      OverlayModule,
      MatButtonToggleModule,
      SharedModule,
      MatRadioModule,
      MatTableExporterModule,
      MatMenuModule,
      MatIconModule,
      MatButtonModule,
      MatSortModule
    ],
    providers: []
})
export class EmailtemplateModule { }
