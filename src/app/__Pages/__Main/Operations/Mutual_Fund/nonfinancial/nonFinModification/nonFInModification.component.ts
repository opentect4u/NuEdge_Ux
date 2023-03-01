import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { option } from 'src/app/__Model/option';
import { plan } from 'src/app/__Model/plan';
import { rnt } from 'src/app/__Model/Rnt';
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { scheme } from 'src/app/__Model/__schemeMst';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import buisnessType from '../../../../../../../assets/json/buisnessType.json';
import { CmnDialogForDtlsViewComponent } from '../../common/cmnDialogForDtlsView/cmnDialogForDtlsView.component';
import { DialogForCreateClientComponent } from '../../common/dialogForCreateClient/dialogForCreateClient.component';
import changeStatus from '../../../../../../../assets/json/changeStatus.json';
import dateslist from '../../../../../../../assets/json/dates.json';
import SipFrequency from '../../../../../../../assets/json/SipFrequency.json';
import withoutKycMst from '../../../../../../../assets/json/withoutKyc.json';
import KycMst from '../../../../../../../assets/json/kyc.json';
import transmissionType from '../../../../../../../assets/json/TransmissionType.json';
import { bank } from 'src/app/__Model/__bank';
@Component({
selector: 'nonFInModification-component',
templateUrl: './nonFInModification.component.html',
styleUrls: ['./nonFInModification.component.css']
})
export class NonfinmodificationComponent implements OnInit {

  __isT1Visible: boolean = true;
  __trnsmissionType = transmissionType;
  __SecondClient: client;

  __checkedAmt: any;
  __isAmtcheck:boolean = false;
  __frq = SipFrequency;
  __dates: any= dateslist;
  settings = {
    singleSelection: false,
    idField: 'id',
    textField: 'date',
    enableCheckAll: true,
    selectAllText: 'Select All',
    unSelectAllText: 'Deselect All',
    allowSearchFilter: false,
    limitSelection: -1,
    clearSearchFilter: true,
    maxHeight: 197,
    itemsShowLimit: 31,
    searchPlaceholderText: 'Search',
    noDataAvailablePlaceholderText: 'No recors found',
    closeDropDownOnSelection: false,
    showSelectedItemsAtTop: false,
    defaultOpen: false,
  };
  __issecCldtlsEmpty: boolean = true;

  __kycMst: any[];
  __rnt_login_at: rnt[];
  __changeOfStatus = changeStatus;
  allowedExtensions = ['jpg', 'png', 'jpeg'];
  __stateMst: any=[];
  __distMst: any=[];
  __cityMst: any=[];

  __buisness_type = buisnessType;
  @ViewChild('searchTempTin') __searchTempTin: ElementRef;
  @ViewChild('subBrkArnFrNonFin') __subBrkArn: ElementRef;
  @ViewChild('searchEUIN') __searchEUIN: ElementRef;
  @ViewChild('schemeRes') __schemeRes: ElementRef;
  // @ViewChild('searchbnkOld') __searchbnkOld: ElementRef;
  @ViewChild('clientCdForNonFin') __clientCdForNonFin: ElementRef;
  @ViewChild('searchbnk') __searchbnk: ElementRef;
  @ViewChild('secondclientCd') __secondCl: ElementRef;
  @ViewChild('thirdClName') __thirdClName: ElementRef;
  @ViewChild('thirdclientCd') __thirdCl: ElementRef;

  __isVisible: boolean = false;
  __istemporaryspinner: boolean = false;
  __issubBrkArnspinner: boolean =false;
  __isEuinNumberVisible: boolean =false;
  __isclientVisible: boolean = false;
  __isCldtlsEmpty: boolean = false;
  __isschemeSpinner: boolean = false;
  __isbnkSpinner: boolean = false;
  __isthirdCldtlsEmpty: boolean = true;

  __noofdaystobeAdded:any;
  __dialogDtForScheme: any;
  __dialogDtForClient: any;
  __dialogForExistingBank: any;
  __dialogFornewBank: any;

  __third_clientMst: client[] = [];
  __plnMst: plan[] = [];
  __optionMst: option[] = [];
  __temp_tinMst: any=[];
  __subbrkArnMst: any=[];
  __euinMst: any=[];
  __clientMst: client[] =[]
  __transType: any=[];
  __schemeMst: scheme[] =[];
  __bnkMst: bank[] = [];
  __swpMst: any=[];
  __frequency:any=[];
  __sec_clientMst: client[] = [];

  __isSHowAdditionalTble:boolean = false;
  __ThirdClient: client;

