import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AMCComponent } from './AMC.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { AmcModificationComponent } from './amcModification/amcModification.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RplcePipe } from 'src/app/__Pipes/rplce.pipe';
import { AmcrptComponent } from './amcRpt/amcRpt.component';
import {MatRadioModule} from '@angular/material/radio';
import { SharedModule } from 'src/app/shared/shared.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
const routes: Routes =[{path:'',component:AMCComponent}]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    OverlayModule,
    DragDropModule,
    MatButtonToggleModule,
    MatRadioModule,
    SharedModule,
    MatCheckboxModule,
    MatTableExporterModule,
    MatMenuModule,
    MatSelectModule,

  ],
  declarations: [
    AMCComponent,
    AmcModificationComponent,
    RplcePipe,
    AmcrptComponent
  ]
})
export class AMCModule {
  constructor() {
    console.log("AMCModule Loaded");
  }
 }
