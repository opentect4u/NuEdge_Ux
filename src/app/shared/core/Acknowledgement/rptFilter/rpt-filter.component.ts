import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { dates } from 'src/app/__Utility/disabledt';
import buType from '../../../../../assets/json/buisnessType.json';
import kycLoginType from '../../../../../assets/json/kycloginType.json';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import loggedStatus from '../../../../../assets/json/loginstatus.json';
import updateStatus from '../../../../../assets/json/updateStatus.json';
type selectBtn ={
  label:string,
  value:string,
  icon:string
}
@Component({
  selector: 'kyc-rpt-filter',
  templateUrl: './rpt-filter.component.html',
  styleUrls: ['./rpt-filter.component.css']
})
export class RptFilterComponent implements OnInit {
  UpdateStatus = updateStatus;
  __logggedInStatus =loggedStatus;
  settings = this.__utility.settingsfroMultiselectDropdown('id','rnt_name','Search');
  selectBtn:selectBtn[] = [];
  @ViewChildren('buTypeChecked') private __buTypeChecked: QueryList<ElementRef>;
  @ViewChild('searchTin') __searchTin: ElementRef;
  @ViewChild('clientCd') __clientCode: ElementRef;
  @ViewChild('searchEUIN') __searchRlt: ElementRef;
  @ViewChild('subBrkArn') __subBrkArn: ElementRef;

  __isTinspinner: boolean = false;
  __isClientPending: boolean = false;
  __isSubArnPending: boolean = false;
  __isEuinPending: boolean = false;

  tinMst:any=[];
  __clientMst: client[]= [];
__subbrkArnMst: any =[];
__euinMst: any =[];
__bu_type: any=buType;
__kycLoginType = kycLoginType;
__kycLoginAt: any=[];
  @Input() mode: string;
  @Input() isDaySheet: boolean = true;
  @Input() isDatePeriod: boolean;
  @Output() getKycMst = new EventEmitter<any>();
  @Output() resetKycMst = new EventEmitter<any>();
  @Output() setClms = new EventEmitter<any>();
  @Input() RPTFor:string;
  __isAdd: boolean =false;
  __kycFilterForm = new FormGroup({
    is_all: new FormControl(false),
    is_all_mu: new FormControl(false),
    is_all_bu_type: new FormControl(false),
    options: new FormControl('2'),
    btnType: new FormControl('R'),
    date_range: new FormControl(''),
    sub_brk_cd: new FormControl(''),
    tin_no: new FormControl(''),
    client_code: new FormControl(''),
    client_name: new FormControl(''),
    euin_no: new FormControl(''),
    brn_cd: new FormControl(''),
    // bu_type: new FormArray([]),
    date_status: new FormControl('T'),
    start_date: new FormControl(this.getTodayDate()),
    end_date: new FormControl(this.getTodayDate()),
    login_status: new FormControl('N'),
    dt_type:new FormControl(''),
    frm_dt: new FormControl(''),
    to_dt: new FormControl(''),
    kyc_login_at: new FormControl([]),
    kyc_login:new FormControl(''),
    ack_logged_status: new FormArray([]),
    update_status_id: new FormArray([])
  });


  constructor(private __dbIntr: DbIntrService,private __utility: UtiliService) { }

  get ack_logged_status(): FormArray{
    return this.__kycFilterForm.get('ack_logged_status') as FormArray;
  }
  get update_status_id():FormArray{
    return this.__kycFilterForm.get('update_status_id') as FormArray;
  }
  ngOnInit(): void {
    this.submit();
    this.addLoggedStatus();
    this.addUpdateStatus();
    this.setBtn();
  }

  setBtn(){
    // this.selectBtn = (this.RPTFor == 'M' || this.RPTFor == 'A') ? [{ label: 'Reset', value: 'R',icon:'pi pi-refresh' }]
    // : [{ label: 'Advance Filter', value: 'A',icon:'pi pi-filter' }, { label: 'Reset', value: 'R',icon:'pi pi-refresh' }]
    this.selectBtn = [{ label: 'Reset', value: 'R',icon:'pi pi-refresh' }];
  }

