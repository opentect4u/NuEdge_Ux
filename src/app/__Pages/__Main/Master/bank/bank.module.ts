import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankComponent } from './bank.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { BankModificationComponent } from './bankModification/bankModification.component';

const routes: Routes = [{path:'',component:BankComponent}]

@NgModule({
  imports: [
    CommonModule,
    SearchModule,
    MatIconModule,
    MatDialogModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BankComponent,BankModificationComponent]
})
export class BankModule {
  constructor() {
    console.log("Bank Module Loaded");
  }
 }