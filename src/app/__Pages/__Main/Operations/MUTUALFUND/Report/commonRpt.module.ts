import { NgModule } from '@angular/core';
import { FinancialRPTComponent } from './financial-rpt/financial-rpt.component';
import { NonFinancialRPTComponent } from './non-financial-rpt/non-financial-rpt.component';
import { NfoRPTComponent } from './nfo-rpt/nfo-rpt.component';
import { KycRptComponent } from './kyc-rpt/kyc-rpt.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    FinancialRPTComponent,
    NonFinancialRPTComponent,
    NfoRPTComponent,
    KycRptComponent
  ],
  imports: [ CommonModule,SharedModule],
  exports:[
    FinancialRPTComponent,
    NonFinancialRPTComponent,
    NfoRPTComponent,
    KycRptComponent,
    SharedModule
  ]
})
export class CommonReportModule { }
