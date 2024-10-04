import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { bank } from 'src/app/__Model/__bank';
import { scheme } from 'src/app/__Model/__schemeMst';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { global } from 'src/app/__Utility/globalFunc';
import { environment } from 'src/environments/environment';
import buisnessType from '../../../../../../../../../assets/json/buisnessType.json';
import clientType from '../../../../../../../../../assets/json/clientTypeMenu.json';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { CreateClientComponent } from 'src/app/shared/create-client/create-client.component';
import { client } from 'src/app/__Model/__clientMst';
import { PreviewdtlsDialogComponent } from 'src/app/shared/core/previewdtls-dialog/previewdtls-dialog.component';
import { plan } from 'src/app/__Model/plan';
import { option } from 'src/app/__Model/option';
import { rnt } from 'src/app/__Model/Rnt';
import { dates } from 'src/app/__Utility/disabledt';
import { CreateBankComponent } from 'src/app/shared/create-bank/create-bank.component';
import KycMst from '../../../../../../../../../assets/json/kyc.json';
import withoutKycMst from '../../../../../../../../../assets/json/withoutKyc.json';
import { responseDT } from 'src/app/__Model/__responseDT';
@Component({
  selector: 'app-financial-entry',
  templateUrl: './financial-entry.component.html',
  styleUrls: ['./financial-entry.component.css']
})
export class FinancialEntryComponent implements OnInit {
    getInvAmt: any;
  __rnt_login_at: rnt[];
  __buisness_type: any = buisnessType;
  __subbrkArnMst: any = [];
  __kycMst: any[];
  __isSHowAdditionalTble: boolean = false;
  __sec_clientMst: client[] = [];
  __issecClientSpinnerPending: boolean = false;
  __isthirdClientSpinnerPending: boolean = false;
  __third_clientMst: client[] = [];
  __isschemeToSpinner: boolean = false;
  __schemeMstforSwitchTo: any = [];
  __istemporaryspinner: boolean = false;
  __noofdaystobeAdded: any;

  __mcOptionMenu: any = [
    { flag: 'M', name: 'Minor', icon: 'person_pin' },
    { flag: 'P', name: 'Pan Holder', icon: 'credit_card' },
    { flag: 'N', name: 'Non Pan Holder', icon: 'credit_card_off' },
  ];
  @Input() __product_type:any;
  __product_id: string =  '1';
  __transType: any = [];
  __isSubBrkArnSpinner: boolean = false;
  __isEuinNumberVisible: boolean = false;
  __isclientVisible: boolean = false;
  __SecondClient: any;
  __ThirdClient: any;
  __secondkycMst: any = [];
  __thirdkycMst: any = [];
  __temp_tinMst: any = [];
  __euinMst: any = [];
  __schemeMst: any = [];
  __clientMst: any = [];
  __sipdtRng_amtRng: scheme;
  getamttocheckwith: any;
  __sipfreq: any = [];
  __bnkMst: bank[] = [];
  allowedExtensions = ['pdf'];
  __sipType: any = [];
  __chkInvAmt: boolean = true;

  __isCldtlsEmpty: boolean = false;
  __swp_freq: any = [];
  clientTypeMst = clientType;
  __isschemeSpinner: boolean = false;
  OptionMst: option[];
  PlanMst: plan[];
  __isMicrSpinner: boolean = false;

  displayMode_forTTIN: string;
  displayMode_forSub_arn_no: string;
  displayMode_forEuin: string;
  displayMode_forClient: string;
  displayMode_forScm: string;
  displayMode_forScmTo: string;
  displayMode_for_sec_client: string;
  displayMode_for_third_client: string;
  displayMode_forBnk: string;
  __dialogDtForClient: any;
  __dialogDtForScheme: any;
  __dialogDtForBnk: bank;
  __dialogDtForSchemeTo: any;
  __sipDT: any = [];
  @ViewChild('secondClName') __secondClName: ElementRef;
  @ViewChild('thirdClName') __thirdClName: ElementRef;

  __traxForm = new FormGroup({
    second_kyc_status: new FormControl(''),
    third_kyc_status: new FormControl(''),
    sip_name: new FormControl(''),
    swp_freq: new FormControl('', { updateOn: 'blur' }),
    swp_start_date: new FormControl('', { updateOn: 'blur' }),
    swp_duration: new FormControl('', { updateOn: 'blur' }),
    swp_installment_amt: new FormControl(''),
    swp_end_date: new FormControl(''),

    kyc_status: new FormControl('', [Validators.required]),
    first_kyc: new FormControl('', [Validators.required]),
    tin_status: new FormControl('Y', [Validators.required]),
    temp_tin_no: new FormControl('', {
      validators: [Validators.required],
      asyncValidators: [this.TemporaryTINValidators()],
    }),
    bu_type: new FormControl('', [Validators.required]),
    sub_brk_cd: new FormControl('', [Validators.required]),
    sub_arn_no: new FormControl('', [Validators.required]),
    euin_no: new FormControl('', {
      validators: [Validators.required],
      asyncValidators: [this.EUINValidators()],
    }),
    inv_type: new FormControl(''),
    application_no: new FormControl(''),
    // recv_from: new FormControl(''),
    folio_number: new FormControl(''),
    scheme_id: new FormControl('', [Validators.required]),
    scheme_name: new FormControl('', {
      validators: [Validators.required],
      asyncValidators: [this.SchemeValidators()],
    }),
    client_id: new FormControl('', [Validators.required]),
    client_name: new FormControl(''),
    client_code: new FormControl('', {
      validators: [Validators.required],
      asyncValidators: [this.ClientValidators()],
    }),
    option: new FormControl('', [Validators.required]),
    plan: new FormControl('', [Validators.required]),
    amount: new FormControl('', {
      validators: [Validators.required],
      asyncValidators: [this.AmountValidators()],
    }),
    chq_no: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.pattern('^[0-9]*$'),
    ]),
    chq_bank: new FormControl(''
    , {
      validators: [Validators.required],
      asyncValidators: [this.MICRValidators()],
    }
    ),
    ifsc: new FormControl(''),
    branch_name: new FormControl(''),
    ack_filePreview: new FormControl(''),
    filePreview: new FormControl(''),
    app_form_scan: new FormControl(''),
    file: new FormControl('', [
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
    duration: new FormControl('', { updateOn: 'blur' }),
    period: new FormControl(''),
    sip_start_date: new FormControl(''),
    sip_end_date: new FormControl(''),
    sip_date: new FormControl('', { updateOn: 'blur' }),
    switch_amt: new FormControl(''),
    switch_scheme_to: new FormControl(''),
    scheme_id_to: new FormControl(''),
    switch_by: new FormControl(''),
    unit: new FormControl(''),
    Switch_amt: new FormControl(''),
    option_to: new FormControl(''),
    plan_to: new FormControl(''),
    rnt_login_at: new FormControl('', [Validators.required]),
    step_up_percentage: new FormControl(''),
    step_up_amt: new FormControl(''),
    step_up_by: new FormControl(''),
  });

  constructor(private __utility:UtiliService,private __dbIntr:DbIntrService,
    private overlay:Overlay,
    public __dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    this.getnumberofdaystobeadded();
    this.getrntMst();
    this.getOptionMst();
    this.getPlanMst();
    this.getTransactionType();
  }

