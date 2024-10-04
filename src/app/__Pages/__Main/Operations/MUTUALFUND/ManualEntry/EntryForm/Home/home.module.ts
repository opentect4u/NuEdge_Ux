import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabModule } from 'src/app/__Core/tab/tab.module';
import { FinancialEntryComponent } from './financialEntry/financial-entry.component';
import { NfoEntryComponent } from './nfoEntry/nfo-entry.component';
import { NonFinancialEntryComponent } from './nonFinancialEntry/non-financial-entry.component';
import { KycEntryComponent } from './kycEntry/kyc-entry.component';

 const routes: Routes = [
  {
    path:'',
    component:HomeComponent
  }
 ]

@NgModule({
  declarations: [
    HomeComponent,
    FinancialEntryComponent,
    NfoEntryComponent,
    NonFinancialEntryComponent,
    KycEntryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    TabModule
  ]
})
export class HomeModule { }
