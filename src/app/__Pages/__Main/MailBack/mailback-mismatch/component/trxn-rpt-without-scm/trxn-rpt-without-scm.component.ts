import { Component, Input, OnInit } from '@angular/core';
import { column } from 'src/app/__Model/tblClmns';
import { trxnClm } from 'src/app/__Utility/TransactionRPT/trnsClm';

@Component({
  selector: 'mailBack-trxn-rpt-without-scm',
  templateUrl: './trxn-rpt-without-scm.component.html',
  styleUrls: ['./trxn-rpt-without-scm.component.css']
})
export class TrxnRptWithoutScmComponent implements OnInit {

  /**
   * Holding Transaction Report which has empty scheme
   */
  @Input() trxnRptWithOutScm:TrxnRpt[];

  /**
   * Hold the Column for Transaction Report
   */
  TrxnClm:column[] = trxnClm.column;

  constructor() { }

  ngOnInit(): void {
  }

}
