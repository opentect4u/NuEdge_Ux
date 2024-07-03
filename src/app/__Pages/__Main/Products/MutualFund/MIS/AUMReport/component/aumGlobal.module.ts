import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AumFilterComponent } from './aum-filter/aum-filter.component';
import { AumReportTotalCalcComponent } from './aum-report-total-calc/aum-report-total-calc.component';
import { AumTableComponent } from './aum-table/aum-table.component';

@NgModule({
  declarations: [
    AumFilterComponent,
    AumReportTotalCalcComponent,
    AumTableComponent
  ],
  imports: [CommonModule,SharedModule],
  exports:[SharedModule,AumFilterComponent,AumReportTotalCalcComponent,AumTableComponent]

})
export class AumGlobalModule {}
