import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { bank } from 'src/app/__Model/__bank';
import { client } from 'src/app/__Model/__clientMst';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import __sipFrequency from '../../../../../../../assets/json/SipFrequency.json';
import buisnessType from '../../../../../../../assets/json/buisnessType.json';
import KycMst from '../../../../../../../assets/json/kyc.json';
import withoutKycMst from '../../../../../../../assets/json/withoutKyc.json';
import { option } from 'src/app/__Model/option';
import { plan } from 'src/app/__Model/plan';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { responseDT } from 'src/app/__Model/__responseDT';
import { Overlay } from '@angular/cdk/overlay';
import { CmnDialogForDtlsViewComponent } from '../../common/cmnDialogForDtlsView/cmnDialogForDtlsView.component';
import { DialogForCreateClientComponent } from '../../common/dialogForCreateClient/dialogForCreateClient.component';
import dateslist from '../../../../../../../assets/json/dates.json';
import { dates } from 'src/app/__Utility/disabledt';
import { rnt } from 'src/app/__Model/Rnt';
@Component({
selector: 'nfoModification-component',
templateUrl: './nfoModification.component.html',
styleUrls: ['./nfoModification.component.css']
})
export class NfomodificationComponent implements OnInit {
  __isEntryDTGreater: boolean = false;
  __rnt_login_at: rnt[];
  __sipDT: any=[];
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



  __isVisible:boolean =false;

  __sipfreq = __sipFrequency;
  __mcOptionMenu: any = [
    { flag: 'M', name: 'Minor', icon: 'person_pin' },
    { flag: 'P', name: 'Pan Holder', icon: 'credit_card' },
    { flag: 'N', name: 'Non Pan Holder', icon: 'credit_card_off' },
  ];
  __istemporaryspinner: boolean = false;
  __isEuinNumberVisible: boolean = false;
  __isclientVisible: boolean = false;

  __sipdtRng_amtRng: any = [];
  __subbrkArnMst: any = [];
  __checkAmt: boolean = true;
  __chkInvAmt: boolean = true;
  getamttocheckwith: any;
  getInvAmt:any;
  __SecondClient: client;
  __ThirdClient: client;
  __sec_clientMst: client[] = [];
  __third_clientMst: client[] = [];
  __isCldtlsEmpty: boolean = false;
  __issecCldtlsEmpty: boolean = true;
  __isthirdCldtlsEmpty: boolean = true;

  __schemeMstforSwitchTo: any = [];
  __dialogDtForSchemeTo: any;
  __dialogDtForClient: any;
  __dialogDtForScheme: any;
  __dialogDtForBnk: bank;
  __kycMst: any[];
  allowedExtensions = ['jpg', 'png', 'jpeg'];
  __buisness_type: any = buisnessType;
  __schemeMst: any = [];
  __clientMst: client[] = [];
  __bnkMst: bank[] = [];
  __euinMst: any = [];

  OptionMst: option[];
  PlanMst: plan[];
  @ViewChild('searchTin') __searchTin: ElementRef;
  @ViewChild('schemeRes') __schemeRes: ElementRef;
  @ViewChild('searchResult') __searchRlt: ElementRef;
  @ViewChild('subBrkArn') __subBrkArn: ElementRef;
  @ViewChild('clientCd') __clientCode: ElementRef;
  @ViewChild('searchbnk') __searchbnk: ElementRef;
  @ViewChild('secondclientCd') __secondCl: ElementRef;
  @ViewChild('thirdclientCd') __thirdCl: ElementRef;
  @ViewChild('secondClName') __secondClName: ElementRef;
  @ViewChild('thirdClName') __thirdClName: ElementRef;
  @ViewChild('schemeswitchTo') __scheme_swicth_to: ElementRef;

  __isSHowAdditionalTble: boolean = false;

