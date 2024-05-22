import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';
import { trxnClm } from 'src/app/__Utility/TransactionRPT/trnsClm';

@Component({
  selector: 'div-history',
  templateUrl: './div-history.component.html',
  styleUrls: ['./div-history.component.css']
})
export class DivHistoryComponent implements OnInit {

  private _divHistory:Partial<TrxnRpt>[];

  @ViewChild('primeTbl') primeTbl :Table;

  column:column[] = trxnClm.column.filter((item:column) => (item.field!='amc_link' && item.field!='scheme_link' && item.field!='isin_link' && item.field!='plan_name' && item.field!='option_name' && item.field!='plan_opt' && item.field!='divident_opt' && item.field!='lock_trxn')).filter((el) => el.isVisible.includes('T'));

  @Input()
  get divHistory():Partial<TrxnRpt>[] {
      return this._divHistory;
  }

  set divHistory(value:Partial<TrxnRpt>[]){
    this._divHistory = value;
  }

  constructor(private utility:UtiliService) { }

  ngOnInit(): void {
  }

  getColumns = () =>{
    return this.utility.getColumns(this.column);
  }
}
