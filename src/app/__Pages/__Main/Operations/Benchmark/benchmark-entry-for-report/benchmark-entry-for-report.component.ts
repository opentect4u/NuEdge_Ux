import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { pluck, skip } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { Iexchange } from '../../../Master/exchange/exchange.component';
import { Ibenchmark } from '../../../Master/benchmark/benchmark.component';

@Component({
  selector: 'app-benchmark-entry-for-report',
  templateUrl: './benchmark-entry-for-report.component.html',
  styleUrls: ['./benchmark-entry-for-report.component.css']
})
export class BenchmarkEntryForReportComponent implements OnInit {

  __isVisible:boolean = false;

  exchangeMstDt:Iexchange[] = [];

  benchmark:Ibenchmark[] = [];



  benchmarkRptFrm = new FormGroup({
    ex_id: new FormControl(''),
    benchmark:new FormControl(''),
    date: new FormControl(''),
    open:new FormControl(''),
    high:new FormControl(''),
    low:new FormControl(''),
    close: new FormControl('')
  })

  constructor(
    public dialogRef: MatDialogRef<BenchmarkEntryForReportComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog
  ) {
    this.__utility.__isvisibleMenuIcon$.pipe(skip(1)).subscribe(res =>{
      if(this.data.id == res.id && this.data.flag == res.flag){
        this.__isVisible = res.isVisible
      }
    })
   }

  ngOnInit(): void {this.getechangeMstDt();}

  ngAfterViewInit(){
    this.benchmarkRptFrm.controls['ex_id'].valueChanges.subscribe((res) => {
      this.getBenchmarkDt(res);
    });
  }

  minimize(){
    this.dialogRef.updateSize("30%",'55px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }

  maximize(){
    this.dialogRef.updateSize("40%");
    this.__isVisible = !this.__isVisible;
  }

  fullScreen(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }


  getechangeMstDt = () =>{
    this.__dbIntr.api_call(0,'/exchange',null)
    .pipe(pluck('data'))
    .subscribe((res:Iexchange[]) =>{
        this.exchangeMstDt = res;
    })
  }

  getBenchmarkDt = (ex_id: number) => {
    if (ex_id) {
      this.__dbIntr
        .api_call(0, '/benchmark', null)
        .pipe(pluck('data'))
        .subscribe((res: Ibenchmark[]) => {
          this.benchmark = res;
        });
    } else {
      this.benchmark = [];
      this.benchmarkRptFrm.controls['benchmark'].setValue('');
    }
  };

  getBenchmark = () =>{
    console.log(this.benchmarkRptFrm.value)
  }

}
