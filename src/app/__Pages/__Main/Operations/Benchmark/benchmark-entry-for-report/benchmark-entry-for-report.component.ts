import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { pluck, skip } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { Iexchange } from '../../../Master/exchange/exchange.component';
// import { Ibenchmark } from '../../../Master/benchmark/benchmark.component';
import { IschemeBenchmark } from '../../../Products/MutualFund/ScmBenchMarkRpt/scm-bench-mark-rpt.component';
import { Ibenchmark } from '../../../Master/benchmark/home/home.component';

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
    ex_id: new FormControl('',[Validators.required]),
    benchmark:new FormControl('',[Validators.required]),
    date: new FormControl('',[Validators.required]),
    open:new FormControl(''
    //, [Validators.required]
    ),
    high:new FormControl(''

    //    ,[Validators.required]
    ),
    low:new FormControl(''
    // ,[Validators.required]
    ),
    close: new FormControl('',[Validators.required]),
    id: new FormControl('0')
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

  /** This function is used to minimize the dialog box*/
  minimize(){
    this.dialogRef.updateSize("30%",'47px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }

  /** This function is used to maximize the dialog box*/
  maximize(){
    this.dialogRef.updateSize("40%");
    this.__isVisible = !this.__isVisible;
  }

  /** This function is used to toggle the dialog box into fullscreen*/
  fullScreen(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }


  /**
   * Fetches the exchange master data from the database
   * and populates the exchangeMstDt array with the retrieved data.
   * This function is called during the component's initialization to ensure
   * that the exchange data is available for selection in the form.
   */
  getechangeMstDt = () =>{
    this.__dbIntr.api_call(0,'/exchange',null)
    .pipe(pluck('data'))
    .subscribe((res:Iexchange[]) =>{
        this.exchangeMstDt = res;
    })
  }

  /** * Fetches the benchmark data based on the selected exchange ID.
 * If an exchange ID is provided, it makes an API call to retrieve the benchmark data
 * and populates the benchmark array with the retrieved data.
 * If no exchange ID is provided, it clears the benchmark array
 * and resets the benchmark form control to an empty value.
 * @param ex_id - The ID of the selected exchange.
 */
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

  /**
   * Logs the current values of the benchmark report form to the console.
   * This function is typically used for debugging purposes to check the form values.
   * It can be called when the user wants to see the current state of the form data.
   */
  getBenchmark = () =>{
    console.log(this.benchmarkRptFrm.value)
  }

  /**
   * Submits the benchmark report form data to the server.
   * It makes an API call to the '/benchmarkSchemeAddEdit' endpoint with the form data.
   * If the submission is successful, it shows a success message and closes the dialog,
   * passing the submitted data back to the parent component.
   * If there is an error, it shows an error message.
   */
  submitBenchmark = () =>{
    this.__dbIntr.api_call(1,'/benchmarkSchemeAddEdit',this.__utility.convertFormData(this.benchmarkRptFrm.value))
    .subscribe((res:any) =>{
       console.log(res.data);
       this.__utility.showSnackbar(res.suc == 1 ? 'Scheme benchmark submitted successfully' : res.msg,res.suc)
        if(res.suc == 1 ){
          this.dialogRef.close(res.data);
        }
      })
  }

}
