import { Component, OnInit,Input, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'upcomming-trxn',
  templateUrl: './upcomming-trxn.component.html',
  styleUrls: ['./upcomming-trxn.component.css']
})
export class UpcommingTrxnComponent implements OnInit {

  /*** Holding Upcomming Transactions */
  @Input() upcommingTrxn:Partial<IUpcommingTrxn>[] = [];
  /*** End */

  /** reference of primengTable */
  @ViewChild('dt') primaryTbl :Table;
  /*** End */

  /** Holding columns */
  column:column[] = UpcommingColumns.column;
  /** End */

  constructor(private utility:UtiliService) { }

  ngOnInit(): void {}

  filterGlobal_secondary = ($event) =>{
    let value = $event.target.value;
    this.primaryTbl.filterGlobal(value,'contains')
  }
  getColumns = () =>{
    return this.utility.getColumns(this.column);
  }

}

export interface IUpcommingTrxn{
  first_client_name:string;
  scheme_name:string;
  transaction_type:string;
  folio_no:string;
  freq:string;
  reg_no:string;
  from_date:Date;
  to_date:Date;
  terminated_date:Date;
  date:string;
  amount:number;
  bank_name:string;
  xirr:number;
  plan_name:string;
  option_name:string
}

export class UpcommingColumns {
  public static column:column[] = [
    {
      field:'sl_no',
      header:'Sl No',
      width:'5rem'
    },
    {
      field:'first_client_name',
      header:'Client',
      width:'15rem'
    },
    {
      field:'scheme_name',
      header:'Scheme',
      width:'23rem'
    },
    {
      field:'transaction_type',
      header:'Txn Type',
      width:'6rem'
    },
    {
      field:'folio_no',
      header:'Folio',
      width:'8rem'
    },
    {
      field:'freq',
      header:'Frq',
      width:'7rem'
    },
    {
      field:'reg_no',
      header:'Txn No.',
      width:'7rem'
    },
    {
      field:'from_date',
      header:'Start Date',
      width:'7rem'
    },
    {
      field:'to_date',
      header:'End Date',
      width:'7rem'
    },
    {
      field:'terminated_date',
      header:'Term. Date',
      width:'7rem'
    },
    {
      field:'date',
      header:'Date',
      width:'5rem'
    },
    {
      field:'amount',
      header:'Amount',
      width:'6rem'
    },
    {
      field:'bank_name',
      header:'Bank',
      width:'12rem'
    },
    {
      field:'xirr',
      header:'XIRR',
      width:'5rem'
    }
  ]
}
