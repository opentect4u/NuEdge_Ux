import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';
import { trxnClm } from 'src/app/__Utility/TransactionRPT/trnsClm';

@Component({
  selector: 'reject-trxn',
  templateUrl: './reject-trxn.component.html',
  styleUrls: ['./reject-trxn.component.css']
})
export class RejectTrxnComponent implements OnInit {

  /** Holding Reject Transaction Master Data */
    @Input() rejectTrxn:TrxnRpt[] = []
  /** End */

  @ViewChild('primeTbl') primeTbl :Table;

  /*** Holding column for Reject Transaction Datatable */
    column:column[] = trxnClm.column.filter((item:column) => (item.field!='amc_link' && item.field!='scheme_link' && item.field!='isin_link' && item.field!='plan_name' && item.field!='option_name' && item.field!='plan_opt' && item.field!='divident_opt' && item.field!='lock_trxn')).filter((el) => el.isVisible.includes('T'));
  /*** End */

  constructor(private utility:UtiliService) { }

  ngOnInit(): void {}

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }

  getColumns = () =>{
    return this.utility.getColumns(this.column);
  }

}
