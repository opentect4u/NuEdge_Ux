import { NgModule } from '@angular/core';
import { FinancialRPTComponent } from './financial-rpt/financial-rpt.component';
import { NonFinancialRPTComponent } from './non-financial-rpt/non-financial-rpt.component';
import { NfoRPTComponent } from './nfo-rpt/nfo-rpt.component';
import { KycRptComponent } from './kyc-rpt/kyc-rpt.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  declarations: [
    FinancialRPTComponent,
    NonFinancialRPTComponent,
    NfoRPTComponent,
    KycRptComponent
  ],
  imports: [ CommonModule,SharedModule,DialogModule],
  exports:[
    FinancialRPTComponent,
    NonFinancialRPTComponent,
    NfoRPTComponent,
    KycRptComponent,
    SharedModule,
    DialogModule
  ]
})
export class CommonReportModule { }
