import { Component, Input, OnInit } from '@angular/core';
import { IAumFooterModel } from '../aum.model';


// export interface IAumReportsTiles{
//       Ines:number | undefined;
//       div_paid: number | undefined;
//       div_reinv: number | undefined;
//       aum: number | undefined;
//       ret_abs: number | undefined;
//       equity: number | undefined;
//       debt: number | undefined;
//       hybrid: number | undefined;
//       sol_oriented: number | undefined;
//       others: number | undefined
// }

@Component({
  selector: 'aum-report-total-calc',
  templateUrl: './aum-report-total-calc.component.html',
  styleUrls: ['./aum-report-total-calc.component.css']
})
export class AumReportTotalCalcComponent implements OnInit {

  constructor() { }

  @Input() aum_report_for_date:string;

  @Input() aum_reports_tiles: Partial<IAumFooterModel>;

  @Input() aum_type: 'Fund House' | 'Families' | 'Clients' | 'Scheme' = 'Fund House';

  ngOnInit(): void {}

}