  __mcOptionMenu: any = [
    { flag: 'M', name: 'Minor', icon: 'person_pin' },
    { flag: 'P', name: 'Pan Holder', icon: 'credit_card' },
    { flag: 'N', name: 'Non Pan Holder', icon: 'credit_card_off' },
  ];
constructor(
  public dialogRef: MatDialogRef<NonfinmodificationComponent>,
  private __utility: UtiliService,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private __dbIntr: DbIntrService,
  public __dialog: MatDialog,
  private overlay: Overlay
) {
}
  __nonfinForm = new FormGroup({
        newbnk_micr:new FormControl(''),
        newbnk_name: new FormControl(''),
        newbnk_id: new FormControl(''),
        newbnk_accNo: new FormControl(''),
        oldbnk_micr:new FormControl(''),
        oldbnk_name: new FormControl(''),
        oldbnk_id: new FormControl(''),
        oldbnk_accNo: new FormControl(''),
        duration: new FormControl(''),
        swp_amount: new FormControl(''),
        swp_end_date: new FormControl(''),
        swp_duration: new FormControl(''),
        swp_start_date: new FormControl(''),
        swp_dates: new FormControl(''),
        swp_freq: new FormControl(''),
        stp_type: new FormControl(''),
        swp_type: new FormControl(''),
        redemp_type: new FormControl(''),
        unit_type: new FormControl(''),
        redemp_unit: new FormControl(''),
        redemp_amount: new FormControl(''),
          dist: new FormControl(''),
          state: new FormControl(''),
          city: new FormControl(''),
          pincode: new FormControl(''),
          reason_for_change: new FormControl(''),
          change_status: new FormControl(''),
          new_name: new FormControl(''),
         tin_status: new FormControl('Y',[Validators.required]),
         temp_tin_no: new FormControl('',[Validators.required]),
         bu_type: new FormControl('',[Validators.required]),
         sub_brk_cd: new FormControl(''),
         sub_arn_no: new FormControl(''),
         euin_no: new FormControl('',[Validators.required]),
         client_id: new FormControl('', [Validators.required]),
         client_name: new FormControl('', [Validators.required]),
         client_code: new FormControl('', [Validators.required]),
         trans_id: new FormControl('',[Validators.required]),
         folio_no: new FormControl('',[Validators.required]),
         plan_id: new FormControl('',[Validators.required]),
         option_id: new FormControl('',[Validators.required]),
         scheme_name: new FormControl('',[Validators.required]),
         scheme_id: new FormControl('',[Validators.required]),
         cancel_effective_date: new FormControl(''),
         remarks: new FormControl(''),
         rnt_login_at: new FormControl('',[Validators.required]),
         filePreview: new FormControl(''),
         app_form_scan: new FormControl(''),
         nominee_opt_out: new FormControl(''),
         file: new FormControl('', [
           Validators.required,
           fileValidators.fileExtensionValidator(this.allowedExtensions),
         ]),
         transmission_type: new FormControl(''),
         folio_pan: new FormControl(''),
         email: new FormControl('',[Validators.email]),
         mobile:new FormControl('',[Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]),
         change_contact_type: new FormControl(''),
         add_line_1: new FormControl(''),
         add_line_2: new FormControl(''),
         minorToMajorpan: new FormControl(''),
         kyc_status: new FormControl(''),
         first_kyc: new FormControl(''),

         second_client_code: new FormControl(''),
         second_client_id: new FormControl(''),
         second_client_name: new FormControl(''),
         second_client_pan: new FormControl(''),
         second_kyc: new FormControl(''),

         third_client_code: new FormControl(''),
         third_client_id: new FormControl(''),
         third_client_name: new FormControl(''),
         third_client_pan: new FormControl(''),
         third_kyc: new FormControl(''),




  })
ngOnInit(){
  this.getTransactionType();
  this.getPlnMst();
  this.getOptionMst();
  this.getnumberofdaystobeadded();
  this.getrntMst();
}
getrntMst(){
  this.__dbIntr.api_call(0,'/rnt',null).pipe(pluck("data")).subscribe((res: rnt[]) =>{
    this.__rnt_login_at = res;
  })
}
getnumberofdaystobeadded(){
  this.__dbIntr.api_call(0,'/mdparams',null).pipe(pluck("data")).subscribe(res =>{
    console.log(res);
    this.__noofdaystobeAdded = res;
  })
}
getPlnMst(){
  this.__dbIntr.api_call(0,'/plan',null).pipe(pluck("data")).subscribe((res: plan[]) =>{
   this.__plnMst = res;
  })
}
getOptionMst(){
  this.__dbIntr.api_call(0,'/option',null).pipe(pluck("data")).subscribe((res: option[]) =>{
    this.__optionMst = res;
   })
}
ngAfterViewInit(){
   //Second Client Code Search
   this.__nonfinForm.controls['third_client_code'].valueChanges
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     switchMap((dt) =>
       dt?.length > 1 ? this.__dbIntr.searchItems('/client', dt) : []
     ),
     map((x: any) => x.data)
   )
   .subscribe({
     next: (value) => {
       this.__third_clientMst = value.data;
       this.__isthirdCldtlsEmpty = value.data.length > 0 ? false : true;
       this.searchResultVisibilityForThirdClient('block');
       this.__ThirdClient = null;
       this.__nonfinForm.patchValue({
         third_client_id: '',
         third_client_name: '',
         third_client_pan: '',
       });
     },
     complete: () => console.log(''),
     error: (err) => console.log(),
   });
   //Second Client Code Search
   this.__nonfinForm.controls['second_client_code'].valueChanges
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     switchMap((dt) =>
       dt?.length > 1 ? this.__dbIntr.searchItems('/client', dt) : []
     ),
     map((x: any) => x.data)
   )
   .subscribe({
     next: (value) => {
       this.__sec_clientMst = value.data;
       this.__issecCldtlsEmpty = value.data.length > 0 ? false : true;
       this.searchResultVisibilityForSecondClient('block');
       this.__SecondClient = null;
       this.__nonfinForm.patchValue({
         second_client_id: '',
         second_client_name: '',
         second_client_pan: '',
       });
     },
     complete: () => console.log(''),
     error: (err) => console.log(),
   });
  // Temporary Tin Number
  this.__nonfinForm.controls['temp_tin_no'].valueChanges
  .pipe(
    tap(() => this.__istemporaryspinner = true),
    debounceTime(200),
    distinctUntilChanged(),
    switchMap((dt) =>
      dt?.length > 1
        ? this.__dbIntr.searchTin(
          '/formreceived',
          dt +
          '&trans_type_id=' +
          this.data.trans_type_id +
          '&flag=C'
        )
        : []
    ),
    map((x: responseDT) => x.data),
  )
  .subscribe({
    next: (value) => {
      this.__temp_tinMst = value;
      this.searchResultVisibility('block');
      this.__istemporaryspinner = false;
    },
    complete: () => console.log(''),
    error: (err) =>this.__istemporaryspinner = false,
  });
  // Sub Broker ARN Search
  this.__nonfinForm.controls['sub_arn_no'].valueChanges.
    pipe(
      tap(()=> this.__issubBrkArnspinner = true),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(dt => dt?.length > 1 ?
        this.__dbIntr.searchItems('/showsubbroker', dt)
        : []),
      map((x: responseDT) => x.data)
    ).subscribe({
      next: (value) => {
        this.__subbrkArnMst = value
        this.searchResultVisibilityForSubBrkArn('block');
        this.__nonfinForm.controls['sub_brk_cd'].setValue('');
        this.__issubBrkArnspinner = false;
      },
      complete: () => console.log(''),
      error: (err) =>this.__issubBrkArnspinner = false,
    })

    //bank change
    // Bank SEARCH
    this.__nonfinForm.controls['newbnk_micr'].valueChanges
      .pipe(
        tap(() => this.__isbnkSpinner = true),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.searchItems('/depositbank', dt) : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__isbnkSpinner = false;
          this.__bnkMst = value;
          this.searchResultVisibilityForBnk('block');
        },
        complete: () => console.log(''),
        error: (err) =>this.__isbnkSpinner = false,
      });

 // EUIN NUMBER SEARCH
 this.__nonfinForm.controls['euin_no'].valueChanges
 .pipe(
   tap(() => this.__isEuinNumberVisible = true),
   debounceTime(200),
   distinctUntilChanged(),
   switchMap((dt) =>
     dt?.length > 1
       ? this.__dbIntr.searchItems(
         '/employee',
         dt +
         (this.__nonfinForm.controls['sub_arn_no'].value
           ? '&sub_arn_no=' +
           this.__nonfinForm.controls['sub_brk_cd'].value
           : '')
       )
       : []
   ),
   map((x: responseDT) => x.data),
 )
 .subscribe({
   next: (value) => {
     this.__euinMst = value;
     this.searchResultVisibilityForEuin('block');
     this.__isEuinNumberVisible = false;
   },
   complete: () => console.log(''),
   error: (err) =>this.__isEuinNumberVisible = false,
 });


  //Client Code Search
  this.__nonfinForm.controls['client_code'].valueChanges
  .pipe(
    tap(() => this.__isclientVisible = true),
    debounceTime(200),
    distinctUntilChanged(),
    switchMap((dt) =>
      dt?.length > 1 ? this.__dbIntr.searchItems('/client', dt) : []
    ),
    map((x: any) => x.data),
  )
  .subscribe({
    next: (value) => {
      this.__clientMst = value.data;
      this.__isCldtlsEmpty = value.data.length > 0 ? false : true;
      this.searchResultVisibilityForClient('block');
      this.__nonfinForm.patchValue({
        client_id: '',
        client_name: '',
      });
    this.__isclientVisible = false;
    },
    complete: () => console.log(''),
    error: (err) =>this.__isclientVisible = false,
  });


  this.__nonfinForm.controls['tin_status'].valueChanges.subscribe(res =>{
    this.__nonfinForm.controls['temp_tin_no'].setValidators(res == 'Y' ? [Validators.required] : null);
    this.__nonfinForm.controls['temp_tin_no'].updateValueAndValidity();

  })
  this.__nonfinForm.controls['bu_type'].valueChanges.subscribe(res =>{
          this.__nonfinForm.controls['sub_brk_cd'].setValidators(res == 'B' ? [Validators.required] : null);
          this.__nonfinForm.controls['sub_arn_no'].setValidators(res == 'B' ? [Validators.required] : null);
          this.__nonfinForm.controls['sub_brk_cd'].updateValueAndValidity();
          this.__nonfinForm.controls['sub_arn_no'].updateValueAndValidity();
  })

  this.__nonfinForm.controls['trans_id'].valueChanges.subscribe(res =>{
  this.__isAmtcheck = false;
  this.__checkedAmt ='';
  this.__nonfinForm.controls['transmission_type'].setValidators(res == '19' ? [Validators.required] : null);
  this.__nonfinForm.controls['first_kyc'].setValidators(res == '20' ? [Validators.required] : null);
  this.__nonfinForm.controls['swp_amount'].removeValidators([Validators.required]);
  this.__nonfinForm.controls['duration'].removeValidators([Validators.required]);
  this.__nonfinForm.controls['swp_end_date'].setValidators((res == '30' || res == '31') ? [Validators.required] : null);
  this.__nonfinForm.controls['swp_duration'].setValidators((res == '30'  || res == '31') ? [Validators.required] : null);
  this.__nonfinForm.controls['swp_start_date'].setValidators((res == '30'  || res == '31') ? [Validators.required] : null);
  this.__nonfinForm.controls['swp_dates'].setValidators((res == '30'  || res == '31') ? [Validators.required] : null);
   this.__nonfinForm.controls['swp_freq'].setValidators((res == '30'  || res == '31') ? [Validators.required] : null);
   this.__nonfinForm.controls['swp_type'].setValidators(res == '30' ? [Validators.required] : null);
   this.__nonfinForm.controls['stp_type'].setValidators(res == '31' ? [Validators.required] : null);
    this.__nonfinForm.controls['newbnk_accNo'].setValidators((res == '15' || res == '16') ? [Validators.required] : null);
    this.__nonfinForm.controls['newbnk_id'].setValidators((res == '15' || res == '16') ? [Validators.required] : null);
     this.__nonfinForm.controls['newbnk_micr'].setValidators((res == '15' || res == '16') ? [Validators.required] : null);
    this.__nonfinForm.controls['unit_type'].removeValidators([Validators.required]);
    this.__nonfinForm.controls['redemp_unit'].removeValidators([Validators.required]);
    this.__nonfinForm.controls['redemp_amount'].removeValidators([Validators.required]);
    this.__nonfinForm.controls['email'].removeValidators([Validators.required,Validators.email]);
    this.__nonfinForm.controls['mobile'].removeValidators([Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]);
    this.__nonfinForm.controls['cancel_effective_date'].setValidators((res ==  '7' || res ==  '8' || res ==  '9') ? [Validators.required] : null);
    this.__nonfinForm.controls['state'].setValidators((res == '22') ? [Validators.required] : null);
    this.__nonfinForm.controls['dist'].setValidators((res == '22') ? [Validators.required] : null);
    this.__nonfinForm.controls['city'].setValidators((res == '22') ? [Validators.required] : null);
    this.__nonfinForm.controls['pincode'].setValidators((res == '22') ? [Validators.required,Validators.minLength(6),Validators.maxLength(6),Validators.pattern("^[0-9]*$")] : null);
    this.__nonfinForm.controls['add_line_1'].setValidators((res == '22') ? [Validators.required] : null);
    this.__nonfinForm.controls['change_contact_type'].setValidators((res == '18') ? [Validators.required] : null);
    this.__nonfinForm.controls['reason_for_change'].setValidators((res == '23') ? [Validators.required] : null);
    this.__nonfinForm.controls['new_name'].setValidators((res == '23') ? [Validators.required] : null);
    this.__nonfinForm.controls['change_status'].setValidators((res == '24') ? [Validators.required] : null);
    this.__nonfinForm.controls['nominee_opt_out'].setValidators((res == '25') ? [Validators.required] : null);
    this.__nonfinForm.controls['folio_pan'].setValidators((res == '28') ? [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'), Validators.minLength(10), Validators.maxLength(10)] : null);
    this.__nonfinForm.controls['redemp_type'].setValidators((res == '29') ? [Validators.required] : null);
    this.__nonfinForm.controls['minorToMajorpan'].setValidators((res == '20') ? [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'), Validators.minLength(10), Validators.maxLength(10)] : null)
    this.__nonfinForm.controls['kyc_status'].setValidators(res == '20' ? [Validators.required] : null);
    this.__nonfinForm.controls['first_kyc'].updateValueAndValidity();
    this.__nonfinForm.controls['minorToMajorpan'].updateValueAndValidity();
    this.__nonfinForm.controls['kyc_status'].updateValueAndValidity();
    this.__nonfinForm.controls['stp_type'].updateValueAndValidity();
    this.__nonfinForm.controls['swp_amount'].updateValueAndValidity();
    this.__nonfinForm.controls['duration'].updateValueAndValidity();
    this.__nonfinForm.controls['swp_end_date'].updateValueAndValidity();
    this.__nonfinForm.controls['swp_duration'].updateValueAndValidity();
    this.__nonfinForm.controls['swp_start_date'].updateValueAndValidity();
    this.__nonfinForm.controls['swp_dates'].updateValueAndValidity();
    this.__nonfinForm.controls['swp_freq'].updateValueAndValidity();
     this.__nonfinForm.controls['swp_type'].updateValueAndValidity();
    this.__nonfinForm.controls['cancel_effective_date'].updateValueAndValidity();
    this.__nonfinForm.controls['change_contact_type'].updateValueAndValidity();
    this.__nonfinForm.controls['email'].updateValueAndValidity();
    this.__nonfinForm.controls['mobile'].updateValueAndValidity();
    this.__nonfinForm.controls['state'].updateValueAndValidity();
    this.__nonfinForm.controls['dist'].updateValueAndValidity();
    this.__nonfinForm.controls['city'].updateValueAndValidity();
    this.__nonfinForm.controls['pincode'].updateValueAndValidity();
    this.__nonfinForm.controls['reason_for_change'].updateValueAndValidity();
    this.__nonfinForm.controls['new_name'].updateValueAndValidity();
    this.__nonfinForm.controls['change_status'].updateValueAndValidity();
    this.__nonfinForm.controls['nominee_opt_out'].updateValueAndValidity();
    this.__nonfinForm.controls['folio_pan'].updateValueAndValidity();
    this.__nonfinForm.controls['redemp_type'].updateValueAndValidity();
    this.__nonfinForm.controls['unit_type'].updateValueAndValidity();
    this.__nonfinForm.controls['redemp_unit'].updateValueAndValidity();
    this.__nonfinForm.controls['redemp_amount'].updateValueAndValidity();
    this.__nonfinForm.controls['add_line_1'].updateValueAndValidity();
    this.__nonfinForm.controls['newbnk_id'].updateValueAndValidity();
    this.__nonfinForm.controls['newbnk_micr'].updateValueAndValidity();
    this.__nonfinForm.controls['newbnk_accNo'].updateValueAndValidity();
    this.__nonfinForm.controls['transmission_type'].updateValueAndValidity();

    if(res ==  '7' || res ==  '8' || res ==  '9'){
      this.calculatecancellationeffectivedt(res)
    }
    else if(res == '22'){
     this.getState();
    }
    else if(res == '30' || res == '31'){
      this.getSwpType(this.__nonfinForm.controls['trans_id'].value);
      // this.getSchemeWiseFrequency(this.__nonfinForm.controls['scheme_id'].value)
    }

  })

  this.__nonfinForm.controls['swp_duration'].valueChanges.subscribe(res =>{
    if(this.__nonfinForm.controls['trans_id'].value == '30' && res){
      this.__nonfinForm.controls['duration'].setValidators(res == 'M' ? [Validators.required] : null)
      this.__nonfinForm.controls['duration'].updateValueAndValidity();
    }
  })

  //Kyc_status Change
  this.__nonfinForm.get('kyc_status').valueChanges.subscribe(res =>{
    if(res){
      this.__kycMst = res == 'Y' ? KycMst : withoutKycMst;
    }
  })

  //Change of contact type
  this.__nonfinForm.controls['change_contact_type'].valueChanges.subscribe(res =>{
    this.__nonfinForm.controls['email'].setValidators( (res == 'E' || res == 'B') ? [Validators.required,Validators.email] : null);
    this.__nonfinForm.controls['mobile'].setValidators((res == 'M' || res == 'B') ? [Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")] : null);
    this.__nonfinForm.controls['email'].updateValueAndValidity();
    this.__nonfinForm.controls['mobile'].updateValueAndValidity();
  })

   //Scheme Search
   this.__nonfinForm.controls['scheme_name'].valueChanges
   .pipe(
    tap(()=> this.__isschemeSpinner = true),
     debounceTime(200),
     distinctUntilChanged(),
     switchMap((dt) =>
       dt?.length > 1 ? this.__dbIntr.searchItems('/scheme', (dt + '&scheme_type='+ (this.data.trans_type_id == '4' ? 'N' : 'O'))) : []
     ),
     map((x: any) => x.data)
   )
   .subscribe({
     next: (value) => {
       this.__schemeMst = value;
       this.searchResultVisibilityForScheme('block');
       this.__isschemeSpinner = false
     },
     complete: () => console.log(''),
     error: (err) => this.__isschemeSpinner = false,
   });

   this.__nonfinForm.controls['state'].valueChanges.subscribe(res =>{
    if((res && this.__nonfinForm.controls['trans_id'].value == '22')){
      this.getDistrict(res);
    }
   })
   this.__nonfinForm.controls['dist'].valueChanges.subscribe(res =>{
    if((res && this.__nonfinForm.controls['trans_id'].value == '22')){
      this.getCity(res);
    }
 })
 this.__nonfinForm.controls['redemp_type'].valueChanges.subscribe(res =>{
  console.log(res);
   if(this.__nonfinForm.controls['trans_id'].value == '29'){
    this.__nonfinForm.controls['redemp_unit'].removeValidators([Validators.required]);
   this.__nonfinForm.controls['redemp_unit'].updateValueAndValidity();
    this.__nonfinForm.controls['unit_type'].setValidators(res == 'U' ? [Validators.required] : null);
    this.__nonfinForm.controls['unit_type'].updateValueAndValidity();

    this.__nonfinForm.controls['redemp_amount'].setValidators(res == 'A' ? [Validators.required] : null);
    this.__nonfinForm.controls['redemp_amount'].updateValueAndValidity();
   }
 })
 this.__nonfinForm.controls['unit_type'].valueChanges.subscribe(res =>{
  if(this.__nonfinForm.controls['trans_id'].value == '29' && this.__nonfinForm.controls['unit_type'].value == 'U'){
    this.__nonfinForm.controls['redemp_unit'].setValidators([Validators.required]);
    this.__nonfinForm.controls['redemp_unit'].updateValueAndValidity();
  }

 })

 //Folio Number
 this.__nonfinForm.controls['folio_no'].valueChanges.subscribe(res =>{
  this.getdetailsbyFolio(res);
 })

 //Swp_duration change
 this.__nonfinForm.controls['swp_duration'].valueChanges.subscribe((res) => {
  if(res == 'P'){
    //  this.removeValidations([{name:'duration',valid:[Validators.required]}]);
      let getDT = new Date();
     this.__nonfinForm.get('swp_end_date').setValue('2999-12-'+((getDT.getDate().toString()).length > 1 ? getDT.getDate() : ('0' + getDT.getDate())));
     console.log( this.__nonfinForm.get('swp_end_date').value);

  }
  else if(res == 'M'){
   if(this.__nonfinForm.get('trans_id').value == '30'){
    //  this.setValidations([{name:'duration',valid:[Validators.required]}]);
     this.__nonfinForm.get('swp_end_date').setValue('');
   }
  }
});
//Swp frequency change
this.__nonfinForm.controls['swp_freq'].valueChanges.subscribe(res =>{

})
// SWP Amount
this.__nonfinForm.controls['swp_amount'].valueChanges.subscribe(res =>{
   this.checkAmt(res,this.__nonfinForm.controls['swp_freq'].value)
})

}

getdetailsbyFolio(__folioDtls){
  this.__dbIntr.api_call(0,'/mfTraxFolioDetails','folio_no='+__folioDtls).pipe(pluck("data")).subscribe(res =>{
    console.log(res);

     this.setCLients(res[0])
  })
}

setCLients(res){
  console.log(res);

  this.getadditionalApplicant({
    id:res.second_client_id,
    client_code:res.second_client_code,
    client_name:res.second_client_name,
    pan:res.second_client_pan,
    },'FC');

    this.getadditionalApplicant({
      id:res.third_client_id,
      client_code:res.third_client_code,
      client_name:res.third_client_name,
      pan:res.third_client_pan,
      },'TC')
}

getState(){
  this.__dbIntr.api_call(0,'/states',null).pipe(pluck("data")).subscribe(res =>{
    this.__stateMst = res;
  })
}
getDistrict(state_id){
  this.__dbIntr.api_call(0,'/districts','state_id='+state_id).pipe(pluck("data")).subscribe(res =>{
    this.__distMst = res;
  })
}
getCity(dist_id){
  this.__dbIntr.api_call(0,'/city','district_id='+dist_id).pipe(pluck("data")).subscribe(res =>{
    this.__cityMst = res;
  })
}
calculatecancellationeffectivedt(__trans_id){
   var dt = new Date();
  switch(__trans_id.toString()){
    case '7':
      dt.setDate(
        dt.getDate()
        + Number(this.__noofdaystobeAdded[this.__noofdaystobeAdded.findIndex((x) => x.sl_no == 4)].param_value))
        this.__nonfinForm.controls['cancel_effective_date'].setValue(dt.toISOString().substring(0,10));
        console.log(dt.toISOString().substring(0,10));
        break;
    case '8':
            dt.setDate(
              dt.getDate()
              + Number(this.__noofdaystobeAdded[this.__noofdaystobeAdded.findIndex((x) => x.sl_no == 6)].param_value))
              this.__nonfinForm.controls['cancel_effective_date'].setValue(dt.toISOString().substring(0,10));
              console.log(dt.toISOString().substring(0,10));
              break;
    case '9':
            dt.setDate(
              dt.getDate()
              + Number(this.__noofdaystobeAdded[this.__noofdaystobeAdded.findIndex((x) => x.sl_no == 8)].param_value))
              this.__nonfinForm.controls['cancel_effective_date'].setValue(dt.toISOString().substring(0,10));
              console.log(dt.toISOString().substring(0,10));
              break;

    default: break;
  }

}
minimize(){
  this.dialogRef.updateSize("30%",'55px');
  this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
}
maximize(){
  this.dialogRef.updateSize("60%");
  this.__isVisible = !this.__isVisible;
}
fullScreen(){
  this.dialogRef.updateSize("100%");
  this.__isVisible = !this.__isVisible;
}
submitnonFinForm(){
  if (this.__nonfinForm.invalid) {
    this.__utility.showSnackbar(
      'Error!! Form submition failed due to some error',
      0
    );
    return;
  }
  const fb = new FormData();
    fb.append('rnt_login_at',this.__nonfinForm.value.rnt_login_at ? this.__nonfinForm.value.rnt_login_at : '');
    fb.append("bu_type",this.__nonfinForm.value.bu_type);
    fb.append('temp_tin_no', this.__nonfinForm.value.temp_tin_no);
    fb.append('remarks', this.__nonfinForm.value.remarks);
    fb.append('first_client_id', this.__nonfinForm.value.client_id);
    fb.append('scheme_id', this.__nonfinForm.value.scheme_id);
    fb.append('folio_no',this.__nonfinForm.value.folio_no)
    fb.append('trans_id', this.__nonfinForm.value.trans_id);
    fb.append('trans_type_id', this.data.trans_type_id);
    fb.append('app_form_scan', this.__nonfinForm.value.app_form_scan);
    fb.append('tin_status', this.__nonfinForm.value.tin_status);
    fb.append('plan', this.__nonfinForm.value.plan_id);
    fb.append('cancel_eff_dt',
    (this.__nonfinForm.value.trans_id == '7'
    || this.__nonfinForm.value.trans_id == '8'
    || this.__nonfinForm.value.trans_id == '9')
    ? this.__nonfinForm.value.cancel_effective_date : '');
    fb.append('option', this.__nonfinForm.value.option_id);
    fb.append('euin_no', this.__nonfinForm.value.euin_no ? this.__nonfinForm.value.euin_no.split(' ')[0] : '');
    if (this.__nonfinForm.value.bu_type == '2') {
      fb.append('sub_brk_cd', this.__nonfinForm.value.sub_brk_cd ? this.__nonfinForm.value.sub_brk_cd.split(' ')[0] : '');
      fb.append('sub_arn_no', this.__nonfinForm.value.sub_arn_no ? this.__nonfinForm.value.sub_arn_no : '');
    }
   if(this.__nonfinForm.value.trans_id == '18'){
    fb.append('change_contact_type', this.__nonfinForm.value.change_contact_type);
    fb.append('email', (this.__nonfinForm.value.change_contact_type == 'E' || this.__nonfinForm.value.change_contact_type == 'B') ?  this.__nonfinForm.value.email : '');
    fb.append('mobile', (this.__nonfinForm.value.change_contact_type == 'M' || this.__nonfinForm.value.change_contact_type == 'B') ?  this.__nonfinForm.value.mobile : '');
   }
   else if(this.__nonfinForm.value.trans_id == '22'){
    fb.append('state', this.__nonfinForm.value.state);
    fb.append('city', this.__nonfinForm.value.city);
    fb.append('district', this.__nonfinForm.value.dist);
    fb.append('pincode', this.__nonfinForm.value.pincode);
    fb.append('add_line_1', this.__nonfinForm.value.add_line_1);
    fb.append('add_line_2', this.__nonfinForm.value.add_line_2);
   }
   else if(this.__nonfinForm.value.trans_id == '23'){
    fb.append('reason_for_change', this.__nonfinForm.value.reason_for_change);
    fb.append('new_name', this.__nonfinForm.value.new_name);
   }
   else if(this.__nonfinForm.value.trans_id == '24'){
    fb.append('change_status', this.__nonfinForm.value.change_status);
   }
   else if(this.__nonfinForm.value.trans_id == '25'){
    fb.append('nominee_opt_out', this.__nonfinForm.value.nominee_opt_out);
   }
   else if(this.__nonfinForm.value.trans_id == '28'){
    fb.append('folio_pan', this.__nonfinForm.value.folio_pan);
   }
   else if(this.__nonfinForm.value.trans_id == '29'){
    fb.append('redemp_type', this.__nonfinForm.value.redemp_type);
    fb.append('unit_type',  this.__nonfinForm.value.redemp_type == 'U' ? this.__nonfinForm.value.unit_type : '');
    fb.append('redemp_unit',this.__nonfinForm.value.redemp_type == 'U' ?  this.__nonfinForm.value.redemp_unit : '');
    fb.append('redemp_amount',this.__nonfinForm.value.redemp_type == 'A' ?  this.__nonfinForm.value.redemp_amount : '');
   }
   else if(this.__nonfinForm.value.trans_id == '15' || this.__nonfinForm.value.trans_id == '16'){
    fb.append('acc_no', this.__nonfinForm.value.newbnk_accNo);
    fb.append('acc_bank_id',  this.__nonfinForm.value.newbnk_id);
   }
   else if(this.__nonfinForm.value.trans_id == '30' || this.__nonfinForm.value.trans_id == '31'){
    fb.append('swp_type', this.__nonfinForm.value.trans_id == '30' ?  this.__nonfinForm.value.swp_type : "");
    fb.append('stp_type', this.__nonfinForm.value.trans_id == '31' ?  this.__nonfinForm.value.stp_type : "");
    fb.append('swp_stp_frequency',  this.__nonfinForm.value.swp_freq);
    fb.append('swp_stp_start_date',  this.__nonfinForm.value.swp_start_date);
    fb.append('swp_stp_end_date',  this.__nonfinForm.value.swp_end_date);
    fb.append('swp_stp_duration_type',  this.__nonfinForm.value.swp_duration);
    fb.append('swp_stp_duration',  this.__nonfinForm.value.duration);
    fb.append('swp_stp_amount',this.__nonfinForm.value.swp_amount);
   }
   else if(this.__nonfinForm.value.trans_id == '20'){
    fb.append('minor_to_major_pan',this.__nonfinForm.value.minorToMajorpan);
    fb.append('kyc_status',this.__nonfinForm.value.kyc_status);
    fb.append('first_kyc',this.__nonfinForm.value.first_kyc);
   }
   else if(this.__nonfinForm.value.trans_id == '19'){
    fb.append('transmission_type',this.__nonfinForm.value.transmission_type);
   }

    this.__dbIntr.api_call(1, '/mfTraxCreate', fb).subscribe((res: any) => {
      if(res.suc == 1){
        this.__nonfinForm.reset();
        this.__nonfinForm.controls['tin_status'].patchValue('Y');
        this.__dialogDtForClient = null;
        this.__dialogDtForScheme = null;
      }
      this.__utility.showSnackbar(
        res.suc == 1 ? 'Form Submitted Successfully' : res.msg,
        res.suc
      );
    });
}
//TEMP TIN NUMBER
outsideClickfortempTin(__ev){
  this.__istemporaryspinner = false;
   if(__ev){
      this.searchResultVisibility('none');
   }
}
outsideClickforbank(__ev){
  if(__ev){
     this.searchResultVisibilityForBnk('none');
  }
}
outsideClickforThirdClient(__ev) {
  if (__ev) {
    this.searchResultVisibilityForThirdClient('none');
  }
}

outsideClickforScheme(__ev){
  // this.__istemporaryspinner = false;
   if(__ev){
      this.searchResultVisibilityForScheme('none');
   }
}

outsideClickforSecondClient(__ev){
if(__ev){
  this.searchResultVisibilityForSecondClient('none')
}
}


//third client Search Resullt off
searchResultVisibilityForThirdClient(display_mode) {
  if(this.__thirdCl){
    this.__thirdCl.nativeElement.style.display = display_mode;
  }
}

//second client Search Resullt off
searchResultVisibilityForSecondClient(display_mode) {
  if(this.__secondCl){
    this.__secondCl.nativeElement.style.display = display_mode;
  }

}

//bank Search Resullt off
searchResultVisibilityForBnk(display_mode) {
  this.__searchbnk.nativeElement.style.display = display_mode;
}
  //Scheme Search Resullt off
  searchResultVisibilityForScheme(display_mode) {
    this.__schemeRes.nativeElement.style.display = display_mode;
  }
// EUIN NUmber
outsideClick(__ev) {
  // this.__isEuinNumberVisible = false;
  if (__ev) {
    this.searchResultVisibilityForEuin('none');
  }
}
outsideClickforClient(__ev){
  if(__ev){
    this.searchResultVisibilityForClient('none');
  }
}
searchResultVisibilityForClient(display_mode){
 this.__clientCdForNonFin.nativeElement.style.display = display_mode;
}
searchResultVisibilityForEuin(display_mode){
  this.__searchEUIN.nativeElement.style.display = display_mode;
}
//SUB BROKER ARN NUMBER
outsideClickforSubBrkArn(__ev){
  if(__ev){
    this.searchResultVisibilityForSubBrkArn('none');
 }
}
 //Temp Tin Search Resullt off
 searchResultVisibility(display_mode) {
  this.__searchTempTin.nativeElement.style.display = display_mode;
}
  //Sub Broker search result off
  searchResultVisibilityForSubBrkArn(display_mode) {
    this.__subBrkArn.nativeElement.style.display = display_mode;
  }
getItems(__items){
 console.log(__items);
//  this.__nonfinForm.controls['temp_tin_no'].reset(__items.temp_tin_no,{onlySelf:true,emitEvent:false});
 this.searchResultVisibility('none');
 this.__dialogDtForClient = {id: __items.client_id,client_type: __items.client_type,client_name: __items.client_name,};
 this.__nonfinForm.patchValue({
  bu_type: __items.bu_type,
  client_name: __items.client_name,
  client_id: __items.client_id,
  sub_brk_cd:(__items.sub_brk_cd),
  trans_id:__items.trans_id,
  folio_no: __items.folio_no,
  scheme_id:__items.scheme_id ? __items.scheme_id : '',
 })
 this.getSchemeWiseFrequency(__items.scheme_id);
 this.__nonfinForm.controls['temp_tin_no'].patchValue(__items.temp_tin_no,{emitEvent:false})
 this.__nonfinForm.controls['euin_no'].patchValue((__items.euin_no + ' - ' + __items.emp_name),{emitEvent:false})
 this.__nonfinForm.controls['client_code'].patchValue(__items.client_code,{emitEvent:false})
 this.__nonfinForm.controls['sub_arn_no'].patchValue(__items.sub_arn_no,{emitEvent:false})
 this.__nonfinForm.controls['scheme_name'].patchValue(__items.scheme_name ? __items.scheme_name : '',{emitEvent:false})
}
getItemsDtls(__euinDtls,__type){
  switch (__type) {
    case 'S':
      this.__nonfinForm.controls['sub_arn_no'].reset(__euinDtls.arn_no + ' - ' + __euinDtls.bro_name, { onlySelf: true, emitEvent: false });
      this.__nonfinForm.controls['sub_brk_cd'].setValue(__euinDtls.code);
      this.searchResultVisibilityForSubBrkArn('none');
      break;
    case 'E':
      this.__nonfinForm.controls['euin_no'].reset(
        __euinDtls.euin_no + ' - ' + __euinDtls.emp_name,
        { onlySelf: true, emitEvent: false }
      );
      this.searchResultVisibilityForEuin('none');
      break;

      case 'B' : this.__dialogFornewBank = __euinDtls;
                this.__nonfinForm.controls['newbnk_micr'].reset(__euinDtls.micr_code, {
                  onlySelf: true,
                  emitEvent: false,
                });
                this.__nonfinForm.controls['newbnk_name'].setValue(__euinDtls.bank_name);
                this.__nonfinForm.controls['newbnk_id'].setValue(__euinDtls.id);
                this.searchResultVisibilityForBnk('none');
                break;
      case 'C':
        this.__dialogDtForClient = __euinDtls;
        this.__nonfinForm.controls['client_code'].reset(__euinDtls.client_code, {
          onlySelf: true,
          emitEvent: false,
        });
        this.__nonfinForm.patchValue({
          client_name: __euinDtls.client_name,
          client_id: __euinDtls.id,
        });
        this.searchResultVisibilityForClient('none');
        break;
        case 'SC':
        this.__dialogDtForScheme = __euinDtls;
        this.__nonfinForm.controls['scheme_name'].reset(__euinDtls.scheme_name, {
          onlySelf: true,
          emitEvent: false,
        });
        this.__nonfinForm.patchValue({ scheme_id: __euinDtls.id });
        this.searchResultVisibilityForScheme('none');
        // this.getschemwisedt(__euinDtls.id);
        break;
    default: break;
  }
}
openDialog(__type){
  console.log(this.__dialogDtForClient);
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.width = __type == 'C' ? '100%' : '50%';
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.data = {
    flag: __type,
    title:
      __type == 'C'
        ? this.__dialogDtForClient.client_name
        : __type == 'S' ? this.__dialogDtForScheme.scheme_name
        : __type == 'NB' ?  this.__dialogFornewBank.bank_name
        : this.__dialogForExistingBank.bank_name,
    dt:
      __type == 'C'
        ? this.__dialogDtForClient
        : __type == 'S' ? this.__dialogDtForScheme
        : __type == 'NB' ? this.__dialogFornewBank
        : this.__dialogForExistingBank,
  };
  try {
    const dialogref = this.__dialog.open(
      CmnDialogForDtlsViewComponent,
      dialogConfig
    );
  } catch (ex) { }
}

openDialogForclientcreation(__menu, __mode) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = true;
  dialogConfig.width = '100%';
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.panelClass = 'fullscreen-dialog';
  dialogConfig.data = {
    flag: 'CL',
    id: 0,
    items: null,
    title:
      'Create ' +
      (__menu.flag == 'M'
        ? 'Minor'
        : __menu.flag == 'P'
          ? 'PAN Holder'
          : __menu.flag == 'N'
            ? 'Non Pan Holder'
            : 'Existing'),
    cl_type: __menu.flag,
  };
  try {
    const dialogref = this.__dialog.open(
      DialogForCreateClientComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {
      console.log(dt);
      if (dt) {
        switch (__mode) {
          case 'F':
            this.__isCldtlsEmpty = false;
            this.getItemsDtls(dt.data, 'C');
            break;
          // case 'S':
          //   this.__issecCldtlsEmpty = false;
          //   this.getadditionalApplicant(dt.data, 'FC');
          //   break;
          // case 'T':
          //   this.__isthirdCldtlsEmpty = false;
          //   this.getadditionalApplicant(dt.data, 'TC');
          //   break;
          default:
            break;
        }
      }
    });
  } catch (ex) { }
}
getTransactionType() {
  this.__dbIntr
    .api_call(
      0,
      '/showTrans',
      'trans_type_id=' + this.data.trans_type_id
    )
    .pipe(pluck('data'))
    .subscribe((res: any) => {
      console.log(res);

      this.__transType = res;
    });
}
getFIle(__ev) {
  console.log(__ev);

  this.__nonfinForm
    .get('file')
    .setValidators([
      Validators.required,
      fileValidators.fileExtensionValidator(this.allowedExtensions),
      fileValidators.fileSizeValidator(__ev.files),
    ]);
  this.__nonfinForm.get('file').updateValueAndValidity();
  if (
    this.__nonfinForm.get('file').status == 'VALID' &&
    __ev.files.length > 0
  ) {
    const reader = new FileReader();
    reader.onload = (e) => this.setFormControl('filePreview', reader.result);
    reader.readAsDataURL(__ev.files[0]);
    this.setFormControl('app_form_scan', __ev.files[0]);
  } else {
    this.setFormControl('filePreview', '');
    this.setFormControl('app_form_scan', '');
  }
}
setFormControl(formcontrlname, __val) {
  this.__nonfinForm.get(formcontrlname).patchValue(__val);
  this.__nonfinForm.get(formcontrlname).updateValueAndValidity();
}
preventNonumeric(__ev) {
  dates.numberOnly(__ev)
}

getSwpType(__trans_id){
  this.__dbIntr.api_call(0,__trans_id == '30' ? '/swpType' : '/stpType',null).pipe(pluck("data")).subscribe(res =>{
   this.__swpMst = res;
  })
}
getSchemeWiseFrequency(__scheme_id){
  this.__dbIntr.api_call(0,'/scheme','scheme_id='+ __scheme_id).pipe(pluck("data")).subscribe((res: scheme[]) =>{
    this.__nonfinForm.controls['swp_dates'].setValue(
      this.__nonfinForm.controls['trans_id'].value == '30' ? JSON.parse(res[0].swp_date) : JSON.parse(res[0].stp_date)
      );
    // if(this.__tr)
    if(this.__nonfinForm.value.trans_id == '30'){
      this.__frequency = res[0].swp_freq_wise_amt ?
      (JSON.parse(res[0].swp_freq_wise_amt).filter(((x: any)=> x.is_checked == true))) : [];
    }
    else{
      this.__frequency = res[0].stp_freq_wise_amt ?
      (JSON.parse(res[0].stp_freq_wise_amt).filter(((x: any)=> x.is_checked == true))) : [];
    }


    var date = new Date(); // Now
    date.setDate(date.getDate()
    + Number(this.__noofdaystobeAdded[this.__noofdaystobeAdded.findIndex((x: any) => x.sl_no == (this.__nonfinForm.value.trans_id == '30' ? 5 : 7))].param_value));
    console.log(JSON.parse(this.__nonfinForm.value.trans_id == '30' ? res[0]?.swp_date : res[0]?.stp_date).findIndex((x:any) => x?.date ==  (date.getDate()).toString()));

      if(JSON.parse(this.__nonfinForm.value.trans_id == '30' ? res[0]?.swp_date : res[0]?.stp_date).findIndex((x:any) => x?.date ==  (date.getDate()).toString()) != -1)
      {
         console.log('IF');

          this.__nonfinForm.patchValue({
            swp_start_date: date.toISOString().slice(0, 10),
          })
      }
      else{
        console.log(date.toISOString().substring(0,10));
        console.log(date.getMonth());
        console.log(JSON.parse(res[0]?.stp_date));

        var found = JSON.parse((this.__nonfinForm.value.trans_id == '30' ? res[0]?.swp_date : res[0]?.stp_date)).find(function(element) {return Number(element.date) > Number(date.getDate())});
        console.log(found);

         if(found){
          console.log(found);

                this.__nonfinForm.get('swp_start_date').setValue(
                  date.getFullYear()
                  +'-'+(date.getMonth().toString().length > 1 ?  (date.getMonth() + 1) : '0'+(date.getMonth() + 1))
                  +'-'+found.date);
         }
         else{
          console.log('NOT FOUND' + found);
           date.setDate(date.getDate() + 60);
          this.__nonfinForm.get('swp_start_date').setValue(
            date.getFullYear()
            +'-'+
            (date.getMonth().toString().length > 1 ?  date.getMonth() : '0'+
            date.getMonth())
            +'-'+
             (JSON.parse(
              (this.__nonfinForm.value.trans_id == '30' ? res[0]?.swp_date : res[0]?.stp_date)
              )[0]?.date.length > 1 ? JSON.parse(
                (this.__nonfinForm.value.trans_id == '30' ? res[0]?.swp_date : res[0]?.stp_date)
                )[0]?.date
             :'0'+JSON.parse(
              (this.__nonfinForm.value.trans_id == '30' ? res[0]?.swp_date : res[0]?.stp_date)
              )[0].date));
           console.log( this.__nonfinForm.get('swp_start_date').value);
        }
      }
  })

}

setSipEndDate() {
  if (this.__nonfinForm.controls['duration'].value) {
    let getDT = new Date(this.__nonfinForm.controls['swp_start_date'].value);
    // this.__nonfinForm.controls['period'].value == 'Y' ?
    //   getDT.setFullYear(new Date().getFullYear() + Number(this.__nonfinForm.controls['duration'].value))
    //   : getDT.setMonth(getDT.getMonth() + Number(Number(this.__nonfinForm.controls['duration'].value)));
    // this.__nonfinForm.controls['sip_end_date'].setValue(getDT.toISOString().slice(0, 10));
  }
  else {
    this.__nonfinForm.controls['swp_end_date'].setValue('');
  }

}
setEndDT(__ev){
  let _calculateDT;
  var dt = new Date(this.__nonfinForm.get('swp_start_date').value);
    switch(this.__nonfinForm.controls['swp_freq'].value){
       case 'D' : _calculateDT = new Date(dt.setDate(dt.getDate() + Number(__ev.target.value))).toISOString().substring(0 ,10);
       break;
       case 'W' :_calculateDT = new Date(dt.setDate(dt.getDate() + (Number(__ev.target.value) * 7))).toISOString().substring(0 ,10);
       break;
       case 'F' :_calculateDT = new Date(dt.setDate(dt.getDate() + (Number(__ev.target.value) * 14))).toISOString().substring(0 ,10);
       break;
       case 'M' :_calculateDT = new Date(dt.setMonth(dt.getMonth() + (Number(__ev.target.value)))).toISOString().substring(0 ,10);
       break;
       case 'Q' : break;
       case 'S' : break;
       case 'A' :_calculateDT = new Date(dt.setFullYear(dt.getFullYear() + (Number(__ev.target.value)))).toISOString().substring(0 ,10);
       break;
       default: break;
    }
    this.__nonfinForm.controls['swp_end_date'].setValue(_calculateDT);
}
checkAmt(res,swp_freq){
  console.log(swp_freq);
  if(res && swp_freq){
    this.__checkedAmt = Number(this.__frequency.filter((x: any) => x.id == swp_freq)[0].sip_add_min_amt);
    console.log(Number(res) >
    Number(this.__frequency.filter((x: any) => x.id == swp_freq)[0].sip_add_min_amt));
    this.__isAmtcheck = (Number(res) >
    Number(this.__frequency.filter((x: any) => x.id == swp_freq)[0].sip_add_min_amt)) ? false : true;
    console.log(this.__isAmtcheck);
  }
}


getadditionalApplicant(__items, __type) {
  switch (__type) {
    case 'FC':
      this.__SecondClient = __items;
      this.__nonfinForm.controls['second_client_code'].reset(
        __items ? __items.client_code : '',
        { onlySelf: true, emitEvent: false }
      );
      this.__nonfinForm.patchValue({
        second_client_name: __items ? __items.client_name : '',
        second_client_id: __items ? __items.id : '',
        second_client_pan: __items ? __items.pan : '',
      });
      this.searchResultVisibilityForSecondClient('none');
      break;
    case 'TC':
      this.__ThirdClient = __items;
      this.__nonfinForm.controls['third_client_code'].reset(
        __items ? __items.client_code : '',
        { onlySelf: true, emitEvent: false }
      );
      this.__nonfinForm.patchValue({
        third_client_name: __items ? __items.client_name : '',
        third_client_id: __items ? __items.id : '',
        third_client_pan: __items ? __items.pan : '',
      });
      this.searchResultVisibilityForThirdClient('none');
      console.log( this.__nonfinForm.controls['third_client_code'].value);

      break;
    default:
      break;
  }
}

openDialogForAdditionalApplicant(__type) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.width = '100%';
  if (__type == 'C') {
    dialogConfig.panelClass = 'fullscreen-dialog';
  }
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.data = {
    flag: __type,
    title:
      __type == 'FC'
        ? this.__SecondClient.client_name
        : this.__ThirdClient.client_name,
    dt: __type == 'FC' ? this.__SecondClient : this.__ThirdClient,
  };
  try {
    const dialogref = this.__dialog.open(
      CmnDialogForDtlsViewComponent,
      dialogConfig
    );
  } catch (ex) { }
}

}
