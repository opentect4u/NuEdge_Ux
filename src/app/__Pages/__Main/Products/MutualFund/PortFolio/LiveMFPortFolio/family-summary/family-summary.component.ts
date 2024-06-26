import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { column } from 'src/app/__Model/tblClmns';
import { ILivePortFolio } from '../live-mf-port-folio.component';
import { Table } from 'primeng/table';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { DatePipe } from '@angular/common';

/*** Display Footer data on P&L */
export type TotalFamilySummaryportfolio = {
  inv_cost: number | undefined,
  tot_units: number | undefined,
  idcw_reinv:number | undefined,
  idcwp:number | undefined,
  client_name:string | undefined,
  curr_val:number | undefined,
  gain_loss:number | undefined,
  xirr:number | undefined,
  ret_abs:number | undefined,
}
/**  End */

@Component({
  selector: 'family-summary',
  templateUrl: './family-summary.component.html',
  styleUrls: ['./family-summary.component.css']
})



export class FamilySummaryComponent implements OnInit {

  constructor(private utility:UtiliService,private datePipe:DatePipe) { }

  @ViewChild('dt') primaryTbl :Table;

  @Input() column:column[] = [];

   /** Footer Table */
   footerDtls: Partial<TotalFamilySummaryportfolio>;
  /** End */

  private _family_summary:Partial<ILivePortFolio>[] = [];

  @Input()
  public get familySummary():Partial<ILivePortFolio>[]{
   return this._family_summary;
  }

  public set familySummary(familySummary:any){
    this._family_summary = familySummary;
    let total_date = [];
    let total_amount = [];
    let valuation_as_on;
    familySummary.forEach(el =>{
        // console.log(el.total_amount);
        // console.log(el.total_dates);
           total_amount = [...total_amount,...el.total_amount];
           total_date = [...total_date,...el.total_dates];
           valuation_as_on = el.valuation_as_on;
    })
    let curr_val = global.Total__Count(this._family_summary,item => Number(item.curr_val));
    const xirr = global.XIRR([...total_amount,curr_val],[...total_date,this.datePipe.transform(valuation_as_on,'YYYY-MM-dd')],0)
    this.footerDtls = {
      tot_units:global.Total__Count(this._family_summary,item => Number(item.tot_units)),
      inv_cost:global.Total__Count(this._family_summary,item => Number(item.inv_cost)),
      idcw_reinv:global.Total__Count(this._family_summary,item => item.idcw_reinv ? Number(item.idcw_reinv) : 0),
      idcwp:global.Total__Count(this._family_summary,item => item.idcwp ? Number(item.idcwp) : 0),
      client_name:'Grand Total',
      curr_val:curr_val,
      gain_loss:global.Total__Count(this._family_summary,item => Number(item.gain_loss)),
      ret_abs:(global.Total__Count(this._family_summary,item => Number(item.ret_abs)) / this._family_summary.length),
      xirr:xirr
    }
  }

  ngOnInit(): void {}

  filterGlobal_secondary = ($event) =>{
    let value = $event.target.value;
    this.primaryTbl.filterGlobal(value,'contains')
  }
  getColumns = () =>{
    return this.utility.getColumns(this.column);
  }
}
