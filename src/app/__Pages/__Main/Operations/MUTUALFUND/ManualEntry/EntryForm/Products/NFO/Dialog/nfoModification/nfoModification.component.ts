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
import __sipFrequency from '../../../../../../../../../../../assets/json/SipFrequency.json';
import buisnessType from '../../../../../../../../../../../assets/json/buisnessType.json';
import KycMst from '../../../../../../../../../../../assets/json/kyc.json';
import withoutKycMst from '../../../../../../../../../../../assets/json/withoutKyc.json';
import { option } from 'src/app/__Model/option';
import { plan } from 'src/app/__Model/plan';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  map,
  pluck,
  switchMap,
  tap,
} from 'rxjs/operators';
import { responseDT } from 'src/app/__Model/__responseDT';
import { Overlay } from '@angular/cdk/overlay';
import dateslist from '../../../../../../../../../../../assets/json/dates.json';
import { dates } from 'src/app/__Utility/disabledt';
import { rnt } from 'src/app/__Model/Rnt';
import { Observable, of } from 'rxjs';
import { global } from 'src/app/__Utility/globalFunc';
import { CreateBankComponent } from 'src/app/shared/create-bank/create-bank.component';
import { PreviewdtlsDialogComponent } from 'src/app/shared/core/previewdtls-dialog/previewdtls-dialog.component';
import { CreateClientComponent } from 'src/app/shared/create-client/create-client.component';
import clientType from '../../../../../../../../../../../assets/json/clientTypeMenu.json';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'nfoModification-component',
  templateUrl: './nfoModification.component.html',
  styleUrls: ['./nfoModification.component.css'],
})
export class NfomodificationComponent implements OnInit {

  displayMode_forTTIN: string;
  displayMode_forSub_arn_no: string;
  displayMode_forEuin: string;
  displayMode_forClient:string;
  displayMode_forScm:string;
  displayMode_forBnk:string;
  displayMode_forScmTo:string;

  clientTypeMaster = clientType;

  nfo_scheme_switch_to_visibility: string;
  __isEntryDTGreater: string = null;
  __isschemeSpinner: boolean = false;
  __isschemeSpinnerTo: boolean = false;
  __isNfoSchemeSwitchTo: boolean = false;
  __isSubBrkArnSpinner: boolean = false;
  __isMicrSpinner: boolean = false;

  __rnt_login_at: rnt[];
  __sipDT: any = [];
  __swp_freq: any = [];
  __noofdaystobeAdded: any;

  __dates: any = dateslist;
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

  __isVisible: boolean = false;

  // __sipfreq = __sipFrequency;
  __sipfreq: any = [];
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
  getInvAmt: any;
  __SecondClient: client;
  __ThirdClient: client;
  __sec_clientMst: client[] = [];
  __third_clientMst: client[] = [];
  __isCldtlsEmpty: boolean = false;
  __issecCldtlsEmpty: boolean = true;
  __isthirdCldtlsEmpty: boolean = true;

  __schemeMstforSwitchTo: any = [];
  __nfoSchemeSwitchTo: any = [];
  __dialogDtForSchemeTo: any;
  __dialogDtForSchemeToForNfoCombo: any;

  __dialogDtForClient: any;
  __dialogDtForScheme: any;
  __dialogDtForBnk: bank;
  __kycMst: any = [];
  __secondkycMst: any = [];
  __thirdkycMst: any = [];

  allowedExtensions = ['pdf'];
  __buisness_type: any = buisnessType;
  __schemeMst: any = [];
  __clientMst: client[] = [];
  __bnkMst: bank[] = [];
  __euinMst: any = [];

  OptionMst: option[];
  PlanMst: plan[];
  // @ViewChild('schemeRes') __schemeRes: ElementRef;
  // @ViewChild('searchbnk') __searchbnk: ElementRef;
  @ViewChild('secondclientCd') __secondCl: ElementRef;
  @ViewChild('thirdclientCd') __thirdCl: ElementRef;
  @ViewChild('secondClName') __secondClName: ElementRef;
  @ViewChild('thirdClName') __thirdClName: ElementRef;
  // @ViewChild('schemeswitchTo') __scheme_swicth_to: ElementRef;

  __isSHowAdditionalTble: boolean = false;

