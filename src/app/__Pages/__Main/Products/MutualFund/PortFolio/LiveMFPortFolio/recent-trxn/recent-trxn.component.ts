import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'recent-trxn',
  templateUrl: './recent-trxn.component.html',
  styleUrls: ['./recent-trxn.component.css']
})
export class RecentTrxnComponent implements OnInit {

  @Input() recent_trxn: Partial<IRecentTrxn>[] = []

  recent_trxn_clmn:column[] = RecentTrxnClmn.column

  @ViewChild('dt') primaryTbl :Table;


  constructor(private utility:UtiliService) { }

  ngOnInit(): void {}

  filterGlobal_secondary = ($event) =>{
    let value = $event.target.value;
    this.primaryTbl.filterGlobal(value,'contains')
  }
  getColumns = () =>{
    return this.utility.getColumns(this.recent_trxn_clmn);
  }

}


export  interface IRecentTrxn{
  trans_date:Date;
  // arn_code:string;
  scheme_name:string;
  folio_no:string;
  transaction_type:string;
  tot_amount:number;
  tot_units:number;
  pur_price:number;
  plan_name:string;
  option_name:string;
}

export class RecentTrxnClmn{
   public static column:column[] = [
    {
      field:'trans_date',
      header:'Trans date',
      width:'5rem'
    },
    {
      field:'scheme_name',
      header:'Scheme',
      width:'30rem'
    },
    {
      field:'folio_no',
      header:'Folio',
      width:'5rem'
    },
    {
      field:'transaction_type',
      header:'Trans. Type',
      width:'10rem'
    },
    {
      field:'tot_amount',
      header:'Amount',
      width:'5rem'
    },
    {
      field:'tot_units',
      header:'Unit',
      width:'5rem'
    },
    {
      field:'pur_price',
      header:'Nav',
      width:'5rem'
    }
   ]
}


