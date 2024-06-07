import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';

/*** Display Footer data on P&L */
export type TotalPLportfolio = {
  purchase: number | undefined,
  switch_in: number | undefined,
  idcw_reinv:number | undefined,
  tot_inflow:number | undefined,
  redemption:number | undefined,
  switch_out:number | undefined,
  idcwp:number | undefined,
  tot_outflow:number | undefined,
  scheme_name:number | undefined,
  curr_val:number | undefined,
  gain_loss:number | undefined,
  xirr:number | undefined,
  ret_abs:number | undefined,
}
/**  End */

@Component({
  selector: 'pl-trxn-dtls',
  templateUrl: './pl-trxn-dtls.component.html',
  styleUrls: ['./pl-trxn-dtls.component.css']
})
export class PlTrxnDtlsComponent implements OnInit {

  constructor(private utility:UtiliService) { }

  /** Footer Table */
   footerDtls: Partial<TotalPLportfolio>;
  /** End */

  @Input() pl_trxn:Partial<IPLTrxn>[] = [];

  @Input() folio_type:string;

  @Output() getTransactionDetailsFromPL: EventEmitter<any> = new EventEmitter();

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

  getRowDtls =(rows:Partial<IPLTrxn>) =>{
      this.getTransactionDetailsFromPL.emit(rows)
  }
  ngOnChanges(changes: SimpleChanges): void {
    queueMicrotask(()=>{
      this.footerDtls = {
        purchase:global.Total__Count(this.primaryTbl.value,item => Number(item.purchase)),
        switch_in:global.Total__Count(this.primaryTbl.value,item => Number(item.switch_in)),
        idcw_reinv:global.Total__Count(this.primaryTbl.value,item => item.idcw_reinv ? Number(item.idcw_reinv) : 0),
        tot_inflow:global.Total__Count(this.primaryTbl.value,item => Number(item.tot_inflow)),
        redemption:global.Total__Count(this.primaryTbl.value,item => Number(item.redemption)),
        switch_out:global.Total__Count(this.primaryTbl.value,item => Number(item.switch_out)),
        idcwp:global.Total__Count(this.primaryTbl.value,item => item.idcwp ? Number(item.idcwp) : 0),
        tot_outflow:global.Total__Count(this.primaryTbl.value,item => Number(item.tot_outflow)),
        curr_val:global.Total__Count(this.primaryTbl.value,item => Number(item.curr_val)),
        gain_loss:global.Total__Count(this.primaryTbl.value,item => Number(item.gain_loss)),
        ret_abs:(global.Total__Count(this.primaryTbl.value,item => Number(item.ret_abs)) / this.primaryTbl.value.length),
      }
      })
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
        width:'8rem'
      },
      {
        field:'idcw_reinv',header:'IDCW Reinv',width:"6rem"
      },
      {
        field:'tot_inflow',
        header:'Tot. Inflow',
        width:'8rem'
      },
      {
        field:'redemption',
        header:'Redemption',
        width:'8rem'
      },
      {
        field:'switch_out',
        header:'Switch Out',
        width:'8rem'
      },
      {
        field:'idcwp',header:'IDCW P',width:"4rem"
      },
      {
        field:'tot_outflow',
        header:'Tot. Outflow',
        width:'9rem'
      },
      {
        field:'curr_val',
        header:'Curr. Val',
        width:'7rem'
      },

      {
        field:'gain_loss',
        header:'Gain/Loss',
        width:'8rem'
      },
      {
        field:'ret_abs',
        header:'Abs. Ret',
        width:'7rem'
      },
      {
        field:'xirr',
        header:'XIRR',
        width:'6rem'
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
    mydata:any;
    nav_date:Date;
    tot_units:number;
    idcw_reinv:string;
    idcwp:string
}
