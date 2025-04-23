import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { Table } from 'primeng/table';
import { ChartWithCategories } from 'src/app/__Core/chart/chart.component';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'app-aum-growth',
  templateUrl: './aum-growth.component.html',
  styleUrls: ['./aum-growth.component.css']
})
export class AumGrowthComponent implements OnInit {
  
  @ViewChild('dt') primeTbl:Table
  finYear:string[] = [];
  chartData:ChartWithCategories;
  column:column[] = GrowthColumn.columns;
  dataSource:IGrowthDataSource[] = [];
 
  aum_report_growth_filter_frm = new FormGroup({
      finYear: new FormControl(""),
  });
  constructor(private utility:UtiliService) { }

  ngOnInit(): void {
   this.getFinancialYearByNumber();
  }

  getFinancialYearByNumber = () =>{
    try{
      const year = global.getAllFinancialYears(5);
      this.finYear = [...year,"Last 5 Year"];
      this.aum_report_growth_filter_frm.patchValue({finYear:this.finYear[0]});
      let dt = [];
      const category = this.getMonthsInFinancialYear(this.finYear[1]);
      category.forEach(el =>{
          dt.push({
              name:el,
              y:2162708248.55,
          })
      });
      this.chartData = {
        categories:category,
        chart_data:dt
      }
    }
    catch(err){
      console.log(err);
    }
  }


  getMonthsInFinancialYear(fyString) {
    const [startYear, endYear] = fyString.split('-').map(Number);
    const today = moment();
    const isCurrentFY = (() => {
      const fyStart = moment(`${startYear}-04-01`);
      const fyEnd = moment(`${endYear}-03-31`);
      return today.isBetween(fyStart, fyEnd, 'day', '[]');
    })();
    const startDate = moment(`${startYear}-04-01`);
    const endDate = isCurrentFY ? moment().startOf('month') : moment(`${endYear}-03-31`);
    const months = [];
    const current = startDate.clone();
    while (current.isSameOrBefore(endDate, 'month')) {
      months.push(current.format('MMMM YYYY'));
      current.add(1, 'month');
    }
    return months;
  }

  getColumns(){
    return this.utility.getColumns(this.column)
  }
  
  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }


  clickToSend = () =>{
      console.log(this.aum_report_growth_filter_frm.value);
  }
}

export class GrowthColumn{
    public static columns:column[] = [
      {
        field:'sl_no',
        header:'Sl No.',
        width:''
      },
      {
        field:'month',
        header:'Month',
        width:''
      },
      {
        field:'aum',
        header:'AUM',
        width:''
      },
      {
        field:'trend',
        header:'Trend',
        width:''
      },
    ]
}

export interface IGrowthDataSource{
    aum:number;
    month:string;
    trend:any;
    sl_no:number;
}
