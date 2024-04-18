import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'pl-trxn-dtls',
  templateUrl: './pl-trxn-dtls.component.html',
  styleUrls: ['./pl-trxn-dtls.component.css']
})
export class PlTrxnDtlsComponent implements OnInit {

  constructor(private utility:UtiliService) { }

  @Input() pl_trxn:Partial<IPLTrxn>[] = [];

  @ViewChild('dt') primaryTbl :Table;

  column:column[] = PLTransaction.column

  ngOnInit(): void {}

  filterGlobal_secondary = ($event) =>{
    let value = $event.target.value;
    this.primaryTbl.filterGlobal(value,'contains')
  }
  getColumns = () =>{
    return this.utility.getColumns(this.column);
  }

}


export class PLTransaction{
  public static column:column[] = [
      {
        field:'scheme_name',
        header:'Scheme',
        width:'30rem'
      },
      {
        field:'folio_no',
        header:'Folio',
        width:'9rem'
      },
      {
        field:'purchase',
        header:'Purchase',
        width:'7rem'
      },
      {
        field:'switch_in',
        header:'Switch In',
        width:'10rem'
      },
      {
        field:'tot_inflow',
        header:'Total Inflow',
        width:'10rem'
      },
      {
        field:'redemption',
        header:'Redemption',
        width:'10rem'
      },
      {
        field:'switch_out',
        header:'Switch Out',
        width:'10rem'
      },
      {
        field:'tot_outflow',
        header:'Total Outflow',
        width:'10rem'
      },
      {
        field:'curr_val',
        header:'Curr. Val',
        width:'10rem'
      },
      {
        field:'gain_loss',
        header:'Gain/Loss',
        width:'10rem'
      },
      {
        field:'ret_abs',
        header:'Abs. Ret',
        width:'10rem'
      },
      {
        field:'xirr',
        header:'XIRR',
        width:'4rem'
      }
  ]
}

export interface IPLTrxn{
    scheme_name:string;
    xirr:number;
    ret_abs:number;
    gain_loss:number;
    curr_val:number;
    tot_outflow:number;
    switch_out:number;
    redemption:number;
    tot_inflow:number;
    switch_in:string,
    purchase:string;
    folio_no:number;
    plan_name:string;
    option_name:string;

}
