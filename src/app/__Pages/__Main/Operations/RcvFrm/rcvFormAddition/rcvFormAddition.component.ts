import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { product } from 'src/app/__Model/__productMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import buisnessType from '../../../../../../assets/json/buisnessType.json';
@Component({
  selector: 'operations-rcvFormAddition',
  templateUrl: './rcvFormAddition.component.html',
  styleUrls: ['./rcvFormAddition.component.css']
})
export class RcvFormAdditionComponent implements OnInit {
  @ViewChild('searchResult') __searchRlt: ElementRef;
  __sub_arn_no: any=[];
  __sub_arn_code: any=[];
  __buisness_type: any = buisnessType;
  __EUIN: any=[];
  __productMaster: product[];
  __empMaster: any = [];
  __formTypeMaster: any = [];
  __rcvForm = new FormGroup({
    sub_brk_cd: new FormControl(''),
    sub_arn_no: new FormControl(''),
    bu_type: new FormControl('', [Validators.required]),
    euin_no: new FormControl('', [Validators.required]),
    application_no: new FormControl(''),
    trans_id: new FormControl('', [Validators.required]),
    pan_no: new FormControl('', [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'),Validators.minLength(10),Validators.maxLength(10)]),
    mobile: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10),Validators.maxLength(10),Validators.pattern("^[0-9]*$")]),
    email: new FormControl('', [Validators.required, Validators.email]),
    euin_from: new FormControl('', [Validators.required]),
    id: new FormControl('')
  });
  constructor(
    private __datePipe: DatePipe,
    public dialogRef: MatDialogRef<RcvFormAdditionComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog
  ) { }

  ngOnInit() { 
    // this.getProductMaster(); 
    // this.getEmployeeMaster();
    // this.getsubBrokerARNmaster();
  }
  ngAfterViewInit() {


    this.__rcvForm.controls['euin_no'].valueChanges.
    pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(dt => dt?.length > 1 ?
        this.__dbIntr.searchItems('/employee', dt)
        : []),
    ).subscribe({
      next: (value) => {
        console.log(value);
      },
      complete: () => console.log(''),
      error: (err) => console.log()
    })

    /******Event occured when product  is changed */
    // this.__rcvForm.controls["product_id"].valueChanges.subscribe(res => {
    //   this.getformTypeByProductId(res);
    // });
    /******END */


    /******Event occured when sub broker arn no  is changed */
    // this.__rcvForm.controls["sub_arn_no"].valueChanges.subscribe(res => {
    //   this.getSubBrokersbyArnNo(res);
    // })
    /******END */

    /******Event occured when buisness type is changed */
    // this.__rcvForm.controls["bu_type"].valueChanges.subscribe(res => {
    //   if(res == 'B'){
    //     this.__rcvForm.get('sub_brk_cd').setValidators([Validators.required]);
    //     this.__rcvForm.get('sub_arn_no').setValidators([Validators.required]);
    //   }
    //   else{
    //     this.__rcvForm.get('sub_brk_cd').clearValidators();
    //     this.__rcvForm.get('sub_arn_no').clearValidators();
    //   }
    //   this.__rcvForm.get('sub_brk_cd').updateValueAndValidity();
    //   this.__rcvForm.get('sub_arn_no').updateValueAndValidity();
    // })
    /**END */
  }

  getProductMaster() {
    this.__dbIntr.api_call(0, '/product', null).pipe(map((x: responseDT) => x.data)).subscribe((res: product[]) => {
      this.__productMaster = res;
    })
  }
  getEmployeeMaster() {
    this.__dbIntr.api_call(0, '/employee', null).pipe(map((x: responseDT) => x.data)).subscribe(res => {
      this.__empMaster = res;
    })
  }

  getformTypeByProductId(product_id) {
    this.__dbIntr.api_call(0, '/showTransInFormRec', 'product_id=' + product_id).pipe(map((x: responseDT) => x.data)).subscribe(res => {
      this.__formTypeMaster = res;
    })
  }
  recieveForm() {
    if (this.__rcvForm.invalid) {
      this.__utility.showSnackbar('Error!! submition failed due to some error',0);
      return;
    }
      const __rcv = new FormData();
    __rcv.append("sub_brk_cd",this.__rcvForm.value.sub_brk_cd)
    __rcv.append("sub_arn_no",this.__rcvForm.value.sub_arn_no)
    __rcv.append("bu_type",this.__rcvForm.value.bu_type)
    __rcv.append("euin_no",this.__rcvForm.value.euin_no)
    __rcv.append("rec_datetime",this.__rcvForm.value.rec_datetime)
    __rcv.append("application_no",this.__rcvForm.value.application_no)
    __rcv.append("trans_id",this.__rcvForm.value.trans_id)
    __rcv.append("pan_no",this.__rcvForm.value.pan_no)
    __rcv.append("mobile",this.__rcvForm.value.mobile)
    __rcv.append("email",this.__rcvForm.value.email)
   __rcv.append("id",this.__rcvForm.value.id)



    this.__dbIntr.api_call(1, '/formreceivedAdd', __rcv).subscribe((res: responseDT) => {
      console.log(res);
      
      if (res.suc == 1) {
        this.__rcvForm.reset();
        this.dialogRef.close(res);
      }
    })
  }
   getsubBrokerARNmaster(){
    this.__dbIntr.api_call(0,'/showsubbroker',null).pipe(map((x: responseDT) => x.data)).subscribe(res => {
         this.__sub_arn_no = res;
    })
   }
   getSubBrokersbyArnNo(arn_no){
        this.__dbIntr.api_call(0,'/subbrocodeUsingarn','arn_no='+ arn_no).pipe(map((x: responseDT) => x.data)).subscribe(res => {
          this.__sub_arn_code = res;
    })
   }
   preventNonumeric(__ev){
    dates.numberOnly(__ev);
  }
  outsideClick(__ev){

  }
}