  setEndDate(__dt) {
    try{
    let _calculateDT;
    var dt = new Date(this.__traxForm.get('sip_start_date').value);
    switch (this.__traxForm.controls['sip_frequency'].value) {
      case 'D':
        _calculateDT = new Date(dt.setDate(dt.getDate() + Number(__dt)))
          .toISOString()
          .substring(0, 10);
        break;
      case 'W':
        _calculateDT = new Date(dt.setDate(dt.getDate() + Number(__dt) * 7))
          .toISOString()
          .substring(0, 10);
        break;
      case 'F':
        _calculateDT = new Date(dt.setDate(dt.getDate() + Number(__dt) * 14))
          .toISOString()
          .substring(0, 10);
        break;
      case 'M':
        _calculateDT = new Date(dt.setMonth(dt.getMonth() + Number(__dt)))
          .toISOString()
          .substring(0, 10);
        break;
      case 'Q':
        break;
      case 'S':
        break;
      case 'A':
        _calculateDT = new Date(dt.setFullYear(dt.getFullYear() + Number(__dt)))
          .toISOString()
          .substring(0, 10);
        break;
      default:
        break;
    }
    // console.log(_calculateDT);
    this.__traxForm.controls['sip_end_date'].setValue(_calculateDT);
    }
    catch(ex){
      console.log(ex);
    }

    // console.log(this.__traxForm.value.sip_end_date);
  }

  ngAfterViewInit() {
    //Duration Change
    this.__traxForm.get('duration').valueChanges.subscribe((res) => {
      this.setEndDate(res);
    });

    //Second Kyc_status Change
    this.__traxForm.get('second_kyc_status').valueChanges.subscribe((res) => {
      this.__secondkycMst = res == 'Y' ? KycMst : withoutKycMst;
    });

    //Third Kyc_status Change
    this.__traxForm.get('third_kyc_status').valueChanges.subscribe((res) => {
      this.__thirdkycMst = res == 'Y' ? KycMst : withoutKycMst;
    });

    this.__traxForm.controls['temp_tin_no'].valueChanges
      .pipe(
        tap(() => (this.__istemporaryspinner = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1
            ? this.__dbIntr.searchTin(
                '/formreceived',
                dt + '&trans_type_id=' + this.__product_type + '&flag=C'
              )
            : []
        ),
        map((x: responseDT) => x.data),
        tap(() => (this.__istemporaryspinner = false))
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

    this.__traxForm.controls['sub_arn_no'].valueChanges
      .pipe(
        tap(() => (this.__isSubBrkArnSpinner = true)),
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
          this.searchResultVisibilityForSubBrkArn('block');
          this.__traxForm.controls['sub_brk_cd'].setValue('');
          this.__isSubBrkArnSpinner = false;
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isSubBrkArnSpinner = false;
        },
      });

    //Scheme Search
    this.__traxForm.controls['scheme_name'].valueChanges
      .pipe(
        tap(() => (this.__isschemeSpinner = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1
            ? this.__dbIntr.searchItems(
                '/scheme',
                dt +
                  '&scheme_type=' +
                  (this.__product_type.toString() == '4' ? 'N' : 'O')
              )
            : []
        ),
        map((x: any) => x.data)
      )
      .subscribe({
        next: (value) => {
          console.log(value)
          this.__schemeMst = value;
          this.searchResultVisibilityForScheme('block');
          this.__isschemeSpinner = false;
          this.__dialogDtForScheme = null;
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isschemeSpinner = false;
        },
      });

    //scheme To Search
    this.__traxForm.controls['switch_scheme_to'].valueChanges
      .pipe(
        tap(() => (this.__isschemeToSpinner = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1
            ? this.__dbIntr.searchItems(
                '/scheme',
                dt + '&amc_id=' + this.__dialogDtForScheme?.amc_id
              )
            : []
        ),
        map((x: any) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__schemeMstforSwitchTo = value;
          // console.log(this.__schemeMstforSwitchTo);
          this.searchResultVisibilityForSchemeSwicthTo('block');
          this.__isschemeToSpinner = false;
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isschemeToSpinner = false;
        },
      });

    //Client Code Search
    this.__traxForm.controls['client_code'].valueChanges
      .pipe(
        tap(() => (this.__isclientVisible = true)),
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
        tap(() => (this.__issecClientSpinnerPending = true)),
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
          this.__issecClientSpinnerPending = false;
          this.searchResultVisibilityForSecondClient('block');
          this.__SecondClient = null;
          this.__traxForm.patchValue({
            second_client_id: '',
            second_client_name: '',
            second_client_pan: '',
          });
        },
        complete: () => {
          this.__issecClientSpinnerPending = false;
        },
        error: (err) => {
          this.__issecClientSpinnerPending = false;
        },
      });

