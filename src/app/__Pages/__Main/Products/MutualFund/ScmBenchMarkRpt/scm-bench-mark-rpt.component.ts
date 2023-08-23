import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { pluck } from 'rxjs/operators';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import periods from '../../../../../../assets/json/datePeriods.json';
import { dates } from 'src/app/__Utility/disabledt';
import { Iexchange } from '../../../Master/exchange/exchange.component';
import { Ibenchmark } from '../../../Master/benchmark/benchmark.component';
import { Table } from 'primeng/table';
import { UtiliService } from 'src/app/__Services/utils.service';
import { Calendar } from 'primeng/calendar';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'app-scm-bench-mark-rpt',
  templateUrl: './scm-bench-mark-rpt.component.html',
  styleUrls: ['./scm-bench-mark-rpt.component.css'],
})
export class ScmBenchMarkRptComponent implements OnInit, Ischemebenchmarkdtls {

  @ViewChild('primeTbl') primeTbl: Table;

  /**
   *  getAccess of Prime Ng Calendar
   */
  @ViewChild('dateRng') date_range:Calendar;

  scmbenchmarkFrm = new FormGroup({
    date_periods: new FormControl(''),
    date_range: new FormControl(''),
    ex_id: new FormControl(''),
    benchmark: new FormControl(''),
  });

  minDate: Date;

  maxDate: Date;

  exchangeMstDt: Iexchange[] = [];

  periods_type: Iperiods[] = periods;

  scmbrnchMstDt: Partial<IschemeBenchmark>[] = [];

  column: column[] = schemeBenchmarkcolumn.column;

  benchmark: Ibenchmark[];

  constructor(private dbIntr: DbIntrService,private utility:UtiliService) {}

  ngOnInit(): void {
    this.getExhangeDt();
    setTimeout(() => {
      this.scmbenchmarkFrm
        .get('date_periods')
        .setValue('M', { emitEvent: true });
    }, 500);
    this.maxDate = dates.calculateDates('T');
    this.minDate = dates.calculateDates('P');
  }

  ngAfterViewInit() {
    this.scmbenchmarkFrm.controls['date_periods'].valueChanges.subscribe(
      (res) => {
        if (res) {
          this.scmbenchmarkFrm.controls['date_range'].reset(
            res && res != 'R'
              ? [
                  new Date(dates.calculateDT(res)),
                  new Date(dates.getTodayDate()),
                ]
              : ''
          );
        } else {
          this.scmbenchmarkFrm.controls['date_range'].setValue('');
          this.scmbenchmarkFrm.controls['date_range'].disable();
          return;
        }

        if (res && res != 'R') {
          this.scmbenchmarkFrm.controls['date_range'].disable();
        } else {
          this.scmbenchmarkFrm.controls['date_range'].enable();
        }
      }
    );

    this.scmbenchmarkFrm.controls['ex_id'].valueChanges.subscribe((res) => {
      this.getBenchmarkDt(res);
    });
  }

  getschemebenchmarkReport = () => {
    console.log(this.date_range.inputFieldValue);
    // const formdata = new FormData();
    // formdata.append('date_range',global.getActualVal(this.date_range.inputFieldValue));
    // formdata.append('ex_id',global.getActualVal(this.scmbenchmarkFrm.value.ex_id));
    // formdata.append('benchmark',global.getActualVal(this.scmbenchmarkFrm.value.benchmark));

    //  this.dbIntr.api_call(1,'/schemebenchmarkReport',formdata)
    //  .pipe(pluck("data"))
    //  .subscribe((res:Partial<IschemeBenchmark>[])=>{
    //   this.scmbrnchMstDt = res;
    //  })
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
  ex_name: string;
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
    { field: 'date', header: 'Date', width: '20rem' },
    { field: 'ex_name', header: 'Exchange', width: '20rem' },
    { field: 'benchmark', header: 'Symbol', width: '20rem' },
    { field: 'open', header: 'Open', width: '20rem' },
    { field: 'high', header: 'Hight', width: '20rem' },
    { field: 'low', header: 'Low', width: '20rem' },
    { field: 'change', header: 'Change', width: '20rem' },
    { field: 'prev', header: '% of change from prv', width: '20rem' },
  ];
}

export interface Iperiods {
  id: string;
  periods: string;
}
