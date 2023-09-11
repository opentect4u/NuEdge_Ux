import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, pluck } from 'rxjs/operators';
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
    date_range: new FormControl(''),
    ex_id: new FormControl('',[Validators.required]),
    benchmark: new FormControl('',[Validators.required]),
    month:new FormControl(''),
  });

  minDate: Date;

  maxDate: Date;

  exchangeMstDt: Iexchange[] = [];

  periods_type: Iperiods[] = periods;

  scmbrnchMstDt: Partial<IschemeBenchmark>[] = [];

  column: column[] = schemeBenchmarkcolumn.column;

  benchmark: Ibenchmark[] = [];

  settings = this.utility.settingsfroMultiselectDropdown(
    'id',
    'benchmark',
    'Search benchmark'
  );

  constructor(private dbIntr: DbIntrService,private utility:UtiliService) {}

  ngOnInit(): void {
    this.getExhangeDt();
    // setTimeout(() => {
    //   this.scmbenchmarkFrm
    //     .get('date_periods')
    //     .setValue('D', { emitEvent: true });
    //     this.getschemebenchmarkReport();
    // }, 500);
    this.maxDate = dates.calculateDates('T');
    this.minDate = dates.calculateDates('P');
  }

  ngAfterViewInit() {

    this.scmbenchmarkFrm.controls['date_periods'].valueChanges.subscribe(res =>{
      this.scmbenchmarkFrm.controls['month'].setValue('');
      this.scmbenchmarkFrm.get('date_range').setValidators(res == 'D' ? [Validators.required] : null)
      this.scmbenchmarkFrm.get('month').setValidators(res == 'D' ? null : [Validators.required]);
      this.scmbenchmarkFrm.get('date_range').updateValueAndValidity();
      this.scmbenchmarkFrm.get('month').updateValueAndValidity();
    })

     this.scmbenchmarkFrm.controls['benchmark'].valueChanges.subscribe(res =>{
       if(res.length == this.benchmark.length){
        this.scmbenchmarkFrm.get('date_periods').setValue('D');
        this.scmbenchmarkFrm.get('date_periods').disable();
        this.scmbenchmarkFrm.controls['date_range'].setValue('');
       }
       else{
          this.scmbenchmarkFrm.get('date_periods').enable();
       }
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

  setEndDate(){
    if(this.scmbenchmarkFrm.get('benchmark').value.length == this.benchmark.length ){
      this.date_range.toggle();
      this.scmbenchmarkFrm.get('date_range').setValue(
        [this.scmbenchmarkFrm.get('date_range').value[0],new Date(this.scmbenchmarkFrm.get('date_range').value[0])]
      )
    }

  }

  getschemebenchmarkReport = () => {
    if(this.scmbenchmarkFrm.value.benchmark || this.scmbenchmarkFrm.value.ex_id){
      const formdata = new FormData();
      formdata.append('ex_id',global.getActualVal(this.scmbenchmarkFrm.value.ex_id));
      // formdata.append('benchmark',global.getActualVal(this.scmbenchmarkFrm.value.benchmark));
      formdata.append('benchmark',this.utility.mapIdfromArray(this.scmbenchmarkFrm.value.benchmark,'id'));
      if(this.scmbenchmarkFrm.value.date_periods == 'D'){
        formdata.append('date_range',
        global.getActualVal(this.date_range.inputFieldValue));
      }
      else{
        if(this.scmbenchmarkFrm.value.date_periods == 'M'){
        formdata.append('month',global.getActualVal(this.scmbenchmarkFrm.value.month) ?(this.scmbenchmarkFrm.value.month.getMonth() + 1) : '');
        }
       formdata.append('year',global.getActualVal(this.scmbenchmarkFrm.value.month) ? (this.scmbenchmarkFrm.value.month.getFullYear()) : '');
      }
      console.log(this.scmbenchmarkFrm.value.month.getMonth() + 1);
       this.dbIntr.api_call(1,'/benchmarkSchemeDetailSearch',formdata)
       .pipe(
        pluck("data"),
         map((item:{links:any[],data:Partial<IschemeBenchmark>[]})=>{
          console.log(item);
          this.scmbrnchMstDt = item.data;
         })
        )
       .subscribe((res)=>{console.log(res);})
    }
    else{
      this.utility.showSnackbar('Please select either Exchange or benchmark',2);
    }

  };

  getExhangeDt = () => {
    this.dbIntr
      .api_call(0, '/exchange', null)
      .pipe(pluck('data'))
      .subscribe((res: Iexchange[]) => {
        this.exchangeMstDt = res;
      });
  };

  getBenchmarkDt = (ex_id: number) => {
    if (ex_id) {
      this.dbIntr
        .api_call(0, '/benchmark', null)
        .pipe(pluck('data'))
        .subscribe((res: Ibenchmark[]) => {
          this.benchmark = res;
        });
    } else {
      this.benchmark = [];
      this.scmbenchmarkFrm.controls['benchmark'].setValue('');
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
  change: string;
  prev: string;
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
    { field: 'change', header: 'Change', width: '20rem' },
    { field: 'prev', header: '% of change from prv', width: '20rem' },
  ];
}

export interface Iperiods {
  id: string;
  periods: string;
}
