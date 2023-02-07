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
    MatButtonToggleModule
  ],
  declarations: [AMCComponent,AmcModificationComponent,RplcePipe]
})
export class AMCModule {
  constructor() {
    console.log("AMCModule Loaded");
  }
 }
