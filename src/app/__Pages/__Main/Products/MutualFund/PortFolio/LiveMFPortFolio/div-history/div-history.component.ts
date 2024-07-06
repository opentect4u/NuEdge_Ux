import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';
import { trxnClm } from 'src/app/__Utility/TransactionRPT/trnsClm';
import { ILivePortFolio } from '../live-mf-port-folio.component';

@Component({
  selector: 'div-history',
  templateUrl: './div-history.component.html',
  styleUrls: ['./div-history.component.css']
})
export class DivHistoryComponent implements OnInit {

  private _divHistory:Partial<ILivePortFolio>[];

  @ViewChild('primeTbl') primeTbl :Table;

  // column:column[] = trxnClm.column.filter((item:column) => (item.field!='amc_link' && item.field!='scheme_link' && item.field!='isin_link' && item.field!='plan_name' && item.field!='option_name' && item.field!='plan_opt' && item.field!='divident_opt' && item.field!='lock_trxn')).filter((el) => el.isVisible.includes('T'));
  column:column[] = divColumn.column;
  @Input()
  get divHistory():Partial<ILivePortFolio>[] {
      return this._divHistory;
  }

  set divHistory(value:Partial<ILivePortFolio>[]){
    this._divHistory = value;
  }

  constructor(private utility:UtiliService) { }

  ngOnInit(): void {
  }

  getColumns = () =>{
    return this.utility.getColumns(this.column);
  }
}


export class divColumn{
  public static column:column[] =[
    {
      field:'folio_no',
      header:'Folio',
      width:''
    },
    {
      field:'scheme_name',
      header:'Scheme',
      width:'25rem'
    },
    {
      field:'idcwp',
      header:'IDCWP',
      width:''
    },
    {
      field:'idcwp_date',
      header:'IDCWP Date',
      width:''
    },{
      field:'idcw_reinv',
      header:'IDCW Reinv.',
      width:''
    },{
      field:'idcw_reinv_date',
      header:'IDCW Reinv. Date',
      width:''
    },
  ]
}