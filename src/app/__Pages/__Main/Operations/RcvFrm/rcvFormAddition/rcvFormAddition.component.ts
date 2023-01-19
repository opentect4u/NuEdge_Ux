import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
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
    euin_to: new FormControl('', [Validators.required]),
    arn_no: new FormControl(this.data.data.arn_no, [Validators.required]),
    rec_datetime: new FormControl(this.__datePipe.transform(new Date(), 'dd/MM/YYYY h:mma'), [Validators.required]),
    product_id: new FormControl('', [Validators.required]),
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
    this.getProductMaster(); 
    this.getEmployeeMaster();
    this.getsubBrokerARNmaster();
  }
  ngAfterViewInit() {

    /******Event occured when product  is changed */
    this.__rcvForm.controls["product_id"].valueChanges.subscribe(res => {
      this.getformTypeByProductId(res);
    });
    /******END */


    /******Event occured when sub broker arn no  is changed */
    this.__rcvForm.controls["sub_arn_no"].valueChanges.subscribe(res => {
      this.getSubBrokersbyArnNo(res);
    })
    /******END */

    /******Event occured when buisness type is changed */
    this.__rcvForm.controls["bu_type"].valueChanges.subscribe(res => {
      if(res == 'B'){
        this.__rcvForm.get('sub_brk_cd').setValidators([Validators.required]);
        this.__rcvForm.get('sub_arn_no').setValidators([Validators.required]);
      }
      else{
        this.__rcvForm.get('sub_brk_cd').clearValidators();
        this.__rcvForm.get('sub_arn_no').clearValidators();
      }
      this.__rcvForm.get('sub_brk_cd').updateValueAndValidity();
      this.__rcvForm.get('sub_arn_no').updateValueAndValidity();
    })
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
    this.__dbIntr.api_call(1, '/formreceivedAdd', this.__rcvForm.value).subscribe((res: responseDT) => {
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
}