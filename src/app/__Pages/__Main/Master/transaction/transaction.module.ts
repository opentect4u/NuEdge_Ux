import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionComponent } from './transaction.component';
import { RouterModule, Routes } from '@angular/router';
import { TrnsModificationComponent } from './trnsModification/trnsModification.component';
import { TrnsrptComponent } from './trnsRpt/trnsRpt.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [{path:'',component:TransactionComponent,
data:{breadcrumb:'Transaction'}}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [TransactionComponent,TrnsModificationComponent,TrnsrptComponent]
})
export class TransactionModule {
  constructor() {
    console.log("Transaction Module Loaded");
  }
}
