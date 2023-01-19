import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankComponent } from './bank.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatDialogModule } from '@angular/material/dialog';
import { BankModificationComponent } from './bankModification/bankModification.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

const routes: Routes = [{path:'',component:BankComponent}]

@NgModule({
  imports: [
    CommonModule,
    SearchModule,
    MatDialogModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatPaginatorModule
  ],
  declarations: [BankComponent,BankModificationComponent]
})
export class BankModule {
  constructor() {
    console.log("Bank Module Loaded");
  }
 }
