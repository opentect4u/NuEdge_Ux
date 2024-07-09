import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { trxnClm } from 'src/app/__Utility/TransactionRPT/trnsClm';
// import { ILivePortFolio } from '../live-mf-port-folio.component';

@Component({
  selector: 'div-history',
  templateUrl: './div-history.component.html',
  styleUrls: ['./div-history.component.css']
})
export class DivHistoryComponent implements OnInit {

  private _divHistory:Partial<IDivHistory>[];

  __footer_div_history:Partial<{"IDCWP":number,"IDCW Reinv.":number}>;

  @ViewChild('primeTbl') primeTbl :Table;

  // column:column[] = trxnClm.column.filter((item:column) => (item.field!='amc_link' && item.field!='scheme_link' && item.field!='isin_link' && item.field!='plan_name' && item.field!='option_name' && item.field!='plan_opt' && item.field!='divident_opt' && item.field!='lock_trxn')).filter((el) => el.isVisible.includes('T'));
  column:column[] = divColumn.column;
  @Input()
  get divHistory():Partial<IDivHistory>[] {
      return this._divHistory;
  }

  set divHistory(value:Partial<IDivHistory>[]){
    this._divHistory = value;
    try{
      this.__footer_div_history = {
        "IDCW Reinv.":global.Total__Count(value,(item:Partial<IDivHistory>) => (item.transaction_subtype.includes('Dividend Reinvestment') && item.tot_amount) ? Number(item.tot_amount) : 0),
         "IDCWP":global.Total__Count(value,(item:Partial<IDivHistory>) => (item.transaction_subtype.includes('Dividend Payout') && item.tot_amount) ? Number(item.tot_amount) : 0)
      }
    }
    catch(err){

    }
  
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
      width:'40rem'
    },
    {
      field:'tot_amount',
      header:'IDCWP',
      width:''
    },
    {
      field:'trans_date',
      header:'IDCWP Date',
      width:''
    },{
      field:'tot_amount',
      header:'IDCW Reinv.',
      width:''
    },{
      field:'trans_date',
      header:'IDCW Reinv. Date',
      width:''
    },
  ]
}

export interface IDivHistory{
  folio_no: string;
  amount: string;
  scheme_name: string;
  tot_amount: string;
  transaction_type: string;
  transaction_subtype: string;
  plan_name:string;
  option_name:string;
  trans_date:string;
}