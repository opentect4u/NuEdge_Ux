import { Component, Input, OnInit } from '@angular/core';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';
import { trxnClm } from 'src/app/__Utility/TransactionRPT/trnsClm';

@Component({
  selector: 'mailBack-trxn-rpt-without-scm',
  templateUrl: './trxn-rpt-without-scm.component.html',
  styleUrls: ['./trxn-rpt-without-scm.component.css']
})
export class TrxnRptWithoutScmComponent implements OnInit {


  @Input() mismatch_flag:string;

  /**
   * Holding Transaction Report which has empty scheme
   */
  @Input() trxnRptWithOutScm:TrxnRpt[];

  /**
   * Hold the Column for Transaction Report
   */
  // TrxnClm:column[] = trxnClm.column;
  @Input() TrxnClm:column[] = [];


  constructor(private utility:UtiliService) { }

  ngOnInit(): void {
  }
  getColumns = () =>{
    return this.utility.getColumns(this.TrxnClm);
  }
}
