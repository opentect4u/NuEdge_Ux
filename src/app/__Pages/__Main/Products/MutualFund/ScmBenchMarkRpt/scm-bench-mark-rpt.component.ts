import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { concatMap, delay, map, pluck } from 'rxjs/operators';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
// import periods from '../../../../../../assets/json/datePeriods.json';
import { dates } from 'src/app/__Utility/disabledt';
import { Iexchange } from '../../../Master/exchange/exchange.component';
// import { Ibenchmark } from '../../../Master/benchmark/benchmark.component';
import { Table } from 'primeng/table';
import { UtiliService } from 'src/app/__Services/utils.service';
import { Calendar } from 'primeng/calendar';
import { global } from 'src/app/__Utility/globalFunc';
import { Ibenchmark } from '../../../Master/benchmark/home/home.component';
import periods from '../../../../../../assets/json/Product/MF/ScmBenchmark/periods.json';
import { DatePipe } from '@angular/common';
import { from } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
@Component({
  selector: 'app-scm-bench-mark-rpt',
  templateUrl: './scm-bench-mark-rpt.component.html',
  styleUrls: ['./scm-bench-mark-rpt.component.css'],
})
export class ScmBenchMarkRptComponent implements OnInit, Ischemebenchmarkdtls {

  @ViewChild('primeTbl') primeTbl: Table;

  @ViewChild('MYCalendar',{static:true}) my_cal:Calendar;

  /**
   *  getAccess of Prime Ng Calendar
   */
  @ViewChild('dateRng') date_range:Calendar;

  scmbenchmarkFrm = new FormGroup({
    date_periods: new FormControl('D',[Validators.required]),
    date_range: new FormControl(''  ),
    ex_id: new FormControl('',[Validators.required]),
    benchmark: new FormControl('',[Validators.required]),
    month:new FormControl(''),
  });

  minDate: Date;

  maxDate: Date;

  exchangeMstDt: Iexchange[] = [];

  periods_type: Iperiods[] = periods;

  scmbrnchMstDt: Partial<IschemeBenchmark>[] = [];

  lazyScm:Partial<IschemeBenchmark>[] = [];

  column: column[] = schemeBenchmarkcolumn.column;

  benchmark: Ibenchmark[] = [];

  settings = this.utility.settingsfroMultiselectDropdown(
    'id',
    'benchmark',
    'Search benchmark'
  );

  constructor(
    private datePipe:DatePipe,
    private dbIntr: DbIntrService,
    private utility:UtiliService) {}

  ngOnInit(): void {
    this.getExhangeDt();
    // setTimeout(() => {
    //   this.scmbenchmarkFrm
    //     .get('date_periods')
    //     .setValue('D', { emitEvent: true });
    //     this.getschemebenchmarkReport();
    // }, 500);
    this.maxDate = dates.calculateDates('T');
    // this.minDate = dates.calculateDates('P');
    console.log(this.maxDate);
  }

