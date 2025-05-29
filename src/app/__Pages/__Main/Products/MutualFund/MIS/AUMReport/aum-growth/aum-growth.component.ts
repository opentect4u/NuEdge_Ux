import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { Table } from 'primeng/table';
import { pluck } from 'rxjs/operators';
import { ChartWithCategories } from 'src/app/__Core/chart/chart.component';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'app-aum-growth',
  templateUrl: './aum-growth.component.html',
  styleUrls: ['./aum-growth.component.css']
})
export class AumGrowthComponent implements OnInit {
  selectNumber:number[] = [];
  
  @ViewChild('dt') primeTbl:Table
  finYear:string[] = [];
  chartData:ChartWithCategories;
  column:column[] = GrowthColumn.columns;
  dataSource:IGrowthDataSource[] = [];
 
  aum_report_growth_filter_frm = new FormGroup({
      finYear: new FormControl(""),
      month_for:new FormControl(''),
  });
  constructor(private utility:UtiliService,private dbIntr:DbIntrService) { }

  ngOnInit(): void {
   this.getFinancialYearByNumber();
   const range = Array.from({ length: 12 }, (_, i) => i + 1);
   this.selectNumber = range;
  }


  getFinancialYearByNumber = () =>{
    try{
      const year = global.getAllFinancialYears(5);
      this.finYear = [...year,"Last 5 Year"];
      this.finYear = [...year,"Last 5 Year",'YTD',"Month"];
      this.aum_report_growth_filter_frm.patchValue({finYear:this.finYear[0]});
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
      if( this.aum_report_growth_filter_frm.value.finYear == 'Month' && !this.aum_report_growth_filter_frm.value.month_for){
        this.utility.showSnackbar('Please provide month for',2);
        return;
      }

      const fd = new FormData();
      this.chartData = null;
      this.dataSource = [];
      fd.append('fin_year',this.aum_report_growth_filter_frm.value.finYear);
      fd.append('month_for',this.aum_report_growth_filter_frm.value.finYear == 'Month' ? this.aum_report_growth_filter_frm.value.month_for : '');
      const finYear  = this.aum_report_growth_filter_frm.value.finYear
      this.dbIntr.api_call(1,'/clients/aumGrowth',fd)
      .pipe(pluck('data'))
      .subscribe((res:any) =>{
          console.log(res)
         
        if(Object.keys(res).length > 0){
            let chart_dt = [];
            let result = [];
            const categories = Object.keys(res).sort().slice(1);
            categories.forEach((key)=>{
                chart_dt.push({name: finYear == 'Last 5 Year' ? key :   moment(key).format('MMM YYYY'),y:Number(res[key])})
            });
            this.chartData = {
              categories:categories.map(el => finYear == 'Last 5 Year' ? el :   moment(el).format('MMM YYYY')).reverse(),
              chart_data:chart_dt
            }
            const keys = Object.keys(res).sort();
            keys.forEach((item, index) => {
                if (index === 0) {
                    result.push({
                      date:item,
                      isPositive:null,
                      // month:finYear == 'Last 5 Year' ? item :   moment(item).format('MMM YYYY'),
                      month:item,
                      aumChange: null,
                      aum:res[item]
                    });
                }
                else{
                  const aumChange = res[item] - res[keys[index - 1]];
                  result.push({ 
                    date:item,
                    isPositive:aumChange > 0,
                    // month:finYear == 'Last 5 Year' ? item :   moment(item).format('MMM YYYY'),
                    month:item,
                    aumChange:Number(aumChange.toFixed(2)),
                    aum:res[item]
                  });
                }
                
              });
              this.dataSource = result.slice(1);
              console.log(result)
          }
          else{
            this.utility.showSnackbar(`No data available in selected financial year`,2)
          }
        })
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
    isPositive:any;
    // sl_no:number;
}
