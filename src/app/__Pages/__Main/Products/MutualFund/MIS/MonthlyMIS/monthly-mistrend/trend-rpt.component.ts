import { Component, OnInit, ViewChild } from '@angular/core';
import { pluck } from 'rxjs/operators';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-trend-rpt',
  templateUrl: './trend-rpt.component.html',
  styleUrls: ['./trend-rpt.component.css']
})
export class TrendRptComponent implements OnInit {

  @ViewChild('MISTABLE') __MisTbleComponent;

  constructor(private dbIntr:DbIntrService,private utility:UtiliService) { }

  /**** COLUMN */
  __mis__Trend__Column:column[] =  ColumnTrend.column;
  /*****END */

  /**** Holding Trend Report Master Data */
  __mis__Trend__Report:IMisTrend[] = [];
  /*****End */

  ngOnInit(): void {}

  searchFilter = (ev) =>{
    const {mis_month,...rest} = ev /* Object without mis_month */
    this.dbIntr.api_call(1,'/showMonthlyMisTrandReport',this.utility.convertFormData(rest))
    // .pipe(pluck('data'))
    .subscribe(res =>{
      console.log(res);
    })
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