  ngAfterViewInit() {

    this.scmbenchmarkFrm.controls['date_periods'].valueChanges.subscribe(res =>{
      this.scmbenchmarkFrm.controls['month'].setValue('');
      this.scmbenchmarkFrm.get('date_range').setValidators(res == 'D' ? [Validators.required] : null)
      this.scmbenchmarkFrm.get('month').setValidators(res == 'D' ? null : [Validators.required]);
      this.scmbenchmarkFrm.get('date_range').updateValueAndValidity();
      this.scmbenchmarkFrm.get('month').updateValueAndValidity();
      if(res == 'M' || res =='Y'){
        this.maxDate =  this.maxDate = dates.calculateDates('T');
      }

    })

     this.scmbenchmarkFrm.controls['benchmark'].valueChanges.subscribe(res =>{


      // if(res.length == this.benchmark.length){
      //   this.scmbenchmarkFrm.get('date_periods').setValue('D');
      //   this.scmbenchmarkFrm.get('date_periods').disable();
      //   this.scmbenchmarkFrm.controls['date_range'].setValue('');
      //  }

      //  else{
      //     this.scmbenchmarkFrm.get('date_periods').enable();
      //  }

      // this.periods_type = this.getPeriodsBasedonBenchmarkSelection(res.length);

     })

    //  this.scmbenchmarkFrm.controls['date_range']
    //  .valueChanges.subscribe(res =>{
    //        console.log(res);

    //  })

    // this.scmbenchmarkFrm.controls['date_periods'].valueChanges.subscribe(
    //   (res) => {
    //     if (res) {
    //       this.scmbenchmarkFrm.controls['date_range'].reset(
    //         res && res != 'R'
    //           ? [
    //               new Date(dates.calculateDT(res)),
    //               new Date(dates.getTodayDate()),
    //             ]
    //           : ''
    //       );
    //     } else {
    //       this.scmbenchmarkFrm.controls['date_range'].setValue('');
    //       this.scmbenchmarkFrm.controls['date_range'].disable();
    //       return;
    //     }

    //     if (res && res != 'R') {
    //       this.scmbenchmarkFrm.controls['date_range'].disable();
    //     } else {
    //       this.scmbenchmarkFrm.controls['date_range'].enable();
    //     }
    //   }
    // );

    this.scmbenchmarkFrm.controls['ex_id'].valueChanges.subscribe((res) => {
      this.getBenchmarkDt(res);
    });
  }

  setEndDateFormonthly_yearly = () =>{
      // if(this.scmbenchmarkFrm.controls['month'].value[1]){
      //    this.my_cal.toggle();
      // }
  }

  setEndDate(){

    if(this.benchmark.length > 0){
      if(this.scmbenchmarkFrm.get('benchmark').value.length == this.benchmark.length ){
        this.date_range.toggle();
        this.scmbenchmarkFrm.get('date_range').setValue(
          [this.scmbenchmarkFrm.get('date_range').value[0],new Date(this.scmbenchmarkFrm.get('date_range').value[0])]
        )
      }
    }
    this.setMaxDate(this.scmbenchmarkFrm.get('date_range').value[0]);
    if(this.scmbenchmarkFrm.get('date_range').value[1]){
        this.date_range.toggle();
    }
  }
  setMaxDate = (start_date:Date) =>{
    const  dt = new Date(start_date);
    dt.setFullYear(start_date.getFullYear() + 1);
    if(dt > new Date()){
      this.maxDate = dates.calculateDates('T');
    }
    else{
      this.maxDate = dt;
    }
  }

  getPeriodsBasedonBenchmarkSelection = (benchmark_length:number) => {
          if(benchmark_length > 1){
            if(benchmark_length!=this.benchmark.length){
              const flags=['D','F','W'];
              if(this.scmbenchmarkFrm.getRawValue().date_periods == 'D'){
                this.scmbenchmarkFrm.get('date_periods').setValue('');
              }
              return periods.filter(item=> !flags.includes(item.id));
            }
          }
          return periods;

  }

  getschemebenchmarkReport = () => {
    if(this.scmbenchmarkFrm.value.benchmark || this.scmbenchmarkFrm.value.ex_id){
      const formdata = new FormData();
      formdata.append('ex_id',global.getActualVal(this.scmbenchmarkFrm.value.ex_id));
      formdata.append('benchmark',this.utility.mapIdfromArray(this.scmbenchmarkFrm.value.benchmark,'id'));
      formdata.append('periods',this.scmbenchmarkFrm.getRawValue().date_periods);

      if(this.scmbenchmarkFrm.value.date_periods == 'D'){
            formdata.append('date_range',
        global.getActualVal(this.date_range.inputFieldValue));
      }
      else{
        let date_format =`${this.datePipe.transform(this.scmbenchmarkFrm.getRawValue().month[0],(this.scmbenchmarkFrm.getRawValue().date_periods == 'M' ? 'MM/YYYY' : 'YYYY'))}- ${this.datePipe.transform(this.scmbenchmarkFrm.value.month[1],(this.scmbenchmarkFrm.value.date_periods == 'M' ? 'MM/YYYY' : 'YYYY'))}`
        formdata.append('date_range',
        global.getActualVal(date_format));
      }
       this.dbIntr.api_call(1,'/benchmarkSchemeDetailSearch',formdata)
       .pipe(
        pluck("data"),
        map((item:Partial<IschemeBenchmark>[])=>{
          this.scmbrnchMstDt = item;
          // this.populateNav(item);
         })

        )
       .subscribe((res)=>{console.log(res);})
    }
    else{
      this.utility.showSnackbar('Please select either Exchange or benchmark',2);
    }
  };

