import { Component, OnInit } from '@angular/core';
import * as HighCharts from 'highcharts/highstock';
import Accessibility from 'highcharts/modules/accessibility';
Accessibility(HighCharts);
@Component({
  selector: 'core-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  chartOptions: any;

  highcharts: typeof HighCharts = HighCharts;

  constructor() { }

  ngOnInit(): void {
    this.barChart();
  }

  barChart(){
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
        categories:[
          '2016','2017','2018','2019'
        ],
        title: {
          text: 'MIS Trend'
      }
      },
     series:this.chartdata
    }
  }

  /***** HighChart Data */
   chartdata = [
    {
      name:'Monthly Inflow',
      data:[6310,72700,3202,7201]
    },
    {
      name:'Monthly Outflow',
      data:[8140,8401,37140,7140]
    },
    {
      name:'Net Inflow',
      data:[12750,8400,654,8520]
    }
   ]
  /******End */

}
