import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankComponent } from './bank.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BnkModificationComponent } from './bnkModification/bnkModification.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [{path:'',component:BankComponent}]

@NgModule({
  imports: [
    CommonModule,
    SearchModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    DragDropModule,
    OverlayModule,
    MatButtonToggleModule,
    SharedModule
  ],
  declarations: [BankComponent,BnkModificationComponent]
})
export class BankModule {
  constructor() {
    console.log("Bank Module Loaded");
  }
 }