 addUpdateStatus(){
  if(this.RPTFor == 'M'){
   this.UpdateStatus.forEach(el =>{
    this.update_status_id.push(this.setLoggedStatusFormData(el));
   })
  }
 }

  addLoggedStatus(){
    if(this.RPTFor == 'A'){
      this.__logggedInStatus.forEach(el =>{
        this.ack_logged_status.push(this.setLoggedStatusFormData(el));
    })
    }

  }
  ngOnChanges(simple: SimpleChanges){
    console.log(simple);
    if(simple.isDatePeriod.currentValue){

    }
    else{
      this.__kycFilterForm.patchValue({
        frm_dt: this.getTodayDate(),
        to_dt: this.getTodayDate(),
       })
    }
  }
  setLoggedStatusFormData(loggedStatus){
   return new FormGroup({
    id:new FormControl(loggedStatus ? loggedStatus.id : 0),
    name:new FormControl(loggedStatus ? loggedStatus.name : 0),
    value:new FormControl(loggedStatus ? loggedStatus.value : ''),
    isChecked:new FormControl(false)
   })
  }
  getMinDate() {
      return new Date(dates.getminDate());
  }

  getKycLoginAtMaster(kyc_login){

    this.__dbIntr.api_call(0, kyc_login == 'A' ? '/amc' : '/rnt', null).pipe(map((x: responseDT) => x.data)).subscribe(res => {
       this.__kycLoginAt.length = 0;
       this.__kycFilterForm.get('kyc_login_at').setValue([]);
      this.setKycLoginAtAccordingToKycLogin(kyc_login,res);
      this.settings = this.__utility.settingsfroMultiselectDropdown('id',(kyc_login == 'A' ? 'amc_short_name' : 'rnt_name'),'Search');

    })
  }
  setKycLoginAtAccordingToKycLogin(kyc_login_type,res){
    if(res.length > 0){
       switch(kyc_login_type){
        case 'R' : this.__kycLoginAt = res.filter(x => ([1,2]).includes(x.id));
        break;
        case 'A' : this.__kycLoginAt = res;
        break;
        default:this.__kycLoginAt = res.filter(x => x.id >= 39);
        break;
       }
    }
    else{
     this.__kycLoginAt = res;
    }
}
  ngAfterViewInit(){
    this.__kycFilterForm.controls['dt_type'].valueChanges.subscribe((res) => {
      this.__kycFilterForm.controls['date_range'].reset(
        res && res != 'R' ? ([new Date(dates.calculateDT(res)),new Date(dates.getTodayDate())]) : ''
      );
      this.__kycFilterForm.controls['frm_dt'].reset(
        res && res != 'R' ? dates.calculateDT(res) : ''
      );
      this.__kycFilterForm.controls['to_dt'].reset(
        res && res != 'R' ? dates.getTodayDate() : ''
      );
      if (res && res != 'R') {
        this.__kycFilterForm.controls['date_range'].disable();
      } else {
        this.__kycFilterForm.controls['date_range'].enable();
      }
    });

    this.__kycFilterForm.controls['options'].valueChanges.subscribe((res) => {
      this.setClms.emit(this.__kycFilterForm.getRawValue());
  });

    this.__kycFilterForm.get('kyc_login').valueChanges.subscribe(res => {
      switch (res) {
        case 'A':
          this.getKycLoginAtMaster(res); break;
        case 'N':
        case 'R':
        this.getKycLoginAtMaster(res); break;

        default: break;
      }
    })
    // EUIN NUMBER SEARCH
      this.__kycFilterForm.controls['euin_no'].valueChanges
      .pipe(
        tap(() => (this.__isEuinPending = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.searchItems('/employee', dt) : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__euinMst = value;
          this.searchResultVisibility('block');
          this.__isEuinPending = false;
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isEuinPending = false;
        },
      });
      // End

       /**change Event of sub Broker Arn Number */
       this.__kycFilterForm.controls['sub_brk_cd'].valueChanges
       .pipe(
         tap(() => (this.__isSubArnPending = true)),
         debounceTime(200),
         distinctUntilChanged(),
         switchMap((dt) =>
           dt?.length > 1 ? this.__dbIntr.searchItems('/showsubbroker', dt) : []
         ),
         map((x: responseDT) => x.data)
       )
       .subscribe({
         next: (value) => {
           this.__subbrkArnMst = value;
           this.searchResultVisibilityForSubBrk('block');
           this.__isSubArnPending = false;
         },
         complete: () => console.log(''),
         error: (err) => {
           this.__isSubArnPending = false;
         },
       });



          /** Client Code Change */
          this.__kycFilterForm.controls['client_name'].valueChanges
          .pipe(
            tap(() => (this.__isClientPending = true)),
            debounceTime(200),
            distinctUntilChanged(),
            switchMap((dt) =>
              dt?.length > 1 ? this.__dbIntr.searchItems('/client', dt) : []
            ),
            map((x: any) => x.data)
          )
          .subscribe({
            next: (value) => {
              this.__clientMst = value.data;
              this.searchResultVisibilityForClient('block');
              this.__isClientPending = false;
            },
            complete: () => {},
            error: (err) => {
              this.__isClientPending = false;
            },
          });

          /** End */

     // Tin Number Search
     this.__kycFilterForm.controls['tin_no'].valueChanges
     .pipe(
       tap(() => (this.__isTinspinner = true)),
       debounceTime(200),
       distinctUntilChanged(),
       switchMap((dt) =>
         dt?.length > 1
           ? this.__dbIntr.ReportTINSearch('/kyc', dt)
           : []
       ),
       map((x: responseDT) => x.data)
     )
     .subscribe({
       next: (value) => {
         this.tinMst = value;
         this.searchResultVisibilityForTin('block');
         this.__isTinspinner = false;
       },
       complete: () => console.log(''),
       error: (err) => (this.__isTinspinner = false),
     });

    // this.__kycFilterForm.controls['is_all_bu_type'].valueChanges.subscribe((res) => {
    //   const bu_type: FormArray = this.__kycFilterForm.get('bu_type') as FormArray;
    //   bu_type.clear();
    //   if (!res) {
    //     this.uncheckAll_buType();
    //   } else {
    //     this.__bu_type.forEach((__el) => {
    //       bu_type.push(new FormControl(__el.id));
    //     });
    //     this.checkAll_buType();
    //   }
    // });
        /** Change event occur when all rnt checkbox has been changed  */
        this.__kycFilterForm.controls['is_all'].valueChanges.subscribe(res =>{
          this.ack_logged_status.controls.map(item => {return item.get('isChecked').setValue(res,{emitEvent:false})});
        })
        /** End */

        /** Change event inside the formArray */
        this.ack_logged_status.valueChanges.subscribe(res =>{
        this.__kycFilterForm.controls['is_all'].setValue(res.every(item => item.isChecked),{emitEvent:false});
        })
        /*** End */

        /** Change event occur when all rnt checkbox has been changed  */
        this.__kycFilterForm.controls['is_all_mu'].valueChanges.subscribe(res =>{
          this.update_status_id.controls.map(item => {return item.get('isChecked').setValue(res,{emitEvent:false})});
        })
        /** End */

        /** Change event inside the formArray */
        this.update_status_id.valueChanges.subscribe(res =>{
        this.__kycFilterForm.controls['is_all_mu'].setValue(res.every(item => item.isChecked),{emitEvent:false});
        })
        /*** End */
  }
  getTodayDate(){
    return dates.getTodayDate();
  }
  submit(){
   this.getKycMst.emit(this.__kycFilterForm.value);
  }
  reset(){
    this.__kycFilterForm.get('options').setValue('2');
    this.__kycFilterForm.patchValue({
      start_date:this.getTodayDate(),
      end_date: this.getTodayDate(),
      date_range:'',
      sub_brk_cd:'',
      tin_no:'',
      client_code:'',
      date_status:'T',
      login_status:'N',
      kyc_login_at:[],
      kyc_login:'',
    });
    this.__kycFilterForm.get('is_all').setValue(false);
    this.__kycFilterForm.get('is_all_mu').setValue(false);

    this.resetKycMst.emit(this.__kycFilterForm.value);
  }
  // uncheckAll_buType() {
  //   this.__buTypeChecked.forEach((element: any) => {
  //     element.checked = false;
  //   });
  // }
  // checkAll_buType() {
  //   this.__buTypeChecked.forEach((element: any) => {
  //     element.checked = true;
  //   });
  // }
  /* For TIN Result Hide */
  outsideClickforTin(__ev) {
    if (__ev) {
      this.searchResultVisibilityForTin('none');
    }
  }
  searchResultVisibilityForTin(display_mode) {
    this.__searchTin.nativeElement.style.display = display_mode;
  }
  /* END */

