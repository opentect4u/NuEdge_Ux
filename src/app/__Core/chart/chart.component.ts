import { DatePipe } from '@angular/common';
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

  date_pipe =  new DatePipe('en-Us')

  /** For Column chart  */
  @Input() set getChartDetails(data:ChartWithCategories){
    if(data)
      this.columnChart(data.categories.reverse(),data?.chart_data)
  }
  /*****End */
  @Input() set getbarChartDetails(data:Required<{categories:string[],chart_data:number[]}>){
        if(data)
        this.barChart(data.categories.reverse(),data.chart_data.reverse())
  }


  constructor() { }

  ngOnInit(): void {
    // this.barChart();
  }

  /*** Function for column chart */
  columnChart(category:string[],data:IChartData[]){
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
     series:data.map(item=> ({...item,data:item.data.reverse().map(el => ({y:el,color: el < 0 ? '#fe6a35' : (item.name == 'Monthly Inflow' ? '#2caffe' : (item.name == 'Monthly Outflow' ? '#6b8abc' : '#00e272'))}))}))
    }
  }
  /**** End */

  barChart(category:string[],data:number[]){
    this.chartOptions={
      chart: {
        type: "bar"
      },
      title: {
        text: "Live SIP Of Last 12 Month"
      },
      subtitle: {
        text:
          'Data visualisation for Live SIP'
      },
      xAxis: {
        categories: category.map(item => this.date_pipe.transform(item,'MMM-YYYY')),
        title: {
          text: null
        }
      },
      yAxis: {
        min: 0,
        // title: {
          // text: "In Thousand of Rupees",
          // align: "high"
        // },
        labels: {
          overflow: "justify"
        }
      },
      tooltip: {
        valuePrefix: "Rs. "
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      legend: {
        layout: "vertical",
        align: "right",
        verticalAlign: "top",
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor:
          HighCharts.defaultOptions.legend.backgroundColor || "#FFFFFF",
        shadow: true,
        enabled:false
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name:'values',
          data: data,
        }
      ]
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
