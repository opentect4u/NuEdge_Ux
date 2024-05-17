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
    // column:column[] = trxnClm.column.filter((item:column) => (item.field!='amc_link' && item.field!='scheme_link' && item.field!='isin_link' && item.field!='plan_name' && item.field!='option_name' && item.field!='plan_opt' && item.field!='divident_opt' && item.field!='lock_trxn')).filter((el) => el.isVisible.includes('T'));
    column:column[] = RejectTrxnClmn.column

  /*** End */



  constructor(private utility:UtiliService) { }

  ngOnInit(): void {console.log('ngOnInit')}

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }

  getColumns = () =>{
    return this.utility.getColumns(this.column);
  }

}

export class RejectTrxnClmn{
  public static column:column[] = [
    {field:'sl_no',header:'Sl No.',width:'4rem',},
    {field:'scheme_name',header:'Scheme',width:'30rem'},
    {field:'folio_no',header:'Folio',width:'9rem'},
    {field:'trans_date',header:'Trxn Date',width:'7rem'},
    {field:'transaction_type',header:'Trxn Type',width:'14rem'},
    {field:'transaction_subtype',header:'Trxn Subtype',width:'14rem'},
    {field:'tot_gross_amount',header:'Gross Amt',width:'7rem'},
    {field:'tot_stamp_duty',header:'S. Duty',width:'6rem'},
    {field:'tot_tds',header:'TDS',width:'4rem'},
    {field:'tot_amount',header:'Net Amt',width:'6rem'},
    {field:'bank_name',header:'Bank',width:'10rem'},
    {field:'tot_units',header:'Units',width:'7rem'},
    {field:'remarks',header:'Remarks',width:'10rem'}
  ]

}