  populateNav = (res:Partial<IschemeBenchmark>[]) =>{
    from(res)
    .pipe(delay(1000))
    .subscribe(res =>{
      console.log(res);
      this.scmbrnchMstDt.push(res);
    })
  }
  loadSchemeData = (event: LazyLoadEvent) =>{
    console.log(event);
    // setTimeout(() => {
    //   if (this.lazyScm) {
    //     this.scmbrnchMstDt = this.lazyScm.slice(event.first, (event.first + event.rows));
    //     // this.loading = false;
    //   }
    // }, 1000);
  }

  getExhangeDt = () => {
    this.dbIntr
      .api_call(0, '/exchange', null)
      .pipe(pluck('data'))
      .subscribe((res: Iexchange[]) => {
        this.exchangeMstDt = res;
      });
  };

  getBenchmarkDt = (ex_id: number) => {
    this.scmbenchmarkFrm.controls['benchmark'].setValue([]);
    if (ex_id) {
      this.dbIntr
        .api_call(0, '/benchmark', 'ex_id='+ex_id)
        .pipe(pluck('data'))
        .subscribe((res: Ibenchmark[]) => {
          this.benchmark = res;
        });
    } else {
      this.benchmark = [];

    }
  };

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value, 'contains');
  };

  getColumns = () =>{
    return this.utility.getColumns(this.column);

  }
}

export interface Ischemebenchmarkdtls {
  /**
   * Holding Benchmark Data
   */
  benchmark: Ibenchmark[];

  /**
   * Holding exhange Date
   */
  exchangeMstDt: Iexchange[];

  /**
   * Holding Date Periods comming from 'assets/json/datePeriods.json'
   */
  periods_type: Iperiods[];

  /**
   * Holding Column of the table
   */
  column: column[];

  /**
   * Holding Scheme benchmark master data
   */
  scmbrnchMstDt: Partial<IschemeBenchmark>[];

  /**
   * For Holding Max Date And Min Date form Prime Ng Calendar
   */
  minDate: Date;
  maxDate: Date;

  /**
   * get scheme benchmark data from backend
   */
  getschemebenchmarkReport(): void;

  /**
   * get exchange data from backend
   */
  getExhangeDt(): void;

  /**
   * get benchmark data according to exchange from backend
   * @param ex_id
   */
  getBenchmarkDt(ex_id: number): void;
}

export interface IschemeBenchmark {
  id: number;
  date: Date;
  exchange_name: string;
  benchmark: string;
  open: string;
  high: string;
  low: string;
  close: string;
  change_price: string;
  change_percentage: string;
}

export class schemeBenchmarkcolumn {
  public static column: Partial<column[]> = [
    { field: 'sl_no', header: 'Sl No', width: '4rem' },
    { field: 'date', header: 'Date', width: '20rem' },
    { field: 'exchange_name', header: 'Exchange', width: '20rem' },
    { field: 'benchmark', header: 'Symbol', width: '20rem' },
    { field: 'open', header: 'Open', width: '20rem' },
    { field: 'high', header: 'High', width: '20rem' },
    { field: 'low', header: 'Low', width: '20rem' },
    { field: 'close', header: 'Close', width: '20rem' },
    { field: 'change_price', header: 'Change', width: '20rem' },
    { field: 'change_percentage', header: '% of change from prv', width: '20rem' },
  ];
}

export interface Iperiods {
  id: string;
  periods: string;
}
