import { Component, Input, OnInit } from '@angular/core';


export interface IAumReportsTiles{
      inv_cost:number | undefined;
      div_paid: number | undefined;
      div_reinv: number | undefined;
      aum: number | undefined;
      ret_abs: number | undefined;
      equity: number | undefined;
      debt: number | undefined;
      hybrid: number | undefined;
      sol_oriented: number | undefined;
      others: number | undefined
}

@Component({
  selector: 'aum-report-total-calc',
  templateUrl: './aum-report-total-calc.component.html',
  styleUrls: ['./aum-report-total-calc.component.css']
})
export class AumReportTotalCalcComponent implements OnInit {

  constructor() { }

  @Input() aum_reports_tiles: Partial<IAumReportsTiles>;

  @Input() aum_type: 'Fund House' | 'Families' | 'Clients' = 'Fund House';

  ngOnInit(): void {}

}
