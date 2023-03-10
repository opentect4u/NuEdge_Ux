import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransTypeComponent } from './transType.component';
import { RouterModule, Routes } from '@angular/router';
// import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { TrnstypeModificationComponent } from './trnstypeModification/trnstypeModification.component';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableExporterModule } from 'mat-table-exporter';
import { TrnstyperptComponent } from './trnsTypeRpt/trnsTypeRpt.component';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';

const routes: Routes = [
  {
    path:'',
    component:TransTypeComponent,
    data: { breadcrumb: 'Transaction Type' },
  }]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    SharedModule,
  ],
  declarations: [TransTypeComponent,TrnstyperptComponent,TrnstypeModificationComponent]
})
export class TransTypeModule {
  constructor() {
    console.log('Trans Type Module Loaded');

  }
}
