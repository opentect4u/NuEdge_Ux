import { Component, Input, OnInit } from '@angular/core';
import * as HighCharts from 'highcharts/highstock';
import Accessibility from 'highcharts/modules/accessibility';
/** For Remove Warning in production server */
Accessibility(HighCharts);
@Component({
  selector: 'core-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  chartOptions: any;

  highcharts: typeof HighCharts = HighCharts;

  @Input() set getChartDetails(data:ChartWithCategories){
    if(data)
      this.barChart(data.categories,data?.chart_data)
  }

  constructor() { }

  ngOnInit(): void {
    // this.barChart();
  }

  barChart(category:string[],data:IChartData[]){
    this.chartOptions={
      chart:{
          type:'column',
      },
      title:{
        text:'Monthly MIS Trend'
      },
      subtitle:{
        text:'Source nuedgecorporate.co.in'
      },
      xAxis:{
        categories:category,
        title: {
          text: 'MIS Trend'
      }
      },
     series:data.map(item=> ({...item,data:item.data.map(el => ({y:el,color: el < 0 ? '#fe6a35' : (item.name == 'Monthly Inflow' ? '#2caffe' : (item.name == 'Monthly Outflow' ? '#6b8abc' : '#00e272'))}))}))
    }
  }

}

export interface IChartData{
  name:string;
  data:number[]
}

export class ChartWithCategories{
    chart_data:IChartData[]
    categories:string[]
}