  __trans_types_Cnt: any = [];
  __sipType: any = [];
  __transType: any = [];
  __temp_tinMst: any = [];
  __product_id: string = this.data.product_id;
  __product_type: string = this.data.trans_type_id;
  __traxForm = new FormGroup({
    second_kyc_status: new FormControl(''),
    third_kyc_status: new FormControl(''),
    kyc_status: new FormControl('', [Validators.required]),
    first_kyc: new FormControl('', [Validators.required]),
    tin_status: new FormControl('Y', [Validators.required]),
    temp_tin_no: new FormControl('', {
      validators: [Validators.required],
      asyncValidators: [this.TemporaryTINValidators()],
    }),
    bu_type: new FormControl('', [Validators.required]),
    sub_brk_cd: new FormControl(''),
    sub_arn_no: new FormControl(''),
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
    client_name: new FormControl('', [Validators.required]),
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
    chq_bank: new FormControl('', {
      validators: [Validators.required],
      asyncValidators: [this.MICRValidators()],
    }),
    filePreview: new FormControl(this.data.nfoData ? `${environment.app_formUrl + this.data.nfoData.app_form_scan}` : ''),
    app_form_scan: new FormControl(''),
    file: new FormControl('',
    [
      Validators.required,
      fileValidators.fileExtensionValidator(this.allowedExtensions),
    ]

    ),
    remarks: new FormControl(''),
    trans_id: new FormControl('', [Validators.required]),
    form_scan_status: new FormControl(''),
    bank_id: new FormControl('', [Validators.required]),
    bank_name: new FormControl(''),
    branch_name:new FormControl(''),
    ifsc:new FormControl(''),
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

    nfo_combo: new FormGroup({
      switch_scheme_to: new FormControl(''),
      switch_scheme_id_to: new FormControl(''),
      switch_plan_to: new FormControl(''),
      switch_option_to: new FormControl(''),
      switch_by: new FormControl(''),
      switch_amount: new FormControl(''),
      switch_unit: new FormControl(''),
    }),

    switch_by: new FormControl(''),
    unit: new FormControl(''),
    Switch_amt: new FormControl(''),
    option_to: new FormControl(''),
    plan_to: new FormControl(''),
    rnt_login_at: new FormControl('', [Validators.required]),
    step_up_percentage: new FormControl(''),
    step_up_amt: new FormControl(''),
    step_up_by: new FormControl(''),

    sip_name: new FormControl(''),
    swp_freq: new FormControl('', { updateOn: 'blur' }),
    swp_start_date: new FormControl('', { updateOn: 'blur' }),
    swp_duration: new FormControl('', { updateOn: 'blur' }),
    swp_installment_amt: new FormControl(''),
    swp_end_date: new FormControl(''),
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
    this.getnumberofdaystobeadded();
    setTimeout(() => {
      if(this.data.nfoData){
        this.setNFOForm(this.data.nfoData);
      }
    }, 200);
  }
  setNFOForm(res){
    this.__temp_tinMst.length = 0;
    this.__temp_tinMst.push(res)
    this.getItems(res);
  }
  getnumberofdaystobeadded() {
    this.__dbIntr
      .api_call(0, '/mdparams', null)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.__noofdaystobeAdded = res;
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
      .api_call(0, '/showTrans', 'trans_type_id=' + this.data.trans_type_id)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__transType = res;
      });
  }
  ngAfterViewInit() {
    this.__traxForm
      .get(['nfo_combo', 'switch_scheme_to'])
      .valueChanges.pipe(
        tap(() => (this.__isNfoSchemeSwitchTo = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1
            ? this.__dbIntr.searchItems(
                '/scheme',
                dt + '&amc_id=' + this.__dialogDtForScheme?.amc_id
                +'&scheme_type=N'
              )
            : []
        ),
        map((x: any) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__nfoSchemeSwitchTo = value;
          this.searchResultVisibilityForSchemeSwicthToForNfoCombo('block');
          this.__isNfoSchemeSwitchTo = false;
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isNfoSchemeSwitchTo = false;
        },
      });

    this.__traxForm.controls['switch_by'].valueChanges.subscribe((res) => {
      this.__traxForm.controls['unit'].setValue(res == 'AU' ? 'All Unit' : '');
    });

    this.__traxForm
      .get(['nfo_combo', 'switch_by'])
      .valueChanges.subscribe((res) => {
        this.__traxForm
          .get(['nfo_combo', 'switch_unit'])
          .setValue(res == 'AU' ? 'All Unit' : '');
        this.__traxForm
          .get(['nfo_combo', 'switch_amount'])
          .setValidators(res == 'A' ? [Validators.required] : null);
        this.__traxForm
          .get(['nfo_combo', 'switch_unit'])
          .setValidators(
            res == 'U' || res == 'AU' ? [Validators.required] : null
          );
        this.__traxForm
          .get(['nfo_combo', 'switch_unit'])
          .updateValueAndValidity();
        this.__traxForm
          .get(['nfo_combo', 'switch_amount'])
          .updateValueAndValidity();
      });

    this.__traxForm.controls['inv_type'].valueChanges.subscribe((res) => {
      if (res == 'A') {
        this.setValidations([
          { name: 'folio_number', valid: [Validators.required] },
        ]);
      } else {
        this.removeValidations([
          { name: 'folio_number', valid: [Validators.required] },
        ]);
      }
      if (this.__traxForm.value.trans_id != '6') {
        this.__traxForm
          .get('amount')
          .updateValueAndValidity({ emitEvent: true });
      }
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
                dt + '&trans_type_id=' + this.data.trans_type_id + '&flag=C'
              )
            : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__temp_tinMst = value;
          this.searchResultVisibility('block');
          this.__istemporaryspinner = false;
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__istemporaryspinner = false;
        },
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
        switchMap(
          (dt) =>
            dt?.length > 1
              ? this.__dbIntr.searchItems('/scheme', dt + (this.__traxForm.value.trans_id == 35 ? '' : '&scheme_type=N'))
              : []
          // dt?.length > 1 ? this.__dbIntr.searchItems('/scheme', (dt + '&scheme_type='+ (this.data.trans_type_id == '4' ? 'N' : 'O'))) : []
          // dt?.length > 1 ? this.__dbIntr.searchItems('/scheme', dt) : []
        ),
        map((x: any) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__schemeMst = value;
          this.searchResultVisibilityForScheme('block');
          this.__isschemeSpinner = false;
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isschemeSpinner = false;
        },
      });

    //scheme To Search
    this.__traxForm.controls['switch_scheme_to'].valueChanges
      .pipe(
        tap(() => (this.__isschemeSpinnerTo = true)),
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
          console.log(this.__schemeMstforSwitchTo);
          this.searchResultVisibilityForSchemeSwicthTo('block');
          this.__isschemeSpinnerTo = false;
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isschemeSpinnerTo = false;
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
        tap(() => (this.__isEuinNumberVisible = true)),
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
        tap(() => (this.__isEuinNumberVisible = false))
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
        tap(() => (this.__isMicrSpinner = true)),
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
          this.__isMicrSpinner = false;
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isMicrSpinner = false;
        },
      });

    //Transaction Type change
    this.__traxForm.controls['trans_id'].valueChanges.subscribe((res) => {
      if (res == '5') {
        this.getSipTypeMst();
        this.__traxForm
          .get('sip_date')
          .setAsyncValidators([this.sipDateValidators()]);
        this.setValidations([
          { name: 'sip_type', valid: [Validators.required] },
          { name: 'sip_frequency', valid: [Validators.required] },
          { name: 'sip_duration', valid: [Validators.required] },
          { name: 'duration', valid: [Validators.required] },
          { name: 'sip_date', valid: [Validators.required] },
          { name: 'sip_start_date', valid: [Validators.required] },
          { name: 'sip_end_date', valid: [Validators.required] },
        ]);
        this.__traxForm
          .get('sip_type')
          .setAsyncValidators(this.sipSipTypeExistValidators());
        this.__traxForm
          .get('sip_type')
          .updateValueAndValidity({ emitEvent: false });
      } else {
        this.__traxForm
          .get('sip_date')
          .removeAsyncValidators([this.sipDateValidators()]);
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
        this.__traxForm
          .get('sip_type')
          .removeAsyncValidators(this.sipSipTypeExistValidators());
        this.__traxForm
          .get('sip_type')
          .updateValueAndValidity({ emitEvent: false });
      }
      this.__checkAmt = res == '6' ? false : this.__checkAmt;
      this.__chkInvAmt = res == '5' ? true : false;
      if (res == '6') {
        this.__traxForm
          .get('amount')
          .removeAsyncValidators([this.AmountValidators()]);
        this.__traxForm.controls['switch_scheme_to'].setAsyncValidators([
          this.SchemeToValidators(),
        ]);
        this.__traxForm
          .get('chq_bank')
          .removeAsyncValidators([this.MICRValidators()]);
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
          { name: 'chq_bank', valid: [Validators.required] },
          { name: 'bank_id', valid: [Validators.required] },
        ]);
        this.setValidations([
          { name: 'switch_scheme_to', valid: [Validators.required] },
          { name: 'switch_by', valid: [Validators.required] },
          { name: 'plan_to', valid: [Validators.required] },
          { name: 'option_to', valid: [Validators.required] },
          { name: 'folio_number', valid: [Validators.required] },
          { name: 'scheme_id_to', valid: [Validators.required] },
        ]);
      } else {
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
          { name: 'chq_bank', valid: [Validators.required] },
          { name: 'bank_id', valid: [Validators.required] },
        ]);
        this.__traxForm
          .get('chq_bank')
          .setAsyncValidators([this.MICRValidators()]);
        this.__traxForm
          .get('amount')
          .setAsyncValidators([this.AmountValidators()]);
        this.__traxForm.controls['switch_scheme_to'].removeAsyncValidators([
          this.SchemeToValidators(),
        ]);
        this.removeValidations([
          { name: 'switch_scheme_to', valid: [Validators.required] },
          { name: 'switch_by', valid: [Validators.required] },
          { name: 'plan_to', valid: [Validators.required] },
          { name: 'switch_amt', valid: [Validators.required] },
          { name: 'unit', valid: [Validators.required] },
          { name: 'option_to', valid: [Validators.required] },
          { name: 'scheme_id_to', valid: [Validators.required] },
        ]);
        this.__traxForm
          .get('inv_type')
          .updateValueAndValidity({ emitEvent: true });
      }
      this.__traxForm.get('amount').updateValueAndValidity({ emitEvent: true });
      this.__traxForm
        .get('chq_bank')
        .updateValueAndValidity({ emitEvent: true });

      /** Set Validation for NFO COMBO TRANSACTION TYPE */
      this.__traxForm
        .get(['nfo_combo', 'switch_scheme_to'])
        .setValidators(res == '35' ? [Validators.required] : null);
      this.__traxForm
        .get(['nfo_combo', 'switch_plan_to'])
        .setValidators(res == '35' ? [Validators.required] : null);
      this.__traxForm
        .get(['nfo_combo', 'switch_option_to'])
        .setValidators(res == '35' ? [Validators.required] : null);
      this.__traxForm
        .get(['nfo_combo', 'switch_by'])
        .setValidators(res == '35' ? [Validators.required] : null);
      if (res == '35') {
        this.__traxForm
          .get(['nfo_combo', 'switch_scheme_to'])
          .setAsyncValidators([this.NFOSchemeToValidators()]);
      } else {
        this.__traxForm
          .get(['nfo_combo', 'switch_scheme_to'])
          .removeAsyncValidators([this.NFOSchemeToValidators()]);
      }

      this.__traxForm
        .get(['nfo_combo', 'switch_scheme_to'])
        .updateValueAndValidity();
      this.__traxForm
        .get(['nfo_combo', 'switch_plan_to'])
        .updateValueAndValidity();
      this.__traxForm
        .get(['nfo_combo', 'switch_option_to'])
        .updateValueAndValidity();
      this.__traxForm
        .get(['nfo_combo', 'switch_by'])
        .updateValueAndValidity({
          emitEvent: true,
        }); /** Triggering event on setting validation */

      /*** END */
    });

    //Sip Type Change
    this.__traxForm.controls['sip_type'].valueChanges.subscribe((res) => {
      if (res == '2') {
        this.removeValidations([
          {
            name: 'chq_no',
            valid: [
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(6),
              Validators.pattern('^[0-9]*$'),
            ],
          },
        ]);
      } else {
        this.setValidations([
          {
            name: 'chq_no',
            valid: [
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(6),
              Validators.pattern('^[0-9]*$'),
            ],
          },
        ]);
      }
      this.__chkInvAmt = res == '2' ? this.__chkInvAmt : true;
    });

    //Sip_duration change
    this.__traxForm.controls['sip_duration'].valueChanges.subscribe((res) => {
      if (res == 'P') {
        this.removeValidations([
          { name: 'duration', valid: [Validators.required] },
        ]);
        let getDT = new Date();
        console.log(getDT.getDate() + '/12/2999');
        this.__traxForm
          .get('sip_end_date')
          .setValue('2999-12-' + getDT.getDate());
        console.log(this.__traxForm.get('sip_end_date').value);
      } else {
        if (this.__traxForm.get('trans_id').value == '5') {
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
    this.__traxForm.controls['duration'].valueChanges.subscribe((res) => {
      // this.setSipEndDate();
      if(res){
      this.setStartDT(res);
    }
    });
    //Period in Durations
    // this.__traxForm.controls['period'].valueChanges.subscribe(res => {
    //   this.setSipEndDate();
    // })

    //Tin Status Change
    this.__traxForm.controls['tin_status'].valueChanges.subscribe((res) => {
      this.displayMode_forTTIN='';
      if (res == 'Y') {
        this.setValidations([
          { name: 'temp_tin_no', valid: [Validators.required] },
        ]);
        this.__traxForm
          .get('temp_tin_no')
          .setAsyncValidators([this.TemporaryTINValidators()]);
        this.__traxForm
          .get('scheme_name')
          .removeAsyncValidators([this.EntryDateExpiredValidators()]);
      } else {
        this.removeValidations([
          { name: 'temp_tin_no', valid: [Validators.required] },
        ]);
        this.__traxForm
          .get('temp_tin_no')
          .removeAsyncValidators([this.TemporaryTINValidators()]);
        this.__traxForm
          .get('scheme_name')
          .setAsyncValidators([
            this.EntryDateExpiredValidators(),
            this.SchemeValidators(),
          ]);
      }
      this.__traxForm
        .get('scheme_name')
        .updateValueAndValidity({ emitEvent: false });
      this.__traxForm
        .get('temp_tin_no')
        .updateValueAndValidity({ emitEvent: false });
      // console.log(this.__istemporaryspinner);
      this.__istemporaryspinner = false;
      this.searchResultVisibilityForScheme('none');
    });

    this.__traxForm.get('first_inv_amt').valueChanges.subscribe((res) => {
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
    this.__traxForm.get('amount').valueChanges.subscribe((res) => {
      // console.log(res);
      // if(this.__traxForm.get('trans_id').value == 4 || this.__traxForm.get('trans_id').value == 5){
      //     if(this.__traxForm.get('inv_type').value == 'F'){
      //        this.checkAmtrightorNot(
      //         this.__traxForm.get('trans_id').value == 4 ?
      //         this.__sipdtRng_amtRng.pip_fresh_min_amt: this.__sipdtRng_amtRng.sip_fresh_min_amt,
      //         Number(res));
      //     }
      //     else{
      //       this.checkAmtrightorNot(
      //         this.__traxForm.get('trans_id').value == 4 ?
      //         this.__sipdtRng_amtRng.pip_add_min_amt: this.__sipdtRng_amtRng.sip_add_min_amt,
      //         Number(res));
      //     }
      // }
      // else{
      //   //no need to check
      // }
    });

    //change in buisness type
    this.__traxForm.get('bu_type').valueChanges.subscribe((res) => {
      this.__traxForm.controls['sub_arn_no'].setValue('', {
        onlySelf: true,
        emitEvent: false,
      });
      this.__traxForm.controls['euin_no'].setValue('', {
        emitEvent: false,
      });
      this.__traxForm.controls['sub_brk_cd'].setValue('', {
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

    //Second Kyc_status Change
    this.__traxForm.get('second_kyc_status').valueChanges.subscribe((res) => {
      this.__secondkycMst = res == 'Y' ? KycMst : withoutKycMst;
    });

    //Third Kyc_status Change
    this.__traxForm.get('third_kyc_status').valueChanges.subscribe((res) => {
      this.__thirdkycMst = res == 'Y' ? KycMst : withoutKycMst;
    });

    //sip_date change
    this.__traxForm.get('sip_date').valueChanges.subscribe((res) => {
      if (res) {
        this.setStartDateBySIPdate(res);
      } else {
        this.__traxForm.get('sip_start_date').setValue('');
      }
    });

    //SWP Frequency
    this.__traxForm.get('swp_freq').valueChanges.subscribe((res) => {
      this.setSWPEndDate(
        res,
        this.__traxForm.get('swp_duration').value,
        this.__traxForm.get('swp_start_date').value
      );
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
    this.__secondCl.nativeElement.style.display = display_mode;
  }
  //third client Search Resullt off
  searchResultVisibilityForThirdClient(display_mode) {
    this.__thirdCl.nativeElement.style.display = display_mode;
  }
  //scheme To Search Resullt off
  searchResultVisibilityForSchemeSwicthTo(display_mode) {
    this.displayMode_forScmTo = display_mode;
  }

  //NFO COMBO scheme To Search Resullt off
  searchResultVisibilityForSchemeSwicthToForNfoCombo(display_mode) {
    this.nfo_scheme_switch_to_visibility = display_mode;
  }
  setValidations(__frmCtrl) {
    __frmCtrl.forEach((element) => {
      this.__traxForm.controls[element.name].setValidators(element.valid);
      this.__traxForm.controls[element.name].updateValueAndValidity();
    });
  }
  removeValidations(__frmCtrl) {
    __frmCtrl.forEach((element) => {
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
    if (
      this.__traxForm.controls['period'].value &&
      this.__traxForm.controls['duration'].value
    ) {
      console.log('aa');

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
  checkAmtrightorNot(checkWithamt, checkAmt) {
    if (checkWithamt) {
      this.getamttocheckwith = Number(checkWithamt);
      console.log(Number(checkAmt) < Number(checkWithamt));

      return Number(checkAmt) < Number(checkWithamt) ? true : false;
    } else {
      return false;
    }
  }

  checkFirstInvAmtrightornot(checkWithamt, checkAmt) {
    console.log(checkWithamt + '  - ' + checkAmt);

    if (checkWithamt) {
      this.getInvAmt = Number(checkWithamt);
      console.log(checkAmt < Number(checkWithamt) ? true : false);
      this.__chkInvAmt = checkAmt < Number(checkWithamt) ? true : false;
    } else {
      this.__chkInvAmt = true;
    }
  }
  getItems(__items) {
    console.log(__items);

    this.__traxForm
      .get('temp_tin_no')
      .reset(__items.temp_tin_no, { onlySelf: true, emitEvent: false });
    this.searchResultVisibility('none');
    this.__traxForm.get('trans_id').reset(__items.trans_id,{emitEvent:true});
    this.__traxForm.patchValue({
      bu_type: __items.bu_type,
      inv_type: __items.inv_type,
      application_no: __items.inv_type == 'F' ? global.getActualVal(__items.application_no) : '',
      folio_number: (__items.inv_type == 'A' || __items.trans_id == 6) ? global.getActualVal(__items.folio_no) : '',
      mode_of_holding:__items.mode_of_holding ? global.getActualVal(__items.mode_of_holding) : '',
      plan:global.getActualVal(__items.plan_id),
      option:global.getActualVal(__items.option_id),
      chq_no:global.getActualVal(__items.chq_no),
      first_kyc:global.getActualVal(__items.first_kyc),
      rnt_login_at:global.getActualVal(__items.rnt_login_at),
      remarks:global.getActualVal(__items.remarks),
      amount:global.getActualVal(__items.amount),
      switch_by:__items.trans_id == 6 ? global.getActualVal(__items.switch_by) : '',
      unit:__items.trans_id == 6 ? global.getActualVal(__items.unit) : '',
      switch_amt:__items.trans_id == 6 ? global.getActualVal(__items.amount) : '',
      plan_to:__items.trans_id == 6 ? global.getActualVal(__items.plan_id_to) : '',
      option_to:__items.trans_id == 6 ? global.getActualVal(__items.option_id_to) : ''
    });
    setTimeout(() => {
      if(__items.app_form_scan){
        this.__traxForm.get('file').removeValidators([Validators.required]);
      }
      else{
        this.__traxForm.get('file').addValidators([Validators.required]);
      }
      this.__traxForm.get('file').updateValueAndValidity();
      this.__traxForm.get('kyc_status').setValue(global.getActualVal(__items.kyc_status));
      this.__euinMst.length = 0;
      this.__clientMst.length = 0;
      this.__schemeMst.length = 0;
      this.__schemeMstforSwitchTo.length = 0;
      this.__schemeMstforSwitchTo.length = 0;
      this.__bnkMst.length = 0;
      this.__clientMst.push({
        client_code:global.getActualVal( __items.first_client_code),
        id:global.getActualVal( __items.first_client_id),
        client_name:global.getActualVal( __items.first_client_name),
        client_type:global.getActualVal( __items.first_client_type),
      });
      this.__euinMst.push({
        euin_no: __items.euin_no,
        emp_name: __items.emp_name,
      });
      this.__schemeMst.push({
        id: __items.scheme_id,
        scheme_name: __items.scheme_name,
        amc_id: __items.amc_id,
        nfo_entry_date: __items.nfo_entry_date,
      });
      this.__schemeMstforSwitchTo.push({
        id: __items.scheme_id_to,
        scheme_name: __items.scheme_name_to,
      });

      this.__bnkMst.push({
        micr_code:global.getActualVal(__items.micr_code),
        bank_name:global.getActualVal(__items.bank_name),
        ifs_code:global.getActualVal(__items.ifs_code),
        branch_name:global.getActualVal(__items.chq_branch_name),
        id:global.getActualVal(__items.chq_bank),
        branch_addr:global.getActualVal(__items.chq_branch_addr)
      });
      this.getItemsDtls(this.__euinMst[0], 'E'); // EUIN Binding

      this.__isCldtlsEmpty = this.__clientMst.length > 0 ? false : true;
      this.getItemsDtls(this.__clientMst[0], 'C'); // CLIENT Binding
      this.getItemsDtls(this.__schemeMst[0], 'SC'); // Scheme Binding
      if (__items.bu_type == 'B') {
        this.__subbrkArnMst.push({
          arn_no: __items.sub_arn_no,
          code: __items.sub_brk_cd,
        });
        this.getItemsDtls(this.__subbrkArnMst[0], 'S');
        this.__isSubBrkArnSpinner = false;
      }
      if (__items.trans_id == 6) {
        this.getItemsDtls(this.__schemeMstforSwitchTo[0], 'ST'); // Scheme To Binding for switch only
        this.__isschemeSpinnerTo = false;
      } else if (__items.trans_id == 35) {
        this.__schemeMstforSwitchTo.push({
          id: __items.scheme_id_to,
          scheme_name: __items.scheme_name_to,
        });
        this.getItemsDtls(this.__schemeMstforSwitchTo[0], 'NST');
        this.__isNfoSchemeSwitchTo = false;
      }
      console.log(this.__traxForm);
      this.getItemsDtls(this.__bnkMst[0], 'B');
     this.__isMicrSpinner = false;
      this.setSIPFormControlWhileEdit(__items);
    }, 200);
  }

  setSIPFormControlWhileEdit(__items){
    setTimeout(() => {
      if(__items.trans_id == 5){
        this.__traxForm.patchValue({
          sip_type: __items?.trans_id == 5 ? global.getActualVal(__items?.sip_type) : '',
          sip_frequency:
            __items?.trans_id == 5
              ? global.getActualVal(__items?.sip_swp_stp_frequency)
              : '',
          sip_date:
            __items?.trans_id == 5
              ? global.getActualVal(__items?.sip_swp_stp_inst_date)
              : '',
          sip_start_date:
            __items?.trans_id == 5
              ?global.getActualVal(__items?.sip_swp_stp_start_date)
              : '',

          sip_duration:
            __items?.trans_id == 5
              ? global.getActualVal(__items?.sip_swp_stp_duration_type)
              : '',
          duration:
              __items?.trans_id == 5
                ? global.getActualVal(__items?.sip_swp_stp_duration)
                : '',
                sip_end_date:
                __items?.trans_id == 5
                  ? global.getActualVal(__items?.sip_swp_stp_end_date)
                  : '',
        })
      }
    }, 500);
  }
  getschemwisedt(__scheme_id) {
    this.__dbIntr
      .api_call(0, '/scheme', 'scheme_id=' + __scheme_id)
      .pipe(pluck('data'))
      .subscribe((res) => {
        console.log(res);
        this.__swp_freq = res[0].swp_freq_wise_amt
          ? JSON.parse(res[0].swp_freq_wise_amt).filter(
              (x: any) => global.getType(x.is_checked) == true
            )
          : [];
        this.__sipfreq = res[0].sip_freq_wise_amt
          ? JSON.parse(res[0].sip_freq_wise_amt).filter(
              (x: any) => global.getType(x.is_checked) == true
            )
          : [];
        this.setStartDateAgainstScheme(res[0].sip_date);
        this.__sipdtRng_amtRng = res[0];
        this.__traxForm.get('sip_name').setValue(res[0].special_sip_name);

        // var date = new Date();
        // date.setDate(date.getDate() + 30);
        // if(JSON.parse(res[0].sip_date).findIndex((x:any) => x.date ==  (date.getDate()).toString()) != -1)
        // {
        //     this.__traxForm.patchValue({
        //       sip_start_date: date.toISOString().slice(0, 10),
        //     })
        // }
        // else{
        //   var found = JSON.parse(res[0]?.sip_date).find(function(element) {return Number(element.date) > Number(date.getDate())});
        //    if(found){
        //           this.__traxForm.get('sip_start_date').setValue(date.getFullYear()+'-'+(date.getMonth().toString().length > 1 ?  date.getMonth() : '0'+date.getMonth())+'-'+found.date);
        //    }
        //    else{
        //      date.setDate(date.getDate() + 60);
        //     this.__traxForm.get('sip_start_date').setValue(
        //       date.getFullYear()
        //       +'-'+
        //       (date.getMonth().toString().length > 1 ?  date.getMonth() : '0'+
        //       date.getMonth())
        //       +'-'+
        //        (JSON.parse(res[0]?.sip_date)[0].date.length > 1 ? JSON.parse(res[0]?.sip_date)[0].date
        //        :'0'+JSON.parse(res[0]?.sip_date)[0].date));
        //      console.log( this.__traxForm.get('sip_start_date').value);

        //   }
        // }
      });
  }

  setStartDateAgainstScheme(__dt) {
    if (this.__traxForm.get('trans_id').value == '5') {
      this.__sipDT = JSON.parse(__dt);
      console.log(this.__sipDT);

      // this.__traxForm.get('sip_date').setValue(JSON.parse(__dt))
    }
  }

  getItemsDtls(__euinDtls, __type) {
    switch (__type) {
      case 'NST':
        this.__dialogDtForSchemeToForNfoCombo = __euinDtls;
        this.__traxForm
          .get(['nfo_combo', 'switch_scheme_to'])
          .reset(__euinDtls.scheme_name, { emitEvent: false });
        this.__traxForm.patchValue({
          nfo_combo: {
            switch_scheme_id_to: __euinDtls.id,
          },
        });
        this.searchResultVisibilityForSchemeSwicthToForNfoCombo('none');
        break;
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
        console.log(__euinDtls);

        this.__isEntryDTGreater = __euinDtls.nfo_entry_date;
        this.__dialogDtForScheme = __euinDtls;
        this.__traxForm.controls['scheme_name'].reset(__euinDtls.scheme_name, {
          onlySelf: true,
          emitEvent: false,
        });
        this.__traxForm.patchValue({ scheme_id: __euinDtls.id });
        this.searchResultVisibilityForScheme('none');
        this.getschemwisedt(__euinDtls.id);
        break;

      case 'B':
        this.__dialogDtForBnk = __euinDtls;
        this.__traxForm.controls['chq_bank'].setValue(__euinDtls.micr_code, {emitEvent: false});
        this.searchResultVisibilityForBnk('none');
        this.__traxForm.controls['bank_name'].setValue(__euinDtls.bank_name);
        this.__traxForm.controls['ifsc'].setValue(__euinDtls.ifs_code);
        this.__traxForm.controls['branch_name'].setValue(__euinDtls.branch_name);
        this.__traxForm.controls['bank_id'].setValue(__euinDtls.id);
        break;

      case 'ST':
        this.__dialogDtForSchemeTo = __euinDtls;
        this.__traxForm.controls['switch_scheme_to'].reset(
          __euinDtls.scheme_name,
          { emitEvent: false }
        );
        this.__traxForm.patchValue({ scheme_id_to: __euinDtls.id });
        this.searchResultVisibilityForSchemeSwicthTo('none');
        break;
      default:
        break;
    }
  }
  checkWhetherNfoEntryDateisgreaterornot(__entrDt) {
    // this.__isEntryDTGreater = __entrDt > new Date().toISOString().substring(0,10) ? false : true;
    // return !this.__isEntryDTGreater;
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
  getSipTypeMst() {
    this.__dbIntr
      .api_call(0, '/sipType', null)
      .pipe(map((x: any) => x.data))
      .subscribe((res) => {
        console.log(res);
        this.__sipType = res;
      });
  }

  getFIle(__ev) {
    console.log(__ev);

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
    fb.append(
      'temp_tin_no',
      this.__traxForm.value.tin_status == 'Y'
        ? this.__traxForm.value.temp_tin_no
        : ''
    );
    fb.append('remarks', this.__traxForm.value.remarks);
    fb.append('kyc_status', this.__traxForm.value.kyc_status);
    fb.append('first_client_id', this.__traxForm.value.client_id);
    fb.append(
      'first_kyc',
      this.__traxForm.value.kyc_status == 'Y'
        ? this.__traxForm.value.first_kyc
        : ''
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
        'third_client_kyc_status',
        this.__traxForm.value.third_kyc_status
          ? this.__traxForm.value.third_kyc_status
          : ''
      );
      fb.append(
        'second_client_kyc_status',
        this.__traxForm.value.second_kyc_status
          ? this.__traxForm.value.second_kyc_status
          : ''
      );
    }

    // fb.append('recv_from', this.__traxForm.value.recv_from);
    fb.append('scheme_id', this.__traxForm.value.scheme_id);
    fb.append(
      'amount',
      this.__traxForm.value.trans_id == '6'
        ? this.__traxForm.value.switch_amt
        : this.__traxForm.value.trans_id == '35'
        ? this.__traxForm.get(['nfo_combo', 'switch_amount']).value
        : this.__traxForm.value.amount
    );
    fb.append('folio_no', (this.__traxForm.value.trans_id == '6' || this.__traxForm.value.inv_type == 'A') ?  global.getActualVal(this.__traxForm.value.folio_number) : '');
    fb.append('trans_id', this.__traxForm.value.trans_id);
    fb.append(
      'chq_no',
      this.__traxForm.value.trans_id == '6' ? '' : this.__traxForm.value.chq_no
    );
    fb.append(
      'chq_bank',
      this.__traxForm.value.trans_id == '6' ? '' : this.__traxForm.value.bank_id
    );
    fb.append('trans_type_id', this.__product_type);
    fb.append('app_form_scan', this.__traxForm.value.app_form_scan);
    fb.append('tin_status', this.__traxForm.value.tin_status);
    fb.append('plan', this.__traxForm.value.plan);
    fb.append('option', this.__traxForm.value.option);
    fb.append('inv_type', this.__traxForm.value.inv_type);
    fb.append('application_no', (this.__traxForm.value.inv_type == 'F' ? this.__traxForm.value.application_no : ''));


    fb.append('mode_of_holding', this.__traxForm.value.mode_of_holding);
    fb.append(
      'euin_no',
      this.__traxForm.value.euin_no
        ? this.__traxForm.value.euin_no.split(' ')[0]
        : ''
    );
    if (this.__traxForm.value.trans_id == '5') {
      fb.append('sip_start_date', this.__traxForm.value.sip_start_date);
      fb.append('sip_end_date', this.__traxForm.value.sip_end_date);
      fb.append('sip_duration_type', this.__traxForm.value.sip_duration);
      fb.append('duration', this.__traxForm.value.duration);
      fb.append('sip_date', this.__traxForm.value.sip_date);
      // fb.append('period', this.__traxForm.value.period);
      fb.append('sip_frequency', this.__traxForm.value.sip_frequency);
    } else if (this.__traxForm.value.trans_id == '6') {
      fb.append('option_to', this.__traxForm.value.option_to);
      fb.append('plan_to', this.__traxForm.value.plan_to);
      fb.append('scheme_id_to', this.__traxForm.value.scheme_id_to);
      fb.append('switch_by', this.__traxForm.value.switch_by);
      fb.append(
        'unit',
        this.__traxForm.value.switch_by == 'U' ? this.__traxForm.value.unit : ''
      );
    } else if (this.__traxForm.value.trans_id == '35') {
      fb.append(
        'option_to',
        this.__traxForm.get(['nfo_combo', 'switch_option_to']).value
      );
      fb.append(
        'plan_to',
        this.__traxForm.get(['nfo_combo', 'switch_plan_to']).value
      );
      fb.append(
        'scheme_id_to',
        this.__traxForm.get(['nfo_combo', 'switch_scheme_id_to']).value
      );
      fb.append(
        'switch_by',
        this.__traxForm.get(['nfo_combo', 'switch_by']).value
      );
      fb.append(
        'unit',
        this.__traxForm.get(['nfo_combo', 'switch_by']).value == 'U'
          ? this.__traxForm.get(['nfo_combo', 'switch_unit']).value
          : ''
      );
    }

    if (this.__traxForm.value.bu_type == '5') {
      fb.append(
        'sub_brk_cd',
        this.__traxForm.value.sub_brk_cd
          ? this.__traxForm.value.sub_brk_cd.split(' ')[0]
          : ''
      );
      fb.append(
        'sub_arn_no',
        this.__traxForm.value.sub_arn_no ? this.__traxForm.value.sub_arn_no : ''
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
        this.__traxForm.controls['tin_status'].patchValue('Y');
        this.dialogRef.close({ tin_no: res.tin_no, data: res.data });
      }
      this.__utility.showSnackbar(
        res.suc == 1 ? 'Form Submitted Successfully' : res.msg,
        res.suc
      );
    });
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
  minimize() {
    this.dialogRef.updateSize('30%', '55px');
    this.dialogRef.updatePosition({
      bottom: '0px',
      right: this.data.right + 'px',
    });
  }
  maximize() {
    this.dialogRef.updateSize('60%');
    this.__isVisible = !this.__isVisible;
  }
  fullScreen() {
    this.dialogRef.updateSize('100%');
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
          : __type == 'ST'
          ? this.__dialogDtForSchemeTo.scheme_name
          : __type == 'NST'
          ? this.__dialogDtForSchemeToForNfoCombo.scheme_name
          : this.__dialogDtForBnk.bank_name,
      dt:
        __type == 'C'
          ? this.__dialogDtForClient
          : __type == 'S'
          ? this.__dialogDtForScheme
          : __type == 'ST'
          ? this.__dialogDtForSchemeTo
          : __type == 'NST'
          ? this.__dialogDtForSchemeToForNfoCombo
          : this.__dialogDtForBnk,
    };
    try {
      const dialogref = this.__dialog.open(
        PreviewdtlsDialogComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe(res =>{
        if(res){
          if(__type == 'B'){
            this.__bnkMst.push(res.data);
            this.getItemsDtls(res.data, 'B');
          }
        }
      })
    } catch (ex) {}
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
    } catch (ex) {}
  }
  preventNonumeric(__ev) {
    dates.numberOnly(__ev);
  }
  setStartDT(__ev) {
    this.setEndDate(__ev);
  }
  setEndDate(__dt) {
    console.log(__dt);
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
    this.__traxForm.controls['sip_end_date'].setValue(_calculateDT);

    // var dt;
    //   if(this.__traxForm.controls['sip_frequency'].value == 'D'){
    //           //Daily
    //       dt = new Date(this.__traxForm.get('sip_start_date').value);
    //       let _calculateDT = new Date(dt.setDate(dt.getDate() + Number(__dt))).toISOString().substring(0 ,10);
    //       this.__traxForm.controls['sip_end_date'].setValue(_calculateDT);

    //   }
    //   else if(this.__traxForm.controls['sip_frequency'].value == 'W'){
    //           //weekly
    //           // dt = new Date(this.__traxForm.get('sip_start_date').value);
    //           // let _calculateDT = new Date(dt.setDate(dt.getDate() + (Number(__dt) * 7))).toISOString().substring(0 ,10);
    //           // this.__traxForm.controls['sip_end_date'].setValue(_calculateDT);

    //   }
    //   else if(this.__traxForm.controls['sip_frequency'].value == 'F'){
    //           //fortnightly

    //   }
    //   else if(this.__traxForm.controls['sip_frequency'].value == 'M'){
    //           //Monthly
    //           dt = new Date(this.__traxForm.get('sip_start_date').value);
    //           let _calculateDT = new Date(dt.setMonth(dt.getMonth() + Number(__dt))).toISOString().substring(0 ,10);
    //           this.__traxForm.controls['sip_end_date'].setValue(_calculateDT);
    //   }
    //   else if(this.__traxForm.controls['sip_frequency'].value == 'Q'){
    //           //Querterly

    //   }
    //   else if(this.__traxForm.controls['sip_frequency'].value == 'S'){
    //           //Semi Anually

    //   }
    //   else if(this.__traxForm.controls['sip_frequency'].value == 'A'){
    //           //Anually
    //   }
  }

  checkIfEntryDategreater(): Observable<boolean> {
    // console.log(
    //   this.__isEntryDTGreater > new Date().toISOString().substring(0, 10)
    // );
    if(this.__traxForm.value.trans_id == 6){
    return of(
      this.__isEntryDTGreater > new Date().toISOString().substring(0, 10)
    );}
    return of(true);
  }
  EntryDateExpiredValidators(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfEntryDategreater().pipe(
        map((res) => {
          if (control.value && this.__traxForm.value.tin_status == 'N') {
            return res ? null : { __isDateGreater: true };
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

  amtCheck(res): boolean {
    if (this.__traxForm.get('trans_id').value == 4) {
      if (
        this.__traxForm.get('inv_type').value == 'F' &&
        this.__sipdtRng_amtRng
      ) {
        return this.checkAmtrightorNot(
          Number(this.__sipdtRng_amtRng.pip_fresh_min_amt),
          Number(res)
        );
      } else if (
        this.__traxForm.get('inv_type').value == 'A' &&
        this.__sipdtRng_amtRng
      ) {
        return this.checkAmtrightorNot(
          Number(this.__sipdtRng_amtRng.pip_add_min_amt),
          Number(res)
        );
      }
    } else if (this.__traxForm.get('trans_id').value == 5) {
      console.log(
        this.__sipfreq.filter(
          (x: any) => x.id == this.__traxForm.controls['sip_frequency'].value
        )
      );

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

  checkIfAmountLess(res): Observable<boolean> {
    return of(this.amtCheck(res));
  }
  AmountValidators(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfAmountLess(control.value).pipe(
        map((res) => {
          if (control.value) {
            console.log(res);

            return res ? { AmtExists: true } : null;
          }
          return null;
        })
      );
    };
  }

  checkIfscmToExist(scm_name: string): Observable<boolean> {
    console.log(scm_name);

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

  checkIfNfoscmToExist(scm_name: string): Observable<boolean> {
    return of(
      this.__nfoSchemeSwitchTo.findIndex((x) => x.scheme_name == scm_name) != -1
    );
  }
  NFOSchemeToValidators(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfNfoscmToExist(control.value).pipe(
        map((res) => {
          if (control.value) {
            return res ? null : { NfoScmToExists: true };
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

  openDialogForCreateBnk(id) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.width = '40%';
    dialogConfig.data = {
      id: id,
      flag: 'B-NFO',
      formName: 'B-NFO',
      title: id == 0 ? 'Add Bank' : 'Update Bank',
      right: global.randomIntFromInterval(1, 60),
    };
    const dialogref = this.__dialog.open(CreateBankComponent, dialogConfig);
    dialogref.afterClosed().subscribe((dt) => {
      if (dt) {
        this.__bnkMst.push(dt.data);
        this.getItemsDtls(dt.data, 'B');
      }
    });
  }

  checkIfDatesExists(sip_date: string): Observable<boolean> {
    return of(this.__sipDT.some((ele) => ele.date === sip_date)).pipe(
      delay(1000)
    );
  }
  sipDateValidators(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      console.log(control);

      return this.checkIfDatesExists(control.value).pipe(
        map((res) => {
          console.log(res);
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

  setStartDateBySIPdate(res) {
    console.log(res);
    console.log(this.__noofdaystobeAdded);

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
    console.log(dt);

    this.__traxForm
      .get('sip_start_date')
      .setValue(dt.toISOString().slice(0, 10));
  }

  checkIfSpecialSIPExists(sip_type): Observable<boolean> {
    return of(this.__sipdtRng_amtRng?.ava_special_sip == 'true' ? true : false);
  }
  sipSipTypeExistValidators(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      console.log(control);

      return this.checkIfSpecialSIPExists(control.value).pipe(
        map((res) => {
          console.log(typeof res);

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

  getSelectedItemsFromParent(event) {
    this.getItemsDtls(event.item, event.flag);
  }
  openPDF(){
    window.open(this.__traxForm.get('filePreview').value,'__blank')
  }
}
