import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionComponent } from './transaction.component';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatDialogModule } from '@angular/material/dialog';
import { TrnsModificationComponent } from './trnsModification/trnsModification.component';
import { TrnsrptComponent } from './trnsRpt/trnsRpt.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatTableModule } from '@angular/material/table';

const routes: Routes = [{path:'',component:TransactionComponent,
data:{breadcrumb:'Transaction'}}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    SearchModule,
    MatDialogModule,
    MatDialogModule,
    DragDropModule,
    OverlayModule,
    MatButtonToggleModule,
    SharedModule,
    MatRadioModule,
    MatTableExporterModule,
    MatTableModule
  ],
  declarations: [TransactionComponent,TrnsModificationComponent,TrnsrptComponent]
})
export class TransactionModule {
  constructor() {
    console.log("Transaction Module Loaded");
  }
}
