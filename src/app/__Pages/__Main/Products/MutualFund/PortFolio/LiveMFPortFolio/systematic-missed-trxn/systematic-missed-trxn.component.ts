import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';
import { trxnClm } from 'src/app/__Utility/TransactionRPT/trnsClm';
import { RejectTransactionFooterCalc, RejectTrxnClmn } from '../reject-trxn/reject-trxn.component';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'systematic-missed-trxn',
  templateUrl: './systematic-missed-trxn.component.html',
  styleUrls: ['./systematic-missed-trxn.component.css']
})
export class SystematicMissedTrxnComponent implements OnInit {

  /** Holding Systematic Missed Transaction master Data */
    // @Input() systematicMissedTrxn:Partial<ISystematicMissedTrxn>[] = []
    // @Input() systematicMissedTrxn:Partial<TrxnRpt>[] = []

  /** End */


  SystematicMissedTrxnFooterTrxnCacl:Required<RejectTransactionFooterCalc>;
  private _systematicMissedTrxn:Partial<ISystematicMissedTrxn>[]

  @Input()
  get systematicMissedTrxn(){
    return this._systematicMissedTrxn;
  }

  set systematicMissedTrxn(value:Partial<ISystematicMissedTrxn>[]){
      this._systematicMissedTrxn = value;
      this.SystematicMissedTrxnFooterTrxnCacl = {
        tot_amount:global.Total__Count(value, item => Number(item.tot_amount)),
        tot_gross_amount:global.Total__Count(value, item => Number(item.tot_gross_amount)),
        tot_stamp_duty:global.Total__Count(value, item => Number(item.tot_stamp_duty)),
        tot_tds:global.Total__Count(value, item => Number(item.tot_tds)),
        units:global.Total__Count(value, item => Number(item.units))
      }
  }

  /** Holding the column for systematic missed transaction */
    // columns:column[] = SystematicMissedTrxnClmn.columns;
    // columns:column[] = trxnClm.column.filter((item:column) => (item.field!='amc_link' && item.field!='scheme_link' && item.field!='isin_link' && item.field!='plan_name' && item.field!='option_name' && item.field!='plan_opt' && item.field!='divident_opt' && item.field!='lock_trxn')).filter((el) => el.isVisible.includes('T'));;

    columns:column[] = RejectTrxnClmn.column

  /** End */

  /*** Holding Id */
   @Input() transId:number;
  /**  End */

  @ViewChild('dt') primaryTbl :Table;

  constructor(private utility:UtiliService) { }

  ngOnInit(): void {}

  filterGlobal_secondary = ($event) =>{
    let value = $event.target.value;
    this.primaryTbl.filterGlobal(value,'contains')
  }
  getColumns = () =>{
    return this.utility.getColumns(this.columns);
  }

}


export class ISystematicMissedTrxn{
  id:number;
  first_client_name:string;
  scheme_name:string;
  plan_name:string;
  option_name:string;
  folio_no:string;
  trans_no:string;
  from_date:Date;
  to_date:Date;
  termination_name:Date;
  amount:number;
  transaction_type:string;
  bank_name:string;
  xirr:number;
  divi_lock_flag:string;
  tot_amount:number;
  tot_stamp_duty:number;
  tot_tds:number;
  tot_gross_amount:number;
  units:number;
}

// export class SystematicMissedTrxnClmn{
//   public static columns:column[] = [
//     {field:'sl_no',header:'Sl No.',isVisible:[4,5,6],width:'5rem'},
//     {field:'first_client_name',header:'Client',isVisible:[4,5,6],width:'20rem'},
//     {field:'scheme_name',header:'Scheme',isVisible:[4,5,6],width:'25rem'},
//     {field:'folio_no',header:'Folio',isVisible:[4,5,6]},
//     {field:'trans_no',header:'Txn No.',isVisible:[4,5,6]},
//     {field:'from_date',header:'Start Date',isVisible:[4,5,6]},
//     {field:'from_date',header:'Start Date',isVisible:[4,5,6]},
//     {field:'terminated_date',header:'Term. Date',isVisible:[4,5,6]},
//     {field:'amount',header:'Amount',isVisible:[4,5,6]},
//     {field:'bank_name',header:'Bank',isVisible:[4,5,6],width:'25rem'},
//     {field:'xirr',header:'XIRR',isVisible:[4,5,6],width:'8rem'}
//   ]
// }
