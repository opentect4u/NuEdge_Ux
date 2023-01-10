import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionComponent } from './transaction.component';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatDialogModule } from '@angular/material/dialog';
import { TrnsModificationComponent } from './trnsModification/trnsModification.component';

const routes: Routes = [{path:'',component:TransactionComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    SearchModule,
    MatDialogModule
  ],
  declarations: [TransactionComponent,TrnsModificationComponent]
})
export class TransactionModule { 
  constructor() {
    console.log("Transaction Module Loaded");
  }
}
