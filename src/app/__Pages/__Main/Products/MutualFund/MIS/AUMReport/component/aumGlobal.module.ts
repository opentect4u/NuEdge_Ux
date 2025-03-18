import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AumFilterComponent } from './aum-filter/aum-filter.component';
import { AumReportTotalCalcComponent } from './aum-report-total-calc/aum-report-total-calc.component';
import { AumTableComponent } from './aum-table/aum-table.component';
import { RouterModule } from '@angular/router';
import { XIRRCalcPipe } from 'src/app/__Pipes/xirrCalc.pipe';
import { XIRRWithAum_DateParamsCalcPipe } from 'src/app/__Pipes/xirrCalculationWithaum_dateParams.pipe';

@NgModule({
  declarations: [
    AumFilterComponent,
    AumReportTotalCalcComponent,
    AumTableComponent,
    XIRRCalcPipe,
    XIRRWithAum_DateParamsCalcPipe
  ],
  imports: [CommonModule,SharedModule,RouterModule],
  exports:[SharedModule,AumFilterComponent,AumReportTotalCalcComponent,AumTableComponent]

})
export class AumGlobalModule {}