  /** For Client Hide */
  outsideClickforClient(__ev) {
    if (__ev) {
      this.searchResultVisibilityForClient('none');
    }
  }
  searchResultVisibilityForClient(display_mode) {
    this.__clientCode.nativeElement.style.display = display_mode;
  }
  /* END */

  /** Sub Broker Code Hide */
  outsideClickforSubBrkArn(__ev) {
    if (__ev) {
      this.searchResultVisibilityForSubBrk('none');
    }
  }
  searchResultVisibilityForSubBrk(display_mode) {
    this.__subBrkArn.nativeElement.style.display = display_mode;
  }
  /** End */

  /** EUIN Hide */
  outsideClick(__ev) {
    if (__ev) {
      this.searchResultVisibility('none');
    }
  }
  searchResultVisibility(display_mode) {
    this.__searchRlt.nativeElement.style.display = display_mode;
  }
  /** End */

  getItems(__items, __mode) {
    switch (__mode) {
      case 'C':
        this.__kycFilterForm.controls['client_code'].reset(__items.id, {
          emitEvent: false,
        });
        this.__kycFilterForm.controls['client_name'].reset(__items.client_name, {
          emitEvent: false,
        });
        this.searchResultVisibilityForClient('none');
        break;
        case 'E':
            this.__kycFilterForm.controls['euin_no'].reset(__items.emp_name, {
            emitEvent: false,
        });
        this.searchResultVisibility('none');
        break;
      case 'T':
        this.__kycFilterForm.controls['tin_no'].reset(__items.tin_no, {
          emitEvent: false,
        });
        this.searchResultVisibilityForTin('none');
        break;
      case 'S':
        this.__kycFilterForm.controls['sub_brk_cd'].reset(__items.code, {
          emitEvent: false,
        });
        this.searchResultVisibilityForSubBrk('none');
        break;
    }
  }
  // onbuTypeChange(e: any){
  //   const bu_type: FormArray = this.__kycFilterForm.get('bu_type') as FormArray;
  //   if (e.checked) {
  //     bu_type.push(new FormControl(e.source.value));
  //   } else {
  //     let i: number = 0;
  //     bu_type.controls.forEach((item: any) => {
  //       if (item.value == e.source.value) {
  //         bu_type.removeAt(i);
  //         return;
  //       }
  //       i++;
  //     });
  //   }
  //   this.__kycFilterForm.get('is_all_bu_type').setValue(
  //     bu_type.controls.length == 3 ? true : false,
  //     { emitEvent: false }
  //   );
  // }
  getminDate(){
    return dates.getminDate();
  }
  onItemClick(ev){
    if(ev.option.value == 'A'){
      //Advance Filter
      this.__isAdd=!this.__isAdd;
    }
    else{
      //Reset
      this.reset();
    }
  }
  close(ev){
    this.__kycFilterForm.patchValue({
      frm_dt: this.__kycFilterForm.getRawValue().date_range ? dates.getDateAfterChoose(this.__kycFilterForm.getRawValue().date_range[0]) : '',
      to_dt: this.__kycFilterForm.getRawValue().date_range ? (global.getActualVal(this.__kycFilterForm.getRawValue().date_range[1]) ?  dates.getDateAfterChoose(this.__kycFilterForm.getRawValue().date_range[1]) : '') : ''
    });
}
}
