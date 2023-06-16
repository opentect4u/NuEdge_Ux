import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankComponent } from './bank.component';
import { RouterModule, Routes } from '@angular/router';
import { BnkModificationComponent } from './bnkModification/bnkModification.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BnkrptComponent } from './bankRpt/bnkRpt.component';

const routes: Routes = [{path:'',component:BankComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [BankComponent,BnkModificationComponent,BnkrptComponent]
})
export class BankModule {
  constructor() {
    console.log("Bank Module Loaded");
  }
 }
