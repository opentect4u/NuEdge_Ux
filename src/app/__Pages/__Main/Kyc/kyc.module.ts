import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KycComponent } from './kyc.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { KyModificationComponent } from './kyModification/kyModification.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { KycrptComponent } from './KycRpt/kycRPT.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { DialogfrclientComponent } from './dialogForClient/dialogFrClient.component';
import { DialogfrclientviewComponent } from './dialogFrClientView/dialogFrClientView.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatRadioModule } from '@angular/material/radio';

const routes: Routes = [{ path: '', component: KycComponent }]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    MatTableModule,
    // MatPaginatorModule,
    MatDialogModule,
    OverlayModule,
    DragDropModule,
    MatButtonToggleModule,
    MatRadioModule,
    SharedModule,
    // MatCheckboxModule,
    MatTableExporterModule,
    MatMenuModule,
    SharedModule,
    MatSelectModule
  ],
  declarations: [KycComponent,KyModificationComponent,KycrptComponent,DialogfrclientComponent,DialogfrclientviewComponent]
})
export class KycModule {

  constructor() {
    console.log('Kyc Module Loaded');
  }
}