    //Second Client Code Search
    this.__traxForm.controls['third_client_code'].valueChanges
      .pipe(
        tap(() => (this.__isthirdClientSpinnerPending = true)),
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
          this.__isthirdClientSpinnerPending = false;
          this.searchResultVisibilityForThirdClient('block');
          this.__ThirdClient = null;
          this.__traxForm.patchValue({
            third_client_id: '',
            third_client_name: '',
            third_client_pan: '',
          });
        },
        complete: () => {
          this.__isthirdClientSpinnerPending = false;
        },
        error: (err) => {
          this.__isthirdClientSpinnerPending = false;
        },
      });

    // EUIN NUMBER SEARCH
    this.__traxForm.controls['euin_no'].valueChanges
      .pipe(
        tap(() => (this.__isEuinNumberVisible = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1
            ? this.__dbIntr.searchItems(
                '/employee',
                (global.containsSpecialChars(dt) ? dt.split(' ')[0] : dt) +
                  (this.__traxForm.value.bu_type == 'B'
                    ? this.__traxForm.controls['sub_arn_no'].value
                      ? '&sub_arn_no=' +
                        this.__traxForm.controls['sub_arn_no'].value.split(
                          ' '
                        )[0]
                      : ''
                    : '')
              )
            : []
        ),
        map((x: responseDT) => x.data),
        tap(() => (this.__isEuinNumberVisible = false))
      )
      .subscribe({
        next: (value) => {
          // console.log(value);
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
        tap(() => (this.__isMicrSpinner = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.searchItems('/depositbank', dt) : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe((value) => {
          this.__bnkMst = value;
          this.searchResultVisibilityForBnk('block');
          this.__isMicrSpinner = false;
          this.__dialogDtForBnk = null;
          this.__traxForm.patchValue({
            bank_name: '',
          });
        },
        err => {
            this.__isMicrSpinner = false;
        }
      );

    //Transaction Type change
    this.__traxForm.controls['trans_id'].valueChanges.subscribe((res) => {
      if(res  == '2'){
        this.setSIP_PIPValidators();
        this.getSipTypeMst();
        this.__traxForm.get('sip_date').setAsyncValidators([this.sipDateValidators()]);
        if (this.__sipdtRng_amtRng) {
          this.setSipDateAgainstScheme(this.__sipdtRng_amtRng?.sip_date);
        }
        this.setValidations([
          { name: 'sip_frequency', valid: [Validators.required] },
          { name: 'sip_duration', valid: [Validators.required] },
          { name: 'duration', valid: [Validators.required] },
          { name: 'sip_date', valid: [Validators.required] },
          { name: 'sip_start_date', valid: [Validators.required] },
          { name: 'sip_end_date', valid: [Validators.required] },
          { name: 'sip_type', valid: [Validators.required] },
        ]);
        this.__traxForm.get('sip_type').setAsyncValidators(this.sipSipTypeExistValidators());
        this.__traxForm.get('sip_type').updateValueAndValidity({ emitEvent: false });
      }
      else if(res == '3'){
          this.removeSIPValidators();
          this.__traxForm.get('amount').removeAsyncValidators([this.AmountValidators()]);
            this.__traxForm.controls['switch_scheme_to'].setAsyncValidators([this.SchemeToValidators()]);
            this.removeValidations([
              { name: 'amount', valid: [Validators.required] },
              {
                name: 'chq_no',
                valid: [
                  Validators.required,
                  Validators.minLength(6),
                  Validators.maxLength(6),
                  Validators.pattern('^[0-9]*$'),
                ],
              },
              { name: 'inv_type', valid: [Validators.required] },
              { name: 'bank_id', valid: [Validators.required] },
            ]);
            this.__traxForm.get('chq_bank').clearValidators();
            this.__traxForm.get('chq_bank').clearAsyncValidators();
            this.__traxForm.get('chq_bank').updateValueAndValidity({emitEvent:false});
            this.setValidations([
              { name: 'switch_scheme_to', valid: [Validators.required] },
              { name: 'switch_by', valid: [Validators.required] },
              { name: 'plan_to', valid: [Validators.required] },
              { name: 'option_to', valid: [Validators.required] },
              { name: 'folio_number', valid: [Validators.required] },
              { name: 'scheme_id_to', valid: [Validators.required] },
            ]);
            this.__traxForm.get('switch_by').updateValueAndValidity({ emitEvent: true });
            this.__traxForm.get('amount').updateValueAndValidity({ emitEvent: true });
            this.getItemsDtls(null,'B');
      }
      else{
          this.removeSIPValidators();
          this.setSIP_PIPValidators();
        }
    });

    //Sip Type Change
    this.__traxForm.controls['sip_type'].valueChanges.subscribe((res) => {
      this.__traxForm
        .get('chq_no')
        .setValidators(
          res != '2'
            ? [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(6),
                Validators.pattern('^[0-9]*$'),
              ]
            : null
        );
      this.__traxForm.get('chq_no').updateValueAndValidity();
      this.__chkInvAmt = res == '2' ? this.__chkInvAmt : true;
    });

    //Sip_duration change
    this.__traxForm.controls['sip_duration'].valueChanges.subscribe((res) => {
      if (res == 'P') {
        this.removeValidations([
          { name: 'duration', valid: [Validators.required] },
        ]);
        let getDT = new Date();
        getDT.setMonth(12);
        getDT.setFullYear(2999);
        //  console.log(getDT.getDate()+'/12/2999');
        this.__traxForm
          .get('sip_end_date')
          .setValue(getDT.toISOString().substring(0, 10));
        // console.log(this.__traxForm.get('sip_end_date').value);
      } else {
        if (this.__traxForm.get('trans_id').value == '2') {
          this.setValidations([
            { name: 'duration', valid: [Validators.required] },
          ]);
          this.__traxForm.get('sip_end_date').setValue('');
        }
      }
    });

    //mode_of_holding change
    this.__traxForm.controls['mode_of_holding'].valueChanges.subscribe(
      (res) => {
        if (res == 'S') {
          this.getadditionalApplicant(null, 'FC');
          this.getadditionalApplicant(null, 'TC');
          this.__isSHowAdditionalTble = false;
        }
      }
    );

    //Change in Durations
    // this.__traxForm.controls['duration'].valueChanges.subscribe((res) => {
    //   this.setSipEndDate();
    // });
    //Period in Durations
    this.__traxForm.controls['period'].valueChanges.subscribe((res) => {
      this.setSipEndDate();
    });

    //Tin Status Change
    this.__traxForm.controls['tin_status'].valueChanges.subscribe((res) => {
      if (res == 'Y') {
        this.__traxForm.controls['temp_tin_no'].setAsyncValidators([
          this.TemporaryTINValidators(),
        ]);
        this.setValidations([
          { name: 'temp_tin_no', valid: [Validators.required] },
        ]);
      } else {
        this.__traxForm.controls['temp_tin_no'].removeAsyncValidators([
          this.TemporaryTINValidators(),
        ]);
        this.removeValidations([
          { name: 'temp_tin_no', valid: [Validators.required] },
        ]);
      }
      this.__traxForm.controls['temp_tin_no'].reset('', {
        onlySelf: true,
        emitEvent: false,
      });
    });

    this.__traxForm.get('first_inv_amt').valueChanges.subscribe((res) => {
      // this.__traxForm.get('amount').updateValueAndValidity({emitEvent:true});
      if (this.__traxForm.get('inv_type').value == 'F') {
        this.checkFirstInvAmtrightornot(
          this.__sipdtRng_amtRng.pip_fresh_min_amt,
          Number(res)
        );
      } else if (this.__traxForm.get('inv_type').value == 'A') {
        this.checkFirstInvAmtrightornot(
          this.__sipdtRng_amtRng.pip_add_min_amt,
          Number(res)
        );
      } else {
        //Not Need to do anything
      }
    });

    //Amount Change Event for pip & sip
    // this.__traxForm.get('amount').valueChanges.subscribe(res =>{
    //   if(res){
    //   if(this.__traxForm.get('trans_id').value == 1){
    //       if(this.__traxForm.get('inv_type').value == 'F'){
    //          this.checkAmtrightorNot(
    //           this.__sipdtRng_amtRng.pip_fresh_min_amt,
    //           Number(res));
    //       }
    //       else if(this.__traxForm.get('inv_type').value == 'A'){
    //         this.checkAmtrightorNot(
    //           this.__sipdtRng_amtRng.pip_add_min_amt,
    //           Number(res));
    //       }
    //   }
    //   else if(this.__traxForm.get('trans_id').value == 2){
    //     if(this.__traxForm.get('inv_type').value == 'F'){
    //       this.checkAmtrightorNot(
    //         Number(this.__sipfreq.filter((x: any) => x.id == this.__traxForm.controls['sip_frequency'].value)[0].sip_fresh_min_amt),
    //         Number(res));
    //     }
    //     else if(this.__traxForm.get('inv_type').value == 'A'){
    //       this.checkAmtrightorNot(
    //         Number(this.__sipfreq.filter((x: any) => x.id == this.__traxForm.controls['sip_frequency'].value)[0].sip_add_min_amt),
    //         Number(res));
    //     }

    //   }
    //  }
    // })

    //change in buisness type
    this.__traxForm.get('bu_type').valueChanges.subscribe((res) => {
      this.__traxForm.controls['sub_arn_no'].setValue('', {
        onlySelf: true,
        emitEvent: false,
      });
      this.__traxForm.controls['euin_no'].setValue('', {
        onlySelf: true,
        emitEvent: false,
      });
      this.__traxForm.controls['sub_brk_cd'].setValue('', {
        onlySelf: true,
        emitEvent: false,
      });
      if (res == 'B') {
        this.__traxForm
          .get('sub_arn_no')
          .setAsyncValidators([this.SubBrokerValidators()]);
        this.setValidations([
          { name: 'sub_brk_cd', valid: [Validators.required] },
          { name: 'sub_arn_no', valid: [Validators.required] },
        ]);
      } else {
        this.__traxForm
          .get('sub_arn_no')
          .removeAsyncValidators([this.SubBrokerValidators()]);
        this.removeValidations([
          { name: 'sub_brk_cd', valid: [Validators.required] },
          { name: 'sub_arn_no', valid: [Validators.required] },
        ]);
      }
    });

    //Kyc_status Change
    this.__traxForm.get('kyc_status').valueChanges.subscribe((res) => {
      this.__kycMst = res == 'Y' ? KycMst : withoutKycMst;
    });

    //sip_date change
    this.__traxForm.get('sip_date').valueChanges.subscribe((res) => {
      if (res) {
        this.setStartDateBySIPdate(res);
      } else {
        this.__traxForm.get('sip_start_date').setValue('');
      }
    });

    //SWP Duration
    this.__traxForm.get('swp_duration').valueChanges.subscribe((res) => {
      this.setSWPEndDate(
        this.__traxForm.get('swp_freq').value,
        res,
        this.__traxForm.get('swp_start_date').value
      );
    });

    //SWP Start Date
    this.__traxForm.get('swp_start_date').valueChanges.subscribe((res) => {
      this.setSWPEndDate(
        this.__traxForm.get('swp_freq').value,
        this.__traxForm.get('swp_duration').value,
        res
      );
    });

    this.__traxForm.get('sip_frequency').valueChanges.subscribe((res) => {
      if (res) {
        this.__traxForm
          .get('amount')
          .updateValueAndValidity({ emitEvent: true });
      }
    });

    //SWP Frequemcy
    this.__traxForm.get('swp_freq').valueChanges.subscribe((res) => {
      this.setSWPEndDate(
        res,
        this.__traxForm.get('swp_duration').value,
        this.__traxForm.get('swp_start_date').value
      );
    });
    this.__traxForm.get('inv_type').valueChanges.subscribe((res) => {
      this.__traxForm
        .get('folio_number')
        .setValidators(res == 'A' ? [Validators.required] : null);
      this.__traxForm
        .get('folio_number')
        .updateValueAndValidity({ emitEvent: false });
    });

    this.__traxForm.get('switch_by').valueChanges.subscribe((res) => {
      this.__traxForm
        .get('switch_amt')
        .setValidators(res == 'A' ? [Validators.required] : null);
      this.__traxForm
        .get('unit')
        .setValidators(
          res == 'AU' || res == 'U' ? [Validators.required] : null
        );
      this.__traxForm
        .get('switch_amt')
        .updateValueAndValidity({ emitEvent: false });
      this.__traxForm.get('unit').updateValueAndValidity({ emitEvent: false });
      this.__traxForm.get('unit').setValue(res == 'AU' ? 'All Unit' : '');
    });
  }

  checkIfTEMPTINToExist(tempTin: string): Observable<boolean> {
    return of(
      this.__temp_tinMst.findIndex((x) => x.temp_tin_no == tempTin) != -1
    );
  }
  TemporaryTINValidators(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfTEMPTINToExist(control.value).pipe(
        map((res) => {
          if (control.value) {
            return res ? null : { TempTINExists: true };
          }
          return null;
        })
      );
    };
  }

  checkIfEuinExists(emp_name: string): Observable<boolean> {
    if (global.containsSpecialChars(emp_name)) {
      return of(
        this.__euinMst.findIndex((x) => x.euin_no == emp_name.split(' ')[0]) !=
          -1
      );
    } else {
      return of(this.__euinMst.findIndex((x) => x.euin_no == emp_name) != -1);
    }
  }
  EUINValidators(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfEuinExists(control.value).pipe(
        map((res) => {
          if (control.value) {
            // if res is true, sip_date exists, return true
            return res ? null : { euinExists: true };
            // NB: Return null if there is no error
          }
          return null;
        })
      );
    };
  }

  checkIfscmExist(scm_name: string): Observable<boolean> {
    return of(
      this.__schemeMst.findIndex((x) => x.scheme_name == scm_name) != -1
    );
  }
  SchemeValidators(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfscmExist(control.value).pipe(
        map((res) => {
          if (control.value) {
            return res ? null : { ScmExists: true };
          }
          return null;
        })
      );
    };
  }
  checkIfclientExist(cl_code: string): Observable<boolean> {
    return of(
      this.__clientMst.findIndex((x) => x.client_code == cl_code) != -1
    );
  }
  ClientValidators(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfclientExist(control.value).pipe(
        map((res) => {
          if (control.value) {
            return res ? null : { ClientExists: true };
          }
          return null;
        })
      );
    };
  }
  checkIfAmountLess(res): Observable<boolean> {
    return of(this.amtCheck(res));
  }
  AmountValidators(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfAmountLess(control.value).pipe(
        map((res) => {
          if (control.value) {
            return res ? { AmtExists: true } : null;
          }
          return null;
        })
      );
    };
  }

  checkAmtrightorNot(checkWithamt, checkAmt) {
    // if(checkWithamt){
    //   this.getamttocheckwith = Number(checkWithamt);
    //   this.__checkAmt = Number(checkAmt) <  Number(checkWithamt) ? true : false;
    // }
    // else{
    //   this.__checkAmt = true;
    // }
    this.getamttocheckwith = Number(checkWithamt);
    // console.log(Number(checkWithamt));

    // console.log(this.getamttocheckwith);

    return Number(checkAmt) < Number(checkWithamt) ? true : false;
  }

  amtCheck(res): boolean {
    // console.log(this.__sipfreq);
    // console.log(this.__sipdtRng_amtRng);

    if (this.__traxForm.get('trans_id').value == 1) {
      if (
        this.__traxForm.get('inv_type').value == 'F' &&
        this.__sipdtRng_amtRng
      ) {
        return this.checkAmtrightorNot(
          this.__sipdtRng_amtRng.pip_fresh_min_amt,
          Number(res)
        );
      } else if (
        this.__traxForm.get('inv_type').value == 'A' &&
        this.__sipdtRng_amtRng
      ) {
        return this.checkAmtrightorNot(
          this.__sipdtRng_amtRng.pip_add_min_amt,
          Number(res)
        );
      }
    } else if (this.__traxForm.get('trans_id').value == 2) {
      if (
        this.__traxForm.get('inv_type').value == 'F' &&
        this.__sipfreq.length > 0 &&
        this.__traxForm.controls['sip_frequency'].value
      ) {
        return this.checkAmtrightorNot(
          Number(
            this.__sipfreq.filter(
              (x: any) =>
                x.id == this.__traxForm.controls['sip_frequency'].value
            )[0].sip_fresh_min_amt
          ),
          Number(res)
        );
      } else if (
        this.__traxForm.get('inv_type').value == 'A' &&
        this.__sipfreq.length > 0 &&
        this.__traxForm.controls['sip_frequency'].value
      ) {
        return this.checkAmtrightorNot(
          Number(
            this.__sipfreq.filter(
              (x: any) =>
                x.id == this.__traxForm.controls['sip_frequency'].value
            )[0].sip_add_min_amt
          ),
          Number(res)
        );
      }
    }
    return false;
  }

  checkIfMICRExist(micrDtls: string): Observable<boolean> {
    return of(
      this.__bnkMst.findIndex(
        (x) =>
          x.micr_code == micrDtls ||
          x.bank_name == micrDtls ||
          x.ifs_code == micrDtls
      ) != -1
    );
  }
  MICRValidators(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfMICRExist(control.value).pipe(
        map((res) => {
          if (control.value) {
            return res ? null : { MicrExists: true };
          }
          return null;
        })
      );
    };
  }

  resetForm = () =>{
    this.__traxForm.get('euin_no').setValue('',{emitEvent:false});
    this.__traxForm.get('temp_tin_no').setValue('',{emitEvent:false});
    this.__traxForm.get('sub_arn_no').setValue('',{emitEvent:false});
    this.__traxForm.get('client_code').setValue('',{emitEvent:false});
    this.__traxForm.get('kyc_status').setValue('',{emitEvent:false});
    this.__traxForm.get('trans_id').setValue('',{emitEvent:false});
    this.__traxForm.get('folio_number').setValue('',{emitEvent:false});
    this.__traxForm.get('second_kyc_status').setValue('',{emitEvent:false});
    this.__traxForm.get('third_kyc_status').setValue('',{emitEvent:false});
    this.removeSIPValidators();
    this.setSIP_PIPValidators();
    this.__euinMst = [];
    this.__subbrkArnMst = [];
    this.__kycMst = [];
    this.__bnkMst = [];
    this.__sipType = [];
    if(this.__traxForm.get('tin_status').value == 'Y'){
      this.__temp_tinMst = [];
    }
    this.__traxForm.patchValue({
      bu_type:'',
      sub_brk_cd:'',
      client_name: '',
      client_id: '',
      first_kyc:'',
      mode_of_holding:'',
      inv_type:'',
      plan:'',
      option:'',
      amount:'',
      chq_no:'',
      rnt_login_at:'',
      file:null,
      app_form_scan:'',
      filePreview:'',
      remarks:'',
      application_no:'',
      second_client_kyc:'',
      third_client_kyc:'',
      plan_to:'',
      option_to:'',
      sip_type:'',
      sip_frequency:'',
      sip_date:'',
      sip_duration:'',
      duration:'',
      sip_end_date:'',
      first_inv_amt:''
    });
    this.getItemsDtls(null,'SC');
    this.getItemsDtls(null,'B');
    this.getItemsDtls(null,'ST');
    this.getadditionalApplicant(null,'FC');
    this.getadditionalApplicant(null,'TC');
    this.__secondkycMst = [];
    this.__thirdkycMst = [];
    this.__schemeMst = [];
    this.__sipType = [];
    this.__sipfreq = [];
  } 
  submit() {
      console.log(this.__traxForm.value);
    if (this.__traxForm.invalid) {
      this.__utility.showSnackbar(
        'Error!! Form submition failed due to some error',
        0
      );
      return;
    } else {
      const fb = new FormData();
      fb.append(
        'first_inv_amt',
        this.__traxForm.value.first_inv_amt
          ? this.__traxForm.value.first_inv_amt
          : ''
      );
      fb.append(
        'rnt_login_at',
        this.__traxForm.value.rnt_login_at
          ? this.__traxForm.value.rnt_login_at
          : ''
      );

      fb.append(
        'sip_type',
        this.__traxForm.value.sip_type ? this.__traxForm.value.sip_type : ''
      );
      fb.append('bu_type', this.__traxForm.value.bu_type);
      fb.append(
        'sub_brk_cd',
        this.__traxForm.value.sub_brk_cd ? this.__traxForm.value.sub_brk_cd : ''
      );
      fb.append(
        'sub_arn_no',
        this.__traxForm.value.sub_arn_no
          ? this.__traxForm.value.sub_arn_no.split(' ')[0]
          : ''
      );
      fb.append('temp_tin_no', this.__traxForm.value.temp_tin_no);
      fb.append('remarks', this.__traxForm.value.remarks);
      fb.append('kyc_status', this.__traxForm.value.kyc_status);
      fb.append('first_client_id', this.__traxForm.value.client_id);
      fb.append(
        'first_kyc',
        global.getActualVal(this.__traxForm.value.first_kyc)
      );

      if (this.__traxForm.value.mode_of_holding != 'S') {
        fb.append(
          'second_client_id',
          this.__traxForm.value.second_client_id
            ? this.__traxForm.value.second_client_id
            : ''
        );
        fb.append(
          'second_client_kyc',
          this.__traxForm.value.second_client_kyc
            ? this.__traxForm.value.second_client_kyc
            : ''
        );
        fb.append(
          'second_client_name',
          this.__traxForm.value.second_client_name
            ? this.__traxForm.value.second_client_name
            : ''
        );
        fb.append(
          'second_client_pan',
          this.__traxForm.value.second_client_pan
            ? this.__traxForm.value.second_client_pan
            : ''
        );
        fb.append(
          'third_client_id',
          this.__traxForm.value.third_client_id
            ? this.__traxForm.value.third_client_id
            : ''
        );
        fb.append(
          'third_client_name',
          this.__traxForm.value.third_client_name
            ? this.__traxForm.value.third_client_name
            : ''
        );
        fb.append(
          'third_client_pan',
          this.__traxForm.value.third_client_pan
            ? this.__traxForm.value.third_client_pan
            : ''
        );
        fb.append(
          'third_client_kyc',
          this.__traxForm.value.third_client_kyc
            ? this.__traxForm.value.third_client_kyc
            : ''
        );
        fb.append(
          'second_client_kyc_status',
          this.__traxForm.value.second_kyc_status
            ? this.__traxForm.value.second_kyc_status
            : ''
        );
        fb.append(
          'third_client_kyc_status',
          this.__traxForm.value.third_kyc_status
            ? this.__traxForm.value.third_kyc_status
            : ''
        );
      }

      fb.append('scheme_id', this.__traxForm.value.scheme_id);
      fb.append(
        'amount',
        this.__traxForm.value.trans_id == '3'
          ? this.__traxForm.value.switch_amt
          : this.__traxForm.value.amount
      );
      fb.append(
        'folio_no',
        this.__traxForm.value.inv_type == 'A' ||
          this.__traxForm.value.trans_id == 3
          ? this.__traxForm.value.folio_number
          : ''
      );
      fb.append(
        'application_no',
        this.__traxForm.value.inv_type == 'F'
          ? this.__traxForm.value.application_no
          : ''
      );
      fb.append('trans_id', this.__traxForm.value.trans_id);
      fb.append(
        'chq_no',
        this.__traxForm.value.trans_id == '3'
          ? ''
          : this.__traxForm.value.chq_no
      );
      fb.append(
        'chq_bank',
        this.__traxForm.value.trans_id == '3'
          ? ''
          : this.__traxForm.value.bank_id
      );
      fb.append('trans_type_id', this.__product_type);
      fb.append('app_form_scan', this.__traxForm.value.app_form_scan);
      fb.append('tin_status', this.__traxForm.value.tin_status);
      fb.append('plan', this.__traxForm.value.plan);
      fb.append('option', this.__traxForm.value.option);
      fb.append('inv_type', this.__traxForm.value.inv_type);
      fb.append('mode_of_holding', this.__traxForm.value.mode_of_holding);
      fb.append(
        'euin_no',
        this.__traxForm.value.euin_no
          ? this.__traxForm.value.euin_no.split(' ')[0]
          : ''
      );
      if (this.__traxForm.value.trans_id == '2') {
        fb.append('sip_start_date', this.__traxForm.value.sip_start_date);
        fb.append('sip_end_date', this.__traxForm.value.sip_end_date);
        fb.append('sip_duration_type', this.__traxForm.value.sip_duration);
        fb.append('sip_duration', this.__traxForm.value.duration);
        fb.append('period', this.__traxForm.value.period);
        fb.append('sip_frequency', this.__traxForm.value.sip_frequency);
        fb.append('sip_date', this.__traxForm.value.sip_date);
      } else if (this.__traxForm.value.trans_id == '3') {
        fb.append('option_to', this.__traxForm.value.option_to);
        fb.append('plan_to', this.__traxForm.value.plan_to);
        fb.append('scheme_id_to', this.__traxForm.value.scheme_id_to);
        fb.append('switch_by', this.__traxForm.value.switch_by);
        fb.append(
          'unit',
          global.getActualVal(this.__traxForm.getRawValue().unit)
        );
      }

      if (this.__traxForm.value.bu_type == '2') {
        fb.append(
          'sub_brk_cd',
          this.__traxForm.value.sub_brk_cd
            ? this.__traxForm.value.sub_brk_cd.split(' ')[0]
            : ''
        );
        fb.append(
          'sub_arn_no',
          this.__traxForm.value.sub_arn_no
            ? this.__traxForm.value.sub_arn_no
            : ''
        );
      }

      if (this.__traxForm.value.sip_type == '4') {
        fb.append('swp_frequency', this.__traxForm.value.swp_freq);
        fb.append('swp_start_date', this.__traxForm.value.swp_start_date);
        fb.append('swp_duration', this.__traxForm.value.swp_duration);
        fb.append('swp_end_date', this.__traxForm.value.swp_end_date);
        fb.append('swp_inst_amount', this.__traxForm.value.swp_installment_amt);
      } else if (this.__traxForm.value.sip_type == '5') {
        fb.append(
          'step_up_percentage',
          this.__traxForm.get('step_up_by').value == 'P'
            ? this.__traxForm.value.step_up_percentage
            : ''
        );
        fb.append(
          'step_up_amount',
          this.__traxForm.get('step_up_by').value == 'A'
            ? this.__traxForm.value.step_up_amt
            : ''
        );
        fb.append('step_up_by', this.__traxForm.value.step_up_by);
      }
      this.__dbIntr.api_call(1, '/mfTraxCreate', fb).subscribe((res: any) => {
        if (res.suc == 1) {
          this.resetForm();
        }

        this.__utility.showSnackbar(
          res.suc == 1 ? 'Form Submitted Successfully' : res.msg,
          res.suc
        );
      });
    }
  }

  getItems(__items) {
    console.log(__items);
    this.__traxForm
      .get('temp_tin_no')
      .reset(__items.temp_tin_no, { onlySelf: true, emitEvent: false });
    this.searchResultVisibility('none');
    this.__traxForm.patchValue({
      bu_type: __items.bu_type,
      inv_type: __items.inv_type,
      application_no:
        __items.inv_type == 'F'
          ? global.getActualVal(__items.application_no)
          : '',
      folio_number:
        __items.inv_type == 'A' || __items.trans_id == 3
          ? global.getActualVal(__items.folio_no)
          : '',
      trans_id: global.getActualVal(__items.trans_id),
      kyc_status: global.getActualVal(__items.kyc_status),
      mode_of_holding: __items?.mode_of_holding,
      plan: global.getActualVal(__items?.plan_id),
      option: global.getActualVal(__items?.option_id),
      amount: global.getActualVal(__items?.amount),
      chq_no: global.getActualVal(__items?.chq_no),
      rnt_login_at: global.getActualVal(__items?.rnt_login_at),
      remarks: global.getActualVal(__items?.remarks),
      filePreview: __items?.app_form_scan
        ? `${environment.app_formUrl + __items.app_form_scan}`
        : '',
      file: '',
      app_form_scan: '',
      first_kyc: __items?.first_kyc,
      option_to: __items.trans_id == 3 ? __items?.option_id_to : '',
      plan_to: __items.trans_id == 3 ? __items?.plan_id_to : '',
      switch_by: __items.trans_id == 3 ? __items?.switch_by : '',
      switch_amt: __items.trans_id == 3 ? __items?.amount : '',
      unit: __items.trans_id == 3 ? __items?.unit : '',
    });
      console.log(__items);
    setTimeout(() => {
      this.__euinMst.length = 0;
      this.__clientMst.length = 0;
      this.__schemeMst.length = 0;
      this.__schemeMstforSwitchTo.length = 0;
      this.__bnkMst.length = 0;
      this.__clientMst.push({
        client_code: __items.client_code,
        id: __items.client_id,
        client_name: __items.client_name,
        client_type: __items.client_type,
      });
      this.__euinMst.push({
        euin_no: __items.euin_no,
        emp_name: __items.emp_name,
      });

      this.__schemeMst.push({
        id: __items.scheme_id,
        scheme_name: __items.scheme_name,
        amc_id: __items.amc_id,
      });

      this.__schemeMstforSwitchTo.push({
        id: __items.scheme_id_to,
        scheme_name: __items.scheme_name_to,
      });

      this.__bnkMst.push({
        micr_code: __items?.micr_code,
        bank_name: __items?.bank_name,
        ifs_code: __items?.ifs_code,
        branch_name: __items?.chq_branch_name,
        id: __items?.chq_bank,
        branch_addr: __items?.chq_branch_addr,
      });
      this.getItemsDtls(this.__euinMst[0], 'E'); // EUIN Binding
      this.__isCldtlsEmpty = this.__clientMst.length > 0 ? false : true;
      this.getItemsDtls(this.__clientMst[0], 'C'); // CLIENT Binding
      this.getItemsDtls(this.__schemeMst[0], 'SC'); // Scheme Binding
      this.getItemsDtls(this.__bnkMst[0], 'B');
      if (__items.bu_type == 'B') {
        this.__subbrkArnMst.push({
          arn_no: __items.sub_arn_no,
          code: __items.sub_brk_cd,
        });
        this.getItemsDtls(this.__subbrkArnMst[0], 'S');
      }
      if (__items.trans_id == 3) {
        this.getItemsDtls(this.__schemeMstforSwitchTo[0], 'ST'); // Scheme To Binding for switch only
      }
      this.setSIPFormControlWhileEdit(__items);
    }, 200);
  }

  getItemsDtls(__euinDtls, __type) {
    console.log('getItemDtls');
    switch (__type) {
      case 'E':
        this.__traxForm.controls['euin_no'].reset(
          __euinDtls.euin_no + ' - ' + __euinDtls.emp_name,
          { onlySelf: true, emitEvent: false }
        );
        this.searchResultVisibilityForEuin('none');
        break;
      case 'S':
        this.__traxForm.controls['sub_arn_no'].reset(__euinDtls.arn_no, {
          onlySelf: true,
          emitEvent: false,
        });
        this.__traxForm.controls['sub_brk_cd'].setValue(__euinDtls.code);
        this.searchResultVisibilityForSubBrkArn('none');
        break;

      case 'C':
        console.log(__euinDtls);
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
        this.__dialogDtForScheme = __euinDtls;
        this.__traxForm.controls['scheme_name'].reset(__euinDtls ? __euinDtls?.scheme_name : '', {
          onlySelf: true,
          emitEvent: false,
        });
        this.__traxForm.patchValue({ scheme_id: __euinDtls ? __euinDtls.id : '' });
        this.searchResultVisibilityForScheme('none');
        this.getschemwisedt(__euinDtls ? __euinDtls?.id : '');
        break;

      case 'B':
        this.__dialogDtForBnk = __euinDtls;
        this.__traxForm.controls['chq_bank'].reset(__euinDtls ? __euinDtls.micr_code : '', {
          emitEvent: false
        });
        this.__traxForm.controls['bank_name'].setValue(__euinDtls ? __euinDtls.bank_name : '');
        this.__traxForm.controls['bank_id'].setValue(__euinDtls ? __euinDtls.id : '');
        this.__traxForm.controls['ifsc'].setValue(__euinDtls ? __euinDtls.ifs_code : '');
        this.__traxForm.controls['branch_name'].setValue(
          __euinDtls ? __euinDtls.branch_name : ''
        );
        this.searchResultVisibilityForBnk('none');
        break;

      case 'ST':
        this.__dialogDtForSchemeTo = __euinDtls;
        this.__traxForm.controls['switch_scheme_to'].reset(
          __euinDtls.scheme_name,
          { onlySelf: true, emitEvent: false }
        );
        this.__traxForm.patchValue({ scheme_id_to: __euinDtls.id });
        this.searchResultVisibilityForSchemeSwicthTo('none');
        break;
      default:
        break;
    }
  }

  setSIPFormControlWhileEdit(__items) {
    setTimeout(() => {
      if (__items.trans_id == 2) {
        this.__traxForm.patchValue({
          sip_type:
            __items?.trans_id == 2
              ? global.getActualVal(__items?.sip_type)
              : '',
          sip_frequency:
            __items?.trans_id == 2
              ? global.getActualVal(__items?.sip_swp_stp_frequency)
              : '',
          sip_date:
            __items?.trans_id == 2
              ? global.getActualVal(__items?.sip_swp_stp_inst_date)
              : '',
          sip_start_date:
            __items?.trans_id == 2
              ? global.getActualVal(__items?.sip_swp_stp_start_date)
              : '',

          sip_duration:
            __items?.trans_id == 2
              ? global.getActualVal(__items?.sip_swp_stp_duration_type)
              : '',
          duration:
            __items?.trans_id == 2
              ? global.getActualVal(__items?.sip_swp_stp_duration)
              : '',
          sip_end_date:
            __items?.trans_id == 2
              ? global.getActualVal(__items?.sip_swp_stp_end_date)
              : '',
        });
      }
    }, 500);
  }

  getschemwisedt(__scheme_id) {
    if(__scheme_id){
    this.__dbIntr
      .api_call(0, '/scheme', 'scheme_id=' + __scheme_id)
      .pipe(pluck('data'))
      .subscribe((res) => {
        // console.log(res);
        this.__sipfreq = res[0].sip_freq_wise_amt
          ? JSON.parse(res[0].sip_freq_wise_amt).filter(
              (x: any) => global.getType(x.is_checked) == true
            )
          : [];
        this.__swp_freq = res[0].swp_freq_wise_amt
          ? JSON.parse(res[0].swp_freq_wise_amt).filter(
              (x: any) => global.getType(x.is_checked) == true
            )
          : [];
        this.setSipDateAgainstScheme(res[0]?.sip_date);
        this.__sipdtRng_amtRng = res[0];
        this.__traxForm.get('sip_name').setValue(res[0].special_sip_name);
        if (
          this.__traxForm.get('trans_id').value == '2' &&
          this.__traxForm.get('sip_type').value == '4'
        ) {
          this.__traxForm.get('sip_type').updateValueAndValidity();
        }
        this.__traxForm
          .get('amount')
          .updateValueAndValidity({ emitEvent: true });
      });
    }
    else{
      this.__sipfreq = [];
      this.__swp_freq = [];
      this.__sipdtRng_amtRng = null;
    }

  }
  setSipDateAgainstScheme(__dt) {
    if (this.__traxForm.get('trans_id').value == '2') {
      // console.log(__dt);
      this.__sipDT = JSON.parse(__dt);
    }
  }
  
  //Sub Broker search result off
  searchResultVisibilityForSubBrkArn(display_mode) {
    // this.__subBrkArn.nativeElement.style.display = display_mode;
    this.displayMode_forSub_arn_no = display_mode;
  }
  //Temp Tin Search Resullt off
  searchResultVisibility(display_mode) {
    // this.__searchTin.nativeElement.style.display = display_mode;
    this.displayMode_forTTIN = display_mode;
  }
   //Scheme Search Resullt off
   searchResultVisibilityForScheme(display_mode) {
    this.displayMode_forScm = display_mode;
  }
  //first client Search Resullt off
  searchResultVisibilityForClient(display_mode) {
    this.displayMode_forClient = display_mode;
  }
  //Euin Search Resullt off
  searchResultVisibilityForEuin(display_mode) {
    this.displayMode_forEuin = display_mode;
  }
  //bank Search Resullt off
  searchResultVisibilityForBnk(display_mode) {
    this.displayMode_forBnk = display_mode;
  }
  //second client Search Resullt off
  searchResultVisibilityForSecondClient(display_mode) {
    this.displayMode_for_sec_client = display_mode;
  }
  //third client Search Resullt off
  searchResultVisibilityForThirdClient(display_mode) {
    this.displayMode_for_third_client = display_mode;
  }
  //scheme To Search Resullt off
  searchResultVisibilityForSchemeSwicthTo(display_mode) {
    this.displayMode_forScmTo = display_mode;
  }
  getSelectedItemsFromParent(event) {
    this.getItemsDtls(event.item, event.flag);
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
      const dialogref = this.__dialog.open(CreateClientComponent, dialogConfig);
      dialogref.afterClosed().subscribe((dt) => {
        // console.log(dt);
        if (dt) {
          switch (__mode) {
            case 'F':
              this.__isCldtlsEmpty = false;
              this.__clientMst.push(dt.data);
              this.getItemsDtls(dt.data, 'C');
              break;
            case 'S':
              this.getadditionalApplicant(dt.data, 'FC');
              break;
            case 'T':
              this.getadditionalApplicant(dt.data, 'TC');
              break;
            default:
              break;
          }
        }
      });
    } catch (ex) {}
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
  getSelectedItemsFromParentForSecondOrThirdClient(event) {
    this.getadditionalApplicant(event.item, event.flag);
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
        PreviewdtlsDialogComponent,
        dialogConfig
      );
    } catch (ex) {}
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
  getTransactionType() {
    this.__dbIntr
      .api_call(0, '/showTrans', 'trans_type_id=' + this.__product_type)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__transType = res;
      });
  }

  openDialog(__type) {
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
          : __type == 'ST'
          ? this.__dialogDtForSchemeTo.scheme_name
          : this.__dialogDtForBnk.bank_name,
      dt:
        __type == 'C'
          ? this.__dialogDtForClient
          : __type == 'S'
          ? this.__dialogDtForScheme
          : __type == 'ST'
          ? this.__dialogDtForSchemeTo
          : this.__dialogDtForBnk,
    };
    try {
      const dialogref = this.__dialog.open(
        PreviewdtlsDialogComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((res) => {
        if (res) {
          if (__type == 'B') {
            this.__bnkMst.push(res.data);
            this.getItemsDtls(res.data, 'B');
          }
        }
      });
    } catch (ex) {}
  }
  getPlanMst() {
    this.__dbIntr
      .api_call(0, '/plan', null)
      .pipe(pluck('data'))
      .subscribe((res: plan[]) => {
        this.PlanMst = res;
      });
  }

  getrntMst() {
    this.__dbIntr
      .api_call(0, '/rnt', null)
      .pipe(pluck('data'))
      .subscribe((res: rnt[]) => {
        this.__rnt_login_at = res;
      });
  }
  getOptionMst() {
    this.__dbIntr
      .api_call(0, '/option', null)
      .pipe(pluck('data'))
      .subscribe((res: option[]) => {
        this.OptionMst = res;
      });
  }
  getSipTypeMst() {
    this.__dbIntr
      .api_call(0, '/sipType', null)
      .pipe(map((x: any) => x.data))
      .subscribe((res) => {
        // console.log(res);
        this.__sipType = res;
      });
  }
  preventNonumeric(__ev) {
    dates.numberOnly(__ev);
  }
  openDialogForCreateBnk(id) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.width = '40%';
    dialogConfig.data = {
      id: id,
      flag: 'B-FIN',
      formName: 'B-FIN',
      title: id == 0 ? 'Add Bank' : 'Update Bank',
      right: global.randomIntFromInterval(1, 60),
    };
    const dialogref = this.__dialog.open(CreateBankComponent, dialogConfig);
    dialogref.afterClosed().subscribe((dt) => {
      if (dt) {
        // console.log(dt.data);

        this.__bnkMst.push(dt.data);
        this.getItemsDtls(dt.data, 'B');
      }
    });
  }

  
  getFIle(__ev) {
    this.__traxForm
      .get('file')
      .setValidators([
        Validators.required,
        fileValidators.fileExtensionValidator(this.allowedExtensions),
        fileValidators.fileSizeValidatorforEntry(__ev.files),
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
    // console.log(this.__traxForm.get('app_form_scan'));
  }
  setFormControl(formcontrlname, __val) {
    // console.log(formcontrlname);

    this.__traxForm.get(formcontrlname).patchValue(__val);
  }
  openPDF() {
    window.open(this.__traxForm.value.filePreview, '_blank');
  }
  setSIP_PIPValidators(){
    this.__traxForm.get('amount').setAsyncValidators([this.AmountValidators()]);
    this.setValidations([
    { name: 'amount', valid: [Validators.required] },
    {
      name: 'chq_no',
      valid: [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern('^[0-9]*$'),
      ],
    },
    { name: 'inv_type', valid: [Validators.required] },
    // { name: 'chq_bank', valid: [Validators.required] },
    { name: 'bank_id', valid: [Validators.required] },
  ]);
  this.__traxForm.controls['switch_scheme_to'].clearAsyncValidators();
  this.__traxForm.controls['switch_scheme_to'].updateValueAndValidity();
  // this.__traxForm.get('chq_bank').setAsyncValidators(this.MICRValidators());
  // this.__traxForm.get('chq_bank').updateValueAndValidity({emitEvent:false});

  this.removeValidations([
    { name: 'switch_scheme_to', valid: [Validators.required] },
    { name: 'switch_by', valid: [Validators.required] },
    { name: 'plan_to', valid: [Validators.required] },
    { name: 'switch_amt', valid: [Validators.required] },
    { name: 'unit', valid: [Validators.required] },
    { name: 'option_to', valid: [Validators.required] },
    { name: 'scheme_id_to', valid: [Validators.required] },
  ]);
  this.__traxForm.get('inv_type').updateValueAndValidity({ emitEvent: true });
  this.__traxForm.get('amount').updateValueAndValidity({ emitEvent: true });
    if(!this.__traxForm.get('chq_bank').hasValidator(Validators.required)
    && !this.__traxForm.get('chq_bank').asyncValidator){
      this.__traxForm.get('chq_bank').setAsyncValidators(this.MICRValidators());
      this.__traxForm.get('chq_bank').setValidators([Validators.required]);
      this.__traxForm.get('chq_bank').updateValueAndValidity({emitEvent: false});
    }
  }
  removeValidations(__frmCtrl) {
    __frmCtrl.forEach((element) => {
      this.__traxForm.controls[element.name].removeValidators(element.valid);
      this.__traxForm.controls[element.name].updateValueAndValidity({
        emitEvent: false,
        onlySelf: true,
      });
    });
  }
  checkIfDatesExists(sip_date: string): Observable<boolean> {
    // console.log(this.__sipDT);
    // console.log(sip_date);
    return of(
      this.__sipDT.some((ele) => Number(ele.date) == Number(sip_date))
    ).pipe(delay(1000));
  }
  sipDateValidators(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      // console.log(control);

      return this.checkIfDatesExists(control.value).pipe(
        map((res) => {
          // console.log(res);
          if (control.value) {
            // if res is true, sip_date exists, return true
            return res ? null : { sipDatesExists: true };
            // NB: Return null if there is no error
          }
          return null;
        })
      );
    };
  }
  setValidations(__frmCtrl) {
    __frmCtrl.forEach((element) => {
      this.__traxForm.controls[element.name].setValidators(element.valid);
      this.__traxForm.controls[element.name].updateValueAndValidity({
        onlySelf: true,
        emitEvent: false,
      });
    });
  }
  checkIfSpecialSIPExists(sip_type): Observable<boolean> {
    // console.log(this.__sipdtRng_amtRng.ava_special_sip);

    return of(this.__sipdtRng_amtRng?.ava_special_sip == 'true' ? true : false);
  }
  sipSipTypeExistValidators(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      // console.log(control);

      return this.checkIfSpecialSIPExists(control.value).pipe(
        map((res) => {
          // console.log(typeof res);

          if (control.value == '4') {
            // if res is true, special sip exists, return true
            return res ? null : { sipTypeExists: true };
            // NB: Return null if there is no error
          }
          return null;
        })
      );
    };
  }
  removeSIPValidators(){
    this.__traxForm.get('sip_date').removeAsyncValidators([this.sipDateValidators()]);
        this.removeValidations([
          { name: 'sip_type', valid: [Validators.required] },
          { name: 'sip_frequency', valid: [Validators.required] },
          { name: 'inv_type', valid: [Validators.required] },
          { name: 'sip_duration', valid: [Validators.required] },
          { name: 'duration', valid: [Validators.required] },
          { name: 'sip_date', valid: [Validators.required] },
          { name: 'sip_start_date', valid: [Validators.required] },
          { name: 'sip_end_date', valid: [Validators.required] },
        ]);
        this.__traxForm.patchValue(
          {
            sip_frequency: '',
            sip_duration: '',
            duration: '',
            period: '',
            sip_start_date: '',
            sip_end_date: '',
            sip_date: '',
          },
          { emitEvent: false }
        );
        this.__traxForm.get('sip_type').removeAsyncValidators(this.sipSipTypeExistValidators());
        this.__traxForm.get('sip_type').updateValueAndValidity({ emitEvent: false });
  }
  checkIfscmToExist(scm_name: string): Observable<boolean> {
    // console.log(scm_name);

    return of(
      this.__schemeMstforSwitchTo.findIndex((x) => x.scheme_name == scm_name) !=
        -1
    );
  }
  SchemeToValidators(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfscmToExist(control.value).pipe(
        map((res) => {
          if (control.value) {
            return res ? null : { ScmToExists: true };
          }
          return null;
        })
      );
    };
  }
  setSipEndDate() {
    // console.log(this.__traxForm.controls['period'].value);
    // debugger;
    if (
      this.__traxForm.controls['period'].value &&
      this.__traxForm.controls['duration'].value
    ) {
      let getDT = new Date(this.__traxForm.controls['sip_start_date'].value);
      this.__traxForm.controls['period'].value == 'Y'
        ? getDT.setFullYear(
            new Date().getFullYear() +
              Number(this.__traxForm.controls['duration'].value)
          )
        : getDT.setMonth(
            getDT.getMonth() +
              Number(Number(this.__traxForm.controls['duration'].value))
          );
      this.__traxForm.controls['sip_end_date'].setValue(
        getDT.toISOString().slice(0, 10)
      );
    } else {
      this.__traxForm.controls['sip_end_date'].setValue('');
    }
  }
  
  checkFirstInvAmtrightornot(checkWithamt, checkAmt) {
    // console.log(checkWithamt + '  - ' + checkAmt);

    if (checkWithamt) {
      this.getInvAmt = Number(checkWithamt);
      // console.log(checkAmt < Number(checkWithamt) ? true : false);
      this.__chkInvAmt = checkAmt < Number(checkWithamt) ? true : false;
    } else {
      this.__chkInvAmt = true;
    }
  }
  checkIfSubBrokerExist(subBrk: string): Observable<boolean> {
    return of(this.__subbrkArnMst.findIndex((x) => x.arn_no == subBrk) != -1);
  }
  SubBrokerValidators(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfSubBrokerExist(control.value).pipe(
        map((res) => {
          if (control.value) {
            return res ? null : { subBrkExists: true };
          }
          return null;
        })
      );
    };
  }
  setStartDateBySIPdate(res) {
    try{
      var date = new Date();
      var dt = new Date();
      date.setDate(
        date.getDate() +
          Number(
            this.__noofdaystobeAdded[
              this.__noofdaystobeAdded.findIndex((x: any) => x.sl_no == 3)
            ].param_value
          )
      );
      if (Number(date.getDate()) > Number(res)) {
        dt.setDate(res);
        dt.setMonth(dt.getMonth() + 2);
      } else {
        dt.setDate(res);
        dt.setMonth(dt.getMonth() + 1);
      }
      this.__traxForm.get('sip_start_date').setValue(dt.toISOString().slice(0, 10));
    }
    catch(ex){
        console.log(ex);
    }

  }

  getnumberofdaystobeadded() {
    this.__dbIntr
      .api_call(0, '/mdparams', null)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.__noofdaystobeAdded = res;
      });
  }
  setSWPEndDate(swp_freq, swp_duration, swp_start_date) {
    if (swp_freq && swp_duration && swp_start_date) {
      let _calculateDT;
      var dt = new Date(swp_start_date);
      switch (swp_freq) {
        case 'D':
          _calculateDT = new Date(
            dt.setDate(dt.getDate() + Number(swp_duration))
          )
            .toISOString()
            .substring(0, 10);
          break;
        case 'W':
          _calculateDT = new Date(
            dt.setDate(dt.getDate() + Number(swp_duration) * 7)
          )
            .toISOString()
            .substring(0, 10);
          break;
        case 'F':
          _calculateDT = new Date(
            dt.setDate(dt.getDate() + Number(swp_duration) * 14)
          )
            .toISOString()
            .substring(0, 10);
          break;
        case 'M':
          _calculateDT = new Date(
            dt.setMonth(dt.getMonth() + Number(swp_duration))
          )
            .toISOString()
            .substring(0, 10);
          break;
        case 'Q':
          break;
        case 'S':
          break;
        case 'A':
          _calculateDT = new Date(
            dt.setFullYear(dt.getFullYear() + Number(swp_duration))
          )
            .toISOString()
            .substring(0, 10);
          break;
        default:
          break;
      }
      this.__traxForm.controls['swp_end_date'].setValue(_calculateDT);
    } else {
      this.__traxForm.controls['swp_end_date'].setValue('');
    }
  }
}
