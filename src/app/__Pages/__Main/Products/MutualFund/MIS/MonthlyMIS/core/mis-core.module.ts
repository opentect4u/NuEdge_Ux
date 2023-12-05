import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportFilterComponent } from './report-filter/report-filter.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MisTblComponent } from './mis-tbl/mis-tbl.component';

@NgModule({
  declarations: [
    ReportFilterComponent,
    MisTblComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[ReportFilterComponent,SharedModule,MisTblComponent]
})
export class MisCoreModule { }
