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

  @Input() pl_trxn:Partial<IPLTrxn[]> = [];

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
        field:'scheme',
        header:'Scheme',
        width:'30rem'
      },
      {
        field:'folio_no',
        header:'Folio',
        width:'7rem'
      },
      {
        field:'purchase',
        header:'Purchase',
        width:'10rem'
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
        width:'15rem'
      },
      {
        field:'switch_out',
        header:'Switch Out',
        width:'15rem'
      },
      {
        field:'tot_outflow',
        header:'Total Inflow',
        width:'15rem'
      },
      {
        field:'curr_val',
        header:'Curr. Value',
        width:'13rem'
      },
      {
        field:'gain_loss',
        header:'Gain/Loss',
        width:'13rem'
      },
      {
        field:'abs_ret',
        header:'Abs. Return',
        width:'13rem'
      },
      {
        field:'xirr',
        header:'XIRR',
        width:'13rem'
      }
  ]
}

export interface IPLTrxn{
    scheme:string;
    xirr:number;
    abs_ret:number;
    gain_loss:number;
    curr_val:number;
    tot_outflow:number;
    switch_out:number;
    redemption:number;
    tot_inflow:number;
    switch_in:string,
    purchase:string;
    folio_no:number;
}
