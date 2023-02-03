import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankComponent } from './bank.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

const routes: Routes = [{path:'',component:BankComponent}]

@NgModule({
  imports: [
    CommonModule,
    SearchModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatPaginatorModule
  ],
  declarations: [BankComponent]
})
export class BankModule {
  constructor() {
    console.log("Bank Module Loaded");
  }
 }