  __trans_types_Cnt: any = [];
  __sipType: any=[];
  __transType: any = [];
  __temp_tinMst: any = [];
  __product_id: string = this.data.product_id;
  __product_type: string = this.data.trans_type_id;
  __traxForm = new FormGroup({
    kyc_status: new FormControl('', [Validators.required]),
    first_kyc: new FormControl('',[Validators.required]),
    tin_status: new FormControl('Y', [Validators.required]),
    temp_tin_no: new FormControl('', [Validators.required]),
    bu_type: new FormControl('', [Validators.required]),
    sub_brk_cd: new FormControl('', [Validators.required]),
    sub_arn_no: new FormControl('', [Validators.required]),
    euin_no: new FormControl('', [Validators.required]),
    inv_type: new FormControl(''),
    application_no: new FormControl(''),
    // recv_from: new FormControl(''),
    folio_number: new FormControl(''),
    scheme_id: new FormControl('', [Validators.required]),
    scheme_name: new FormControl('', [Validators.required]),
    client_id: new FormControl('', [Validators.required]),
    client_name: new FormControl('', [Validators.required]),
    client_code: new FormControl('', [Validators.required]),
    option: new FormControl('', [Validators.required]),
    plan: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required]),
    chq_no: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.pattern("^[0-9]*$")
    ]),
    chq_bank: new FormControl('', [Validators.required]),
    ack_filePreview: new FormControl(''),
    filePreview: new FormControl(''),
    app_form_scan: new FormControl(''),
    file: new FormControl('', [
      Validators.required,
      fileValidators.fileExtensionValidator(this.allowedExtensions),
    ]),
    remarks: new FormControl(''),
    trans_id: new FormControl('', [Validators.required]),
    form_scan_status: new FormControl(''),
    bank_id: new FormControl('', [Validators.required]),
    bank_name: new FormControl(''),
    mode_of_holding: new FormControl('', [Validators.required]),

    second_client_name: new FormControl(''),
    second_client_code: new FormControl(''),
    second_client_pan: new FormControl('', [
      Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'),
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
    second_client_id: new FormControl(''),
    second_client_kyc: new FormControl(''),
    first_inv_amt: new FormControl(''),
    third_client_name: new FormControl(''),
    third_client_code: new FormControl(''),
    third_client_pan: new FormControl('', [
      Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'),
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
    third_client_id: new FormControl(''),
    third_client_kyc: new FormControl(''),
    sip_type: new FormControl(''),
    sip_frequency: new FormControl(''),
    sip_duration: new FormControl(''),
    duration: new FormControl(''),
    period: new FormControl(''),
    sip_start_date: new FormControl(''),
    sip_end_date: new FormControl(''),
    sip_date: new FormControl(''),
    switch_amt: new FormControl(''),
    switch_scheme_to: new FormControl(''),
    scheme_id_to: new FormControl(''),

    switch_by: new FormControl(''),
    unit: new FormControl(''),
    all_unit: new FormControl(''),
    Switch_amt: new FormControl(''),
    option_to: new FormControl(''),
    plan_to: new FormControl(''),
    rnt_login_at: new FormControl('',[Validators.required])
  });

  send_date = new Date();
  formattedDate: any;
  constructor(
    public dialogRef: MatDialogRef<NfomodificationComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog,
    private overlay: Overlay
  ) {}

  ngOnInit() {
    this.getrntMst();
    this.getOptionMst();
    this.getPlanMst();
    this.getTransactionType();
  }

  getrntMst(){
    this.__dbIntr.api_call(0,'/rnt',null).pipe(pluck("data")).subscribe((res: rnt[]) =>{
      this.__rnt_login_at = res;
    })
  }
  getOptionMst() {
    this.__dbIntr
      .api_call(0, '/option', null)
      .pipe(pluck('data'))
      .subscribe((res: option[]) => {
        this.OptionMst = res;
      });
  }
  getPlanMst() {
    this.__dbIntr
      .api_call(0, '/plan', null)
      .pipe(pluck('data'))
      .subscribe((res: plan[]) => {
        this.PlanMst = res;
      });
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
        this.__transType = res;
      });
  }
  ngAfterViewInit() {
    this.__traxForm.controls['inv_type'].valueChanges.subscribe(res =>{
              if(res == 'A'){
                  this.setValidations([{name:'folio_number',valid:[Validators.required]}])
              }
              else{
                this.removeValidations([{name:'folio_number',valid:[Validators.required]}]);
              }
    })

    this.__traxForm.controls['temp_tin_no'].valueChanges
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
        tap(() => this.__istemporaryspinner = false),
      )
      .subscribe({
        next: (value) => {
          this.__temp_tinMst = value;
          this.searchResultVisibility('block');
          this.__istemporaryspinner = false;
        },
        complete: () => console.log(''),
        error: (err) => console.log(),
      });

    // Sub Broker ARN Search

    this.__traxForm.controls['sub_arn_no'].valueChanges.
      pipe(
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
          this.__traxForm.controls['sub_brk_cd'].setValue('');
        },
        complete: () => console.log(''),
        error: (err) => console.log()
      })




    //Scheme Search
    this.__traxForm.controls['scheme_name'].valueChanges
      .pipe(
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
        },
        complete: () => console.log(''),
        error: (err) => console.log(),
      });


      //scheme To Search
      this.__traxForm.controls['switch_scheme_to'].valueChanges.
      pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(dt => dt?.length > 1 ?
          this.__dbIntr.searchItems('/scheme', (dt + '&amc_id='+ this.__dialogDtForScheme?.amc_id + '&scheme_type='+ (this.data.trans_type_id == '4' ? 'N' : 'O')))
          : []),
        map((x: any) => x.data)
      ).subscribe({
        next: (value) => {
          this.__schemeMstforSwitchTo = value;
          console.log(this.__schemeMstforSwitchTo);
          this.searchResultVisibilityForSchemeSwicthTo('block');
        },
        complete: () => console.log(''),
        error: (err) => console.log()
      })


    //Client Code Search
    this.__traxForm.controls['client_code'].valueChanges
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
          this.__traxForm.patchValue({
            client_id: '',
            client_name: '',
          });
        this.__isclientVisible = false;
        },
        complete: () => console.log(''),
        error: (err) => console.log(),
      });

    //Second Client Code Search
    this.__traxForm.controls['second_client_code'].valueChanges
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
          this.__traxForm.patchValue({
            second_client_id: '',
            second_client_name: '',
            second_client_pan: '',
          });
        },
        complete: () => console.log(''),
        error: (err) => console.log(),
      });

    //Second Client Code Search
    this.__traxForm.controls['third_client_code'].valueChanges
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
          this.__traxForm.patchValue({
            third_client_id: '',
            third_client_name: '',
            third_client_pan: '',
          });
        },
        complete: () => console.log(''),
        error: (err) => console.log(),
      });

    // EUIN NUMBER SEARCH
    this.__traxForm.controls['euin_no'].valueChanges
      .pipe(
        tap(() => this.__isEuinNumberVisible = true),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1
            ? this.__dbIntr.searchItems(
              '/employee',
              dt +
              (this.__traxForm.controls['sub_arn_no'].value
                ? '&sub_arn_no=' +
                this.__traxForm.controls['sub_brk_cd'].value
                : '')
            )
            : []
        ),
        map((x: responseDT) => x.data),
        tap(() => this.__isEuinNumberVisible = false),
      )
      .subscribe({
        next: (value) => {
          console.log(value);
          this.__euinMst = value;
          this.searchResultVisibilityForEuin('block');
          this.__isEuinNumberVisible = false;
        },
        complete: () => console.log(''),
        error: (err) => console.log(),
      });

    // Bank SEARCH
    this.__traxForm.controls['chq_bank'].valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.searchItems('/depositbank', dt) : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe({
        next: (value) => {
          console.log(value);
          this.__bnkMst = value;
          this.searchResultVisibilityForBnk('block');
        },
        complete: () => console.log(''),
        error: (err) => console.log(),
      });

    //Transaction Type change
    this.__traxForm.controls['trans_id'].valueChanges.subscribe((res) => {
      if (res == '5') {
        this.getSipTypeMst();
        this.setValidations(
          [{ name: 'sip_type', valid: [Validators.required] },
            { name: 'sip_frequency', valid: [Validators.required] },
          { name: 'sip_duration', valid: [Validators.required] },
          { name: 'duration', valid: [Validators.required] },
          // { name: 'sip_date', valid: [Validators.required] },
          { name: 'sip_start_date', valid: [Validators.required] },
          { name: 'sip_end_date', valid: [Validators.required] }]
        )
      } else {
        this.removeValidations(
          [{ name: 'sip_type', valid: [Validators.required] },
            { name: 'sip_frequency', valid: [Validators.required] },
          { name: 'inv_type', valid: [Validators.required] },
          { name: 'sip_duration', valid: [Validators.required] },
          { name: 'duration', valid: [Validators.required] },
          // { name: 'sip_date', valid: [Validators.required] },
          { name: 'sip_start_date', valid: [Validators.required] },
          { name: 'sip_end_date', valid: [Validators.required] }]
        )
        this.__traxForm.patchValue({
          sip_frequency: '',
          sip_duration: '',
          duration: '',
          period: '',
          sip_start_date: '',
          sip_end_date: '',
          sip_date:''
        });
      }
        this.__checkAmt = res == '6' ? false : this.__checkAmt;
        this.__chkInvAmt = res == '5' ? true : false;
        if(res == '6'){
          this.removeValidations(
            [
              {name:'amount',valid:[Validators.required]},
              {name:'chq_no',valid:[
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(6),
                Validators.pattern("^[0-9]*$")]},
              {name:'chq_bank',valid:[Validators.required]},
              {name:'bank_id',valid:[Validators.required]},
            ])
        }
        else{
          this.setValidations(
            [
              {name:'amount',valid:[Validators.required]},
              {name:'chq_no',valid:[Validators.required,
                Validators.minLength(6),
                Validators.maxLength(6),
                Validators.pattern("^[0-9]*$")]},
              {name:'chq_bank',valid:[Validators.required]},
              {name:'bank_id',valid:[Validators.required]},
            ])
        }
    });

    //Sip Type Change
    this.__traxForm.controls['sip_type'].valueChanges.subscribe(res =>{
         if(res == '2'){
          this.removeValidations([
            {name:'chq_no',valid:[
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(6),
                Validators.pattern("^[0-9]*$")]
              }
              ]);

         }
         else{
          this.setValidations([{name:'chq_no',valid:[
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6),
            Validators.pattern("^[0-9]*$")]}]);
         }
         this.__chkInvAmt = res == '2' ? this.__chkInvAmt : true;
    })

    //Sip_duration change
     this.__traxForm.controls['sip_duration'].valueChanges.subscribe((res) => {
           if(res == 'P'){
              this.removeValidations([{name:'duration',valid:[Validators.required]}]);
               let getDT = new Date();
               console.log(getDT.getDate()+'/12/2999');
              this.__traxForm.get('sip_end_date').setValue('2999-12-'+getDT.getDate());
              console.log( this.__traxForm.get('sip_end_date').value);

           }
           else{
             if(this.__traxForm.get('trans_id').value == '5'){
              this.setValidations([{name:'duration',valid:[Validators.required]}]);
              this.__traxForm.get('sip_end_date').setValue('');
             }
           }
    });

    //mode_of_holding change
    this.__traxForm.controls['mode_of_holding'].valueChanges.subscribe(res => {
      if (res == 'S') {
        this.getadditionalApplicant(null, 'FC');
        this.getadditionalApplicant(null, 'TC');
        this.__isSHowAdditionalTble = false;
      }
    })

    //Change in Durations
    this.__traxForm.controls['duration'].valueChanges.subscribe(res => {
      this.setSipEndDate();
    })
    //Period in Durations
    this.__traxForm.controls['period'].valueChanges.subscribe(res => {
      this.setSipEndDate();
    })

    //Tin Status Change
    this.__traxForm.controls['tin_status'].valueChanges.subscribe(res => {
      if (res == 'Y') {
        this.setValidations([{ name: 'temp_tin_no', valid: [Validators.required] }]);
      }
      else {
        this.removeValidations([{ name: 'temp_tin_no', valid: [Validators.required] }]);
      }
      this.__traxForm.controls['temp_tin_no'].reset('',{ onlySelf: true,emitEvent: false});
    })

    this.__traxForm.get('first_inv_amt').valueChanges.subscribe(res =>{
      if(this.__traxForm.get('inv_type').value == 'F'){
             this.checkFirstInvAmtrightornot(
              this.__sipdtRng_amtRng.pip_fresh_min_amt,
              Number(res)
             )
      }
      else if(this.__traxForm.get('inv_type').value == 'A'){
        this.checkFirstInvAmtrightornot(
          this.__sipdtRng_amtRng.pip_add_mitn_amt,
          Number(res)
         )
      }
      else{
        //Not Need to do anything
      }
    })

    //Amount Change Event for pip & sip
    this.__traxForm.get('amount').valueChanges.subscribe(res =>{
      // console.log(res);
      if(this.__traxForm.get('trans_id').value == 4 || this.__traxForm.get('trans_id').value == 5){
          if(this.__traxForm.get('inv_type').value == 'F'){
             this.checkAmtrightorNot(
              this.__traxForm.get('trans_id').value == 4 ?
              this.__sipdtRng_amtRng.pip_fresh_min_amt: this.__sipdtRng_amtRng.sip_fresh_min_amt,
              Number(res));
          }
          else{
            this.checkAmtrightorNot(
              this.__traxForm.get('trans_id').value == 4 ?
              this.__sipdtRng_amtRng.pip_add_min_amt: this.__sipdtRng_amtRng.sip_add_min_amt,
              Number(res));
          }
      }
      else{
        //no need to check
      }
    })

    //change in buisness type
    this.__traxForm.get('bu_type').valueChanges.subscribe(res => {
       if(res == 'B'){
        this.setValidations([{name:'sub_brk_cd',valid:[Validators.required]},{name:'sub_arn_no',valid:[Validators.required]}]);
       }
       else{
        this.removeValidations([{name:'sub_brk_cd',valid:[Validators.required]},{name:'sub_arn_no',valid:[Validators.required]}]);
       }
    })

    //Kyc_status Change
    this.__traxForm.get('kyc_status').valueChanges.subscribe(res =>{
      console.log(res);
      this.__kycMst = res == 'Y' ? KycMst : withoutKycMst;
      // if(res == 'Y'){
      //   this.setValidations([{name:'first_kyc',valid:[Validators.required]}])
      // }
      // else{this.removeValidations([{name:'first_kyc',valid:[Validators.required]}])}
    })
  }
  //Sub Broker search result off
  searchResultVisibilityForSubBrkArn(display_mode) {
    this.__subBrkArn.nativeElement.style.display = display_mode;
  }

  //Temp Tin Search Resullt off
  searchResultVisibility(display_mode) {
    this.__searchTin.nativeElement.style.display = display_mode;
  }
  //Scheme Search Resullt off
  searchResultVisibilityForScheme(display_mode) {
    this.__schemeRes.nativeElement.style.display = display_mode;
  }
  //first client Search Resullt off
  searchResultVisibilityForClient(display_mode) {
    this.__clientCode.nativeElement.style.display = display_mode;
  }
  //Euin Search Resullt off
  searchResultVisibilityForEuin(display_mode) {
    this.__searchRlt.nativeElement.style.display = display_mode;
  }
  //bank Search Resullt off
  searchResultVisibilityForBnk(display_mode) {
    this.__searchbnk.nativeElement.style.display = display_mode;
  }
  //second client Search Resullt off
  searchResultVisibilityForSecondClient(display_mode) {
    this.__secondCl.nativeElement.style.display = display_mode;
  }
  //third client Search Resullt off
  searchResultVisibilityForThirdClient(display_mode) {
    this.__thirdCl.nativeElement.style.display = display_mode;
  }
  //scheme To Search Resullt off
  searchResultVisibilityForSchemeSwicthTo(display_mode) {
    this.__scheme_swicth_to.nativeElement.style.display = display_mode;
  }
  setValidations(__frmCtrl) {
    __frmCtrl.forEach(element => {
      this.__traxForm.controls[element.name].setValidators(element.valid);
      this.__traxForm.controls[element.name].updateValueAndValidity();
    });
  }
  removeValidations(__frmCtrl) {
    __frmCtrl.forEach(element => {
      this.__traxForm.controls[element.name].removeValidators(element.valid);
      this.__traxForm.controls[element.name].updateValueAndValidity();
    });
  }
  getadditionalApplicant(__items, __type) {
    switch (__type) {
      case 'FC':
        this.__SecondClient = __items;
        this.__traxForm.controls['second_client_code'].reset(
          __items ? __items.client_code : '',
          { onlySelf: true, emitEvent: false }
        );
        this.__traxForm.patchValue({
          second_client_name: __items ? __items.client_name : '',
          second_client_id: __items ? __items.id : '',
          second_client_pan: __items ? __items.pan : '',
        });
        this.searchResultVisibilityForSecondClient('none');
        break;
      case 'TC':
        this.__ThirdClient = __items;
        this.__traxForm.controls['third_client_code'].reset(
          __items ? __items.client_code : '',
          { onlySelf: true, emitEvent: false }
        );
        this.__traxForm.patchValue({
          third_client_name: __items ? __items.client_name : '',
          third_client_id: __items ? __items.id : '',
          third_client_pan: __items ? __items.pan : '',
        });
        this.searchResultVisibilityForThirdClient('none');
        break;
      default:
        break;
    }
  }
  setSipEndDate() {
    if (this.__traxForm.controls['period'].value && this.__traxForm.controls['duration'].value) {
      let getDT = new Date(this.__traxForm.controls['sip_start_date'].value);
      this.__traxForm.controls['period'].value == 'Y' ?
        getDT.setFullYear(new Date().getFullYear() + Number(this.__traxForm.controls['duration'].value))
        : getDT.setMonth(getDT.getMonth() + Number(Number(this.__traxForm.controls['duration'].value)));
      this.__traxForm.controls['sip_end_date'].setValue(getDT.toISOString().slice(0, 10));
    }
    else {
      this.__traxForm.controls['sip_end_date'].setValue('');
    }

  }
  checkAmtrightorNot(checkWithamt,checkAmt){
    if(checkWithamt){
      this.getamttocheckwith = Number(checkWithamt);
      this.__checkAmt = checkAmt <  Number(checkWithamt) ? true : false;
    }
    else{
      this.__checkAmt = true;
    }

  }

  checkFirstInvAmtrightornot(checkWithamt,checkAmt){
    console.log(checkWithamt+ "  - " + checkAmt);

    if(checkWithamt){
      this.getInvAmt = Number(checkWithamt);
      console.log(checkAmt <  Number(checkWithamt) ? true : false);
      this.__chkInvAmt = checkAmt <  Number(checkWithamt) ? true : false;
    }
    else{
      this.__chkInvAmt = true;
    }
  }
  getItems(__items) {
    console.log(__items);
    this.searchResultVisibility('none');
    console.log(__items.inv_type);

    this.__traxForm.patchValue({
      bu_type: __items.bu_type,
      application_no: __items.application_no,
      folio_number: __items.folio_no,
      // recv_from: __items.recv_from,
      inv_type: __items.inv_type,
      trans_id: __items.trans_id,
      kyc_status: __items.kyc_status,
    });
    if(__items.bu_type == 'B'){
      this.__traxForm.controls['sub_brk_cd'].setValue(__items.sub_brk_cd)
      this.__traxForm.controls['sub_arn_no'].reset(__items.sub_arn_no,{  onlySelf: true,emitEvent: false,});
    }
    else{
      this.removeValidations([{name:'sub_brk_cd',valid:[Validators.required]},
                              {name:'sub_arn_no',valid:[Validators.required]}]
                              );
    }

    this.__traxForm.controls['euin_no'].reset(
      __items.euin_no + ' - ' + __items.emp_name,
      { onlySelf: true, emitEvent: false }
    );
    this.__traxForm.controls['client_code'].reset(__items.client_code, {
      onlySelf: true,
      emitEvent: false,
    });
    this.__traxForm.patchValue({
      client_name: __items.client_name,
      client_id: __items.client_id,
    });
    this.__traxForm.controls['scheme_name'].reset(__items.scheme_name, {
      onlySelf: true,
      emitEvent: false,
    });
    this.__traxForm.patchValue({ scheme_id: __items.scheme_id });
    if(__items.trans_id == 6){
      this.__traxForm.controls['switch_scheme_to'].reset(__items.scheme_name_to, {
        onlySelf: true,
        emitEvent: false,
      });
      this.__traxForm.patchValue({ scheme_id_to: __items.scheme_id_to });
      this.__dialogDtForSchemeTo = {
        id: __items.scheme_id_to,
        scheme_name: __items.scheme_name_to,
      };
    }
    this.__dialogDtForClient = {
      id: __items.client_id,
      client_type: __items.client_type,
      client_name: __items.client_name,
    };
    this.__dialogDtForScheme = {
      id: __items.scheme_id,
      scheme_name: __items.scheme_name,
      amc_id:__items.amc_id
    };

    this.__clientMst.push(this.__dialogDtForClient);
    this.__isCldtlsEmpty = this.__clientMst.length > 0 ? false : true;
      this.getschemwisedt(__items.scheme_id);
  }
  getschemwisedt(__scheme_id) {
    this.__dbIntr.api_call(0, '/scheme', 'scheme_id=' + __scheme_id).pipe(pluck("data")).subscribe(res => {
      this.setStartDateAgainstScheme(res[0].sip_date);
      this.__sipdtRng_amtRng = res[0];
       console.log(this.__sipdtRng_amtRng);

      var date = new Date(); // Now
      date.setDate(date.getDate() + 30);

      if(JSON.parse(res[0].sip_date).findIndex((x:any) => x.date ==  (date.getDate()).toString()) != -1)
      {
          this.__traxForm.patchValue({
            sip_start_date: date.toISOString().slice(0, 10),
          })
      }
      else{
        var found = JSON.parse(res[0]?.sip_date).find(function(element) {return Number(element.date) > Number(date.getDate())});
         if(found){
                this.__traxForm.get('sip_start_date').setValue(date.getFullYear()+'-'+(date.getMonth().toString().length > 1 ?  date.getMonth() : '0'+date.getMonth())+'-'+found.date);
         }
         else{
           date.setDate(date.getDate() + 60);
          this.__traxForm.get('sip_start_date').setValue(
            date.getFullYear()
            +'-'+
            (date.getMonth().toString().length > 1 ?  date.getMonth() : '0'+
            date.getMonth())
            +'-'+
             (JSON.parse(res[0]?.sip_date)[0].date.length > 1 ? JSON.parse(res[0]?.sip_date)[0].date
             :'0'+JSON.parse(res[0]?.sip_date)[0].date));
           console.log( this.__traxForm.get('sip_start_date').value);

        }
      }
    })
  }

  setStartDateAgainstScheme(__dt){
    if(this.__traxForm.get('trans_id').value == '5'){
      this.__sipDT = JSON.parse(__dt);
      this.__traxForm.get('sip_date').setValue(JSON.parse(__dt))
    }
  }

  getItemsDtls(__euinDtls, __type) {
    switch (__type) {
      case 'E':
        this.__traxForm.controls['euin_no'].reset(
          __euinDtls.euin_no + ' - ' + __euinDtls.emp_name,
          { onlySelf: true, emitEvent: false }
        );
        this.searchResultVisibilityForEuin('none');
        break;
      case 'S':
        this.__traxForm.controls['sub_arn_no'].reset(__euinDtls.arn_no + ' - ' + __euinDtls.bro_name, { onlySelf: true, emitEvent: false });
        this.__traxForm.controls['sub_brk_cd'].setValue(__euinDtls.code);
        this.searchResultVisibilityForSubBrkArn('none');
        break;

      case 'C':
        this.__dialogDtForClient = __euinDtls;
        this.__traxForm.controls['client_code'].reset(__euinDtls.client_code, {
          onlySelf: true,
          emitEvent: false,
        });
        this.__traxForm.patchValue({
          client_name: __euinDtls.client_name,
          client_id: __euinDtls.id,
        });
        this.searchResultVisibilityForClient('none');
        break;

      case 'SC':

        this.__traxForm.controls['scheme_name'].reset(__euinDtls.scheme_name, {
          onlySelf: true,
          emitEvent: false,
        });

        this.getschemwisedt(__euinDtls.id);
        if(this.__traxForm.value.tin_status == 'N'){
          if(this.checkWhetherNfoEntryDateisgreaterornot(__euinDtls.nfo_entry_date)){
            this.__traxForm.patchValue({scheme_id:__euinDtls.id});
            this.searchResultVisibilityForScheme('none');
            this.__dialogDtForScheme = __euinDtls;
            this.getschemwisedt(__euinDtls.id);
            }
            else{
              this.__traxForm.patchValue({scheme_id:''});
              this.searchResultVisibilityForScheme('none');
              this.__dialogDtForScheme = null;
            }
        }
        else{
          this.__dialogDtForScheme = __euinDtls;
          this.__traxForm.patchValue({ scheme_id: __euinDtls.id });
          this.searchResultVisibilityForScheme('none');
          this.getschemwisedt(__euinDtls.id);
        }

        break;

      case 'B':
        this.__dialogDtForBnk = __euinDtls;
        this.__traxForm.controls['chq_bank'].reset(__euinDtls.micr_code, {
          onlySelf: true,
          emitEvent: false,
        });
        this.__traxForm.controls['bank_name'].setValue(__euinDtls.bank_name);
        this.__traxForm.controls['bank_id'].setValue(__euinDtls.id);
        this.searchResultVisibilityForBnk('none');
        break;

     case 'ST': this.__dialogDtForSchemeTo = __euinDtls;
                  this.__traxForm.controls['switch_scheme_to'].reset(__euinDtls.scheme_name,{ onlySelf: true, emitEvent: false });
                  this.__traxForm.patchValue({scheme_id_to : __euinDtls.id});
                  this.searchResultVisibilityForSchemeSwicthTo('none');
                  break;
      default:  break;
    }
  }
  checkWhetherNfoEntryDateisgreaterornot(__entrDt){
    this.__isEntryDTGreater = __entrDt > new Date().toISOString().substring(0,10) ? false : true;
    return !this.__isEntryDTGreater;
}

  outsideClickforScheme(__ev) {
    if (__ev) {
      this.searchResultVisibilityForScheme('none');
    }
  }
  outsideClick(__ev) {
    this.__isEuinNumberVisible = false;
    if (__ev) {
      this.searchResultVisibilityForEuin('none');
    }
  }
  outsideClickforClient(__ev) {
    // this.__isclientVisible = false;
    if (__ev) {
      this.searchResultVisibilityForClient('none');
    }
  }
  outsideClickforbank(__ev) {
    if (__ev) {
      this.searchResultVisibilityForBnk('none');
    }
  }
  outsideClickforSecondClient(__ev) {
    if (__ev) {
      this.searchResultVisibilityForSecondClient('none');
    }
  }
  outsideClickforThirdClient(__ev) {
    if (__ev) {
      this.searchResultVisibilityForThirdClient('none');
    }
  }
  outsideClickfortempTin(__ev) {
    this.__istemporaryspinner = false;
    if (__ev) {
      this.searchResultVisibility('none');
    }
  }
  outsideClickforSubBrkArn(__ev) {
    if (__ev) {
      this.searchResultVisibilityForSubBrkArn('none');
    }
  }

  outsideClickForSchemeSwitchTo(__ev){
    if(__ev){
         this.searchResultVisibilityForSchemeSwicthTo('none');
    }
  }

   getSipTypeMst(){
    this.__dbIntr.api_call(0,'/sipType',null).pipe(map((x: any) => x.data)).subscribe(res =>{
      console.log(res);
      this.__sipType = res;
    })
   }

  getFIle(__ev) {
    console.log(__ev);

    this.__traxForm
      .get('file')
      .setValidators([
        Validators.required,
        fileValidators.fileExtensionValidator(this.allowedExtensions),
        fileValidators.fileSizeValidator(__ev.files),
      ]);
    this.__traxForm.get('file').updateValueAndValidity();
    if (
      this.__traxForm.get('file').status == 'VALID' &&
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
    console.log(this.__traxForm.get('app_form_scan'));
  }
  setFormControl(formcontrlname, __val) {
    console.log(formcontrlname);

    this.__traxForm.get(formcontrlname).patchValue(__val);
  }
  submit() {
    if (this.__traxForm.invalid) {
      this.__utility.showSnackbar(
        'Error!! Form submition failed due to some error',
        0
      );
      return;
    }
    else if(this.__checkAmt){
      this.__utility.showSnackbar(
        'Error!! please provide valid amount',
        0
      );
      return;
    }
    else{
    const fb = new FormData();
    fb.append('first_inv_amt',this.__traxForm.value.first_inv_amt ? this.__traxForm.value.first_inv_amt : '');
    fb.append('rnt_login_at',this.__traxForm.value.rnt_login_at ? this.__traxForm.value.rnt_login_at : '');

    fb.append('sip_type',this.__traxForm.value.sip_type ? this.__traxForm.value.sip_type : '');
    fb.append("bu_type",this.__traxForm.value.bu_type);
    fb.append("sub_brk_cd",this.__traxForm.value.sub_brk_cd ? this.__traxForm.value.sub_brk_cd : '');
    fb.append("sub_arn_no",this.__traxForm.value.sub_arn_no ? this.__traxForm.value.sub_arn_no.split(' ')[0] : '');
    fb.append('temp_tin_no', this.__traxForm.value.temp_tin_no);
    fb.append('remarks', this.__traxForm.value.remarks);
    fb.append("kyc_status",this.__traxForm.value.kyc_status);
    fb.append('first_client_id', this.__traxForm.value.client_id);
    fb.append('first_kyc', this.__traxForm.value.kyc_status ==  'Y' ? this.__traxForm.value.first_kyc : '');
    fb.append('second_client_id', this.__traxForm.value.second_client_id != "null" ? this.__traxForm.value.second_client_id : '' );
    fb.append('second_client_kyc', this.__traxForm.value.second_client_kyc != "null" ? this.__traxForm.value.second_client_kyc : '' );
    fb.append('second_client_name', this.__traxForm.value.second_client_name != "null" ? this.__traxForm.value.second_client_name : '' );
    fb.append('second_client_pan', this.__traxForm.value.second_client_pan != "null" ? this.__traxForm.value.second_client_pan : '' );
    fb.append('third_client_id', this.__traxForm.value.third_client_id != "null" ? this.__traxForm.value.third_client_id : '' );
    fb.append('third_client_name', this.__traxForm.value.third_client_name != "null" ? this.__traxForm.value.third_client_name : '' );
    fb.append('third_client_pan', this.__traxForm.value.third_client_pan != "null" ? this.__traxForm.value.third_client_pan : '' );
    fb.append('third_client_kyc', this.__traxForm.value.third_client_kyc != "null" ? this.__traxForm.value.third_client_kyc : '' );
    // fb.append('recv_from', this.__traxForm.value.recv_from);
    fb.append('scheme_id', this.__traxForm.value.scheme_id);
    fb.append('amount',this.__traxForm.value.trans_id == '6' ? this.__traxForm.value.switch_amt : this.__traxForm.value.amount);
    fb.append('folio_no',this.__traxForm.value.folio_number)
    fb.append('trans_id', this.__traxForm.value.trans_id);
    fb.append('chq_no',this.__traxForm.value.trans_id == '6' ?  '' : this.__traxForm.value.chq_no);
    fb.append('chq_bank',  this.__traxForm.value.trans_id == '6' ?  '' :  this.__traxForm.value.bank_id);
    fb.append('trans_type_id', this.__product_type);
    fb.append('app_form_scan', this.__traxForm.value.app_form_scan);
    fb.append('tin_status', this.__traxForm.value.tin_status);
    fb.append('plan', this.__traxForm.value.plan);
    fb.append('option', this.__traxForm.value.option);
    fb.append('inv_type', this.__traxForm.value.inv_type);
    fb.append('mode_of_holding', this.__traxForm.value.mode_of_holding);
    fb.append('euin_no', this.__traxForm.value.euin_no ? this.__traxForm.value.euin_no.split(' ')[0] : '');
    if (this.__traxForm.value.trans_id == '5') {
      fb.append('sip_start_date', this.__traxForm.value.sip_start_date);
      fb.append('sip_end_date', this.__traxForm.value.sip_end_date);
      fb.append('sip_duration', this.__traxForm.value.sip_duration);
      fb.append('duration', this.__traxForm.value.duration);
      fb.append('period', this.__traxForm.value.period);
      fb.append('sip_frequency', this.__traxForm.value.sip_frequency);
    }
    if (this.__traxForm.value.bu_type == '5') {
      fb.append('sub_brk_cd', this.__traxForm.value.sub_brk_cd ? this.__traxForm.value.sub_brk_cd.split(' ')[0] : '');
      fb.append('sub_arn_no', this.__traxForm.value.sub_arn_no ? this.__traxForm.value.sub_arn_no : '');
    }
    if(this.__traxForm.value.trans_id == '6'){
      fb.append('option_to', this.__traxForm.value.option_to);
      fb.append('plan_to', this.__traxForm.value.plan_to);
      fb.append('scheme_id_to', this.__traxForm.value.scheme_id_to);
      fb.append('switch_by',this.__traxForm.value.switch_by);
      fb.append('unit',this.__traxForm.value.switch_by == 'U' ? this.__traxForm.value.unit : this.__traxForm.value.all_unit);
    }
    this.__dbIntr.api_call(1, '/mfTraxCreate', fb).subscribe((res: any) => {
      if(res.suc == 1){
        this.__traxForm.reset();
        this.__traxForm.controls['tin_status'].patchValue('Y');
        this.__dialogDtForBnk = null;
        this.__SecondClient = null;
        this.__ThirdClient = null;
        this.__dialogDtForSchemeTo = null;
        this.__dialogDtForClient = null;
        this.__dialogDtForScheme = null;
      }
      this.__utility.showSnackbar(
        res.suc == 1 ? 'Form Submitted Successfully' : res.msg,
        res.suc
      );
    });
   }
  }
  createClientTemporary(__mode) {
    this.getadditionalApplicant(null, __mode);
    if (__mode == 'FC') {
      this.__secondClName.nativeElement.focus();
    } else {
      this.__thirdClName.nativeElement.focus();
    }

  }
  cancel() {
    this.getadditionalApplicant(null, 'TC');
    this.__isSHowAdditionalTble = !this.__isSHowAdditionalTble;
  }
  // navigateTODashboard(__items) {
  //   this.__utility.navigatewithqueryparams('/main/operations/mfTraxEntry/fin', {
  //     queryParams: {
  //       product_id: this.data.id,
  //       trans_type_id: this.data.trans_type_id,
  //       trans_id: btoa(__items.id)
  //     }
  //   })
  // }
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

  openDialog(__type) {
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
          : __type == 'S'
            ? this.__dialogDtForScheme.scheme_name
            : __type == 'ST' ? this.__dialogDtForSchemeTo.scheme_name
            :this.__dialogDtForBnk.bank_name,
      dt:
        __type == 'C'
          ? this.__dialogDtForClient
          : __type == 'S'
            ? this.__dialogDtForScheme
            : __type == 'ST'
            ? this.__dialogDtForSchemeTo :
            this.__dialogDtForBnk,
    };
    try {
      const dialogref = this.__dialog.open(
        CmnDialogForDtlsViewComponent,
        dialogConfig
      );
    } catch (ex) { }
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
            case 'S':
              this.__issecCldtlsEmpty = false;
              this.getadditionalApplicant(dt.data, 'FC');
              break;
            case 'T':
              this.__isthirdCldtlsEmpty = false;
              this.getadditionalApplicant(dt.data, 'TC');
              break;
            default:
              break;
          }
        }
      });
    } catch (ex) { }
  }
  preventNonumeric(__ev) {
    dates.numberOnly(__ev)
  }

  public onFilterChange(item: any) {
    console.log(item);
  }
  public onDropDownClose(item: any) {
    console.log(item);
  }

  public onItemSelect(item: any) {
    console.log(item);
  }
  public onDeSelect(item: any) {
    console.log(item);
  }

  public onSelectAll(items: any) {
    console.log(items);
  }
  public onDeSelectAll(items: any) {
    console.log(items);
  }
  setStartDT(__ev){
    console.log(__ev);

     this.setEndDate(__ev.target.value);
  }
  setEndDate(__dt){
    console.log(__dt);

    var dt;
      if(this.__traxForm.controls['sip_frequency'].value == 'D'){
              //Daily
          dt = new Date(this.__traxForm.get('sip_start_date').value);
          let _calculateDT = new Date(dt.setDate(dt.getDate() + Number(__dt))).toISOString().substring(0 ,10);
          this.__traxForm.controls['sip_end_date'].setValue(_calculateDT);

      }
      else if(this.__traxForm.controls['sip_frequency'].value == 'W'){
              //weekly
              // dt = new Date(this.__traxForm.get('sip_start_date').value);
              // let _calculateDT = new Date(dt.setDate(dt.getDate() + (Number(__dt) * 7))).toISOString().substring(0 ,10);
              // this.__traxForm.controls['sip_end_date'].setValue(_calculateDT);

      }
      else if(this.__traxForm.controls['sip_frequency'].value == 'F'){
              //fortnightly

      }
      else if(this.__traxForm.controls['sip_frequency'].value == 'M'){
              //Monthly
              dt = new Date(this.__traxForm.get('sip_start_date').value);
              let _calculateDT = new Date(dt.setMonth(dt.getMonth() + Number(__dt))).toISOString().substring(0 ,10);
              this.__traxForm.controls['sip_end_date'].setValue(_calculateDT);
      }
      else if(this.__traxForm.controls['sip_frequency'].value == 'Q'){
              //Querterly

      }
      else if(this.__traxForm.controls['sip_frequency'].value == 'S'){
              //Semi Anually

      }
      else if(this.__traxForm.controls['sip_frequency'].value == 'A'){
              //Anually
      }
  }

}