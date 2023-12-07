import { Component, OnInit, ViewChild } from '@angular/core';
import { column } from 'src/app/__Model/tblClmns';

@Component({
  selector: 'app-trend-rpt',
  templateUrl: './trend-rpt.component.html',
  styleUrls: ['./trend-rpt.component.css']
})
export class TrendRptComponent implements OnInit {

  @ViewChild('MISTABLE') __MisTbleComponent;

  constructor() { }

  /**** COLUMN */
  __mis__Trend__Column:column[] =  ColumnTrend.column;
  /*****END */

  /**** Holding Trend Report Master Data */
  __mis__Trend__Report:IMisTrend[] = [];
  /*****End */

  ngOnInit(): void {}

  searchFilter = (ev) =>{
    console.log(ev);
  }

  // TabDetails = (ev) =>{

  // }

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.__MisTbleComponent.primeTbl.filterGlobal(value, 'contains')
  }

}


export class ColumnTrend{
   public static column:column[]=[
    {
      field:'sl_no',
      header:'Sl No.'
    },
    {
      field:'monthly',
      header:'Monthly'
    },
    {
      field:'monthly_inflow',
      header:'Monthly Inflow'
    },
    {
      field:'monthly_outflow',
      header:'Monthly Outflow'
    },
    {
      field:'net_inflow',
      header:'Net Inflow'
    },
    {
      field:'per_growth',
      header:'% Of Growth'
    },
    {
      field:'trend',
      header:'Trend'
    }
   ]
}

export  interface IMisTrend{
    id:number;
    monthly:string;
    monthly_inflow:string;
    monthly_outflow:string;
    net_inflow:string;
    per_growth:string;
    trend:string;
}
