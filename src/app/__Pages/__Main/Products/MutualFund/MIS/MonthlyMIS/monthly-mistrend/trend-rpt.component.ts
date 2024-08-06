import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { ChartWithCategories, IChartData } from 'src/app/__Core/chart/chart.component';
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

  date_pipe =  new DatePipe('en-Us');

  __view_by:string = 'M'

  __period_type:string;

  /**** COLUMN */
  __mis__Trend__Column:column[] =  ColumnTrend.column;
  /*****END */

  disclaimer:string | undefined = '';

  __chart__data:ChartWithCategories;

  /**** Holding Trend Report Master Data */
  // __mis__Trend__Report:IMisTrend[] = [];
  __mis__Trend__Report:Partial<IMisTrend>[] = []
  /*****End */

  ngOnInit(): void {}

  searchFilter = (ev) =>{
    console.log(ev)
    this.__view_by = ev.view_by;
    this.__period_type = ev.period_type
    // return ;
    if(ev.view_by == 'M'){
        if(!ev.month_year){
          this.utility.showSnackbar('Month & year can not be empty',2);
          return;
        }
        else{
          if(ev.month_year.split('-').length < 2){
            this.utility.showSnackbar('Please select vaild month & year range',2);
            return;
          }
        }
    }
    const {mis_month,month,...rest} = ev /* destructuring Object*/
    this.__mis__Trend__Report = [];
    this.dbIntr.api_call(1,'/showMonthlyMisTrandReport',this.utility.convertFormData(rest))
    .pipe(pluck('data'))
    .subscribe((res:IActualMISTrend) =>{
      const dt = [];
      this.disclaimer = res.disclaimer;
      res.categories.pop();
      res.chart_data.map((el:IChartData) => ({name:el.name,data:el.data.splice(-1)}))
      this.__chart__data = {
            // categories:res.categories.map(el => this.date_pipe.transform(el,'MMM-YYYY')),
            categories:res.categories,
            chart_data:res.chart_data.map((el:IChartData) => ({name:el.name,data:el.data.map(item => Number(item.toFixed(2)))}))
      }
      res.table_data.forEach((el:IMisTrend,index:number) =>{
        let perGrowth = 0, ratio = 0;
          if(index != (res.table_data.length - 1)){
            let old_monthly_net_inflow = res.table_data[index + 1].monthly_net_inflow
            if( old_monthly_net_inflow != 0 && el.monthly_net_inflow != 0){
                  perGrowth =  ((((el.monthly_net_inflow - old_monthly_net_inflow)) / old_monthly_net_inflow) * 100);
                  ratio = el.monthly_net_inflow / el.monthly_inflow
              }
        }
        dt.push({...el,per_of_growth:perGrowth,ratio:ratio})
      })
      dt.pop();
      this.__mis__Trend__Report = dt;
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
      header:'Duration'
    },
    {
      field:'monthly_inflow',
      header:'Gross Inflow'
    },
    {
      field:'monthly_outflow',
      header:'Outflow'
    },
    {
      field:'monthly_net_inflow',
      header:'Net Inflow'
    },
    {
      field:'ratio',
      header:'Inflow Outflow Ratio'
    },
    {
      field:'per_of_growth',
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
    monthly_inflow:number;
    monthly_outflow:number;
    monthly_net_inflow:number;
    per_of_growth:number;
    trend:string;
    ratio:number;
}

export interface IActualMISTrend{
  categories:string[]
  chart_data:{name:string,data:number[]}[]
  table_data:IMisTrend[],
  disclaimer:string | undefined
}
