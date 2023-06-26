import { Overlay } from '@angular/cdk/overlay';
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  map,
  pluck,
  switchMap,
  tap,
} from 'rxjs/operators';
import { CreateClientComponent } from 'src/app/shared/create-client/create-client.component';
import { insComp } from 'src/app/__Model/insComp';
import { insPrdType } from 'src/app/__Model/insPrdType';
import { insProduct } from 'src/app/__Model/insproduct';
import { bank } from 'src/app/__Model/__bank';
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { global } from 'src/app/__Utility/globalFunc';
import { environment } from 'src/environments/environment';
import buisnessType from '../../../../../../../../assets/json/buisnessType.json';
import mdOfPre from '../../../../../../../../assets/json/Master/modeofPremium.json';
import { DialogForViewComponent } from '../dialog-for-view/dialog-for-view.component';
@Component({
  selector: 'app-trax-entry',
  templateUrl: './trax-entry.component.html',
  styleUrls: ['./trax-entry.component.css'],
})
export class TraxEntryComponent implements OnInit {
  @ViewChild('searchTempTin') __searchTempTin: ElementRef;
  @ViewChild('searchEUIN') __searchRlt: ElementRef;
  @ViewChild('subBrkArn') __subBrkArn: ElementRef;
  @ViewChild('clientCd') __clientCode: ElementRef;
  @ViewChild('insuredCd') __insuredCd: ElementRef;
  @ViewChild('searchbnk') __searchbnk: ElementRef;
  @ViewChild('proposer_name') __propser_name: ElementRef;

  __temp_tinMst: any = [];
  __euinMst: any = [];
  __subbrkArnMst: any = [];
  __bu_type = buisnessType;
  __insTypeMst: any = [];
  __clientMst: any = [];
  __insuredPerson: client[] = [];
  __cmpMst: insComp[] = [];
  __prdTypeMst: insPrdType[] = [];
  __prdMst: insProduct[] = [];
  __bnkMst: bank[] = [];
  __frmLoginAtMst: insComp[] = [];
  allowedExtensions = ['pdf'];

  __modeOfPremium = mdOfPre;
  __mcOptionMenu: any = [
    { flag: 'M', name: 'Minor', icon: 'person_pin' },
    { flag: 'P', name: 'Pan Holder', icon: 'credit_card' },
    { flag: 'N', name: 'Non Pan Holder', icon: 'credit_card_off' },
  ];

  __dialogDtForBnk: any;
  __dialogDtForClient: any;

  __isVisible: boolean = true;
  __istemporaryspinner: boolean = false;
  __isEuinPending: boolean = false;
  __isSubArnPending: boolean = false;
  __isClientPending: boolean = false;
  __isCldtlsEmpty: boolean = false;
  __isInsuredPersonExist: boolean = false;
  __isBankPending: boolean = false;

  __insTrax = new FormGroup({
    policy_no: new FormControl(this.data.data ? this.data.data.policy_no : ''),
    tin_status: new FormControl(
      this.data.data ? this.data.data.entry_tin_status : 'Y',
      [Validators.required]
    ),
    temp_tin_no: new FormControl('',[Validators.required]
    ),
    bu_type: new FormControl('', [Validators.required]),
    euin_no: new FormControl('',
    {
      validators:[Validators.required],
      asyncValidators:[this.EmpValidators()]
    }
    ),
    // sub_brk_cd: new FormControl(''),
    sub_arn_no: new FormControl(''),
    insure_bu_type: new FormControl('', [Validators.required]),
    ins_type_id: new FormControl('', [Validators.required]),
    proposer_name: new FormControl(''),
    proposer_id: new FormControl('', [Validators.required]),
    proposer_code: new FormControl('',
    {
      validators:[Validators.required],
      asyncValidators:[this.__utility.ClientValidators(this.__clientMst)]
    }
    ),
    proposal_no: new FormControl(''),
    sum_assured: new FormControl(''),
    sum_insured: new FormControl(''),
    gross_premium: new FormControl('', {
      validators: [Validators.required],
      updateOn: 'blur',
    }),
    chq_bank: new FormControl(''),
    micr_code: new FormControl(''),
    bank_name: new FormControl(''),
    acc_no: new FormControl(''),
    payment_ref_no: new FormControl(''),
    comp_login_at: new FormControl('', [Validators.required]),
    chq_no: new FormControl('', [
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.pattern('^[0-9]*$'),
    ]),
    mode_of_payment: new FormControl('', [Validators.required]),
    net_premium: new FormControl(''),
    mode_of_premium: new FormControl('', [Validators.required]),
    premium_paying_date: new FormControl(''),
    is_same: new FormControl(''),
    company_id: new FormControl('', [Validators.required]),
    product_type_id: new FormControl('', [Validators.required]),
    product_id: new FormControl('', [Validators.required]),
    insured_person: new FormGroup({
      insured_person_id: new FormControl(''),
      insured_person_code: new FormControl(''),
      insured_person_name: new FormControl('', [Validators.required]),
      insured_person_pan: new FormControl('', [
        Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
      insured_person_dob: new FormControl('', [Validators.required]),
    }),
    third_party_premium: new FormControl(''),
    od_premium: new FormControl(''),
    policy_term: new FormControl('', {validators:[Validators.required],updateOn:'blur'}),
    policy_pre_pay_term: new FormControl('', [Validators.required]),
    ack_filePreview: new FormControl(''),
    filePreview: new FormControl(''),
    app_form_scan: new FormControl(''),
    file: new FormControl('', [
      Validators.required,
      fileValidators.fileExtensionValidator(this.allowedExtensions),
    ]),
    remarks: new FormControl(''),
  });
  constructor(
    public dialogRef: MatDialogRef<TraxEntryComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog,
    private overlay: Overlay
  ) {}

  ngOnInit(): void {
    this.getInsTypeMst();
    this.getFormLoginAtMst();
   setTimeout(() => {
    this.setInsTraxForm();
   }, 500);
  }
  setInsTraxForm(){
    if (this.data.data) {
      this.__insTrax.controls['temp_tin_no'].setValue(
        this.data.data.temp_tin_no,
        { emitEvent: false }
      );
      this.__insTrax.controls['bu_type'].setValue(this.data.data.bu_type,{emitEvent:false});
     this.__euinMst.push({euin_no:this.data.data.euin_no,emp_name:this.data.data.emp_name});
      this.__insTrax.controls['euin_no'].setValue(
        this.data.data.euin_no + ' - ' + this.data.data.emp_name, {
        emitEvent: false,
      });
      this.__insTrax.controls['is_same'].setValue(this.data.data.proposer_id == this.data.data.insured_person_id,{emitEvent:false});
      this.__insTrax.patchValue({
        insure_bu_type: this.data.data.insure_bu_type,
        ins_type_id: this.data.data.ins_type_id,
        proposal_no: this.data.data.proposal_no,
        sum_assured:  this.data.data.ins_type_id == '2' ? this.data.data.sum_assured : '',
        sum_insured: (this.data.data.ins_type_id == '1' || this.data.data.ins_type_id == '3') ? this.data.data.sum_insured : '',
        premium_paying_date: this.data.data.ins_type_id == '1' ? this.data.data.premium_paying_date : '',
        gross_premium: this.data.data.gross_premium,
        acc_no: this.data.data.acc_no,
        comp_login_at: this.data.data.comp_login_at,
        mode_of_payment: this.data.data.mode_of_payment,
        net_premium: this.data.data.net_premium,

        company_id: this.data.data.company_id,
        product_type_id: this.data.data.product_type_id,
        product_id: this.data.data.product_id,
        remarks: this.data.data.remarks,
        mode_of_premium: this.data.data.mode_of_premium,
        policy_term: this.data.data.policy_term,
        policy_pre_pay_term: this.data.data.policy_pre_pay_term,
        chq_no: this.data.data.mode_of_payment == 'O' ? this.data.data.chq_no : '',
        payment_ref_no: this.data.data.mode_of_payment == 'N' ? this.data.data.payment_ref_no  : '',
        filePreview:  `${environment.ins_app_form_url + this.data.data.app_form_scan}`,
        third_party_premium: this.data.data.third_party_premium,
        od_premium:this.data.data?.od_premium
      });
     this.__insTrax.controls['file'].removeValidators([
      Validators.required,
      fileValidators.fileExtensionValidator(this.allowedExtensions),
    ]);
    this.__insTrax.controls['file'].updateValueAndValidity({emitEvent:false});
    /** Propser Code */
    this.__clientMst.push({
      client_code:this.data.data.proposer_code,
      id:this.data.data.proposer_id,
      client_name:this.data.data.proposer_name,
      pan:this.data.data.proposer_pan,
      dob:this.data.data.proposer_dob
    })
      this.getItems(
        {
          client_code:this.data.data.proposer_code,
          id:this.data.data.proposer_id,
          client_name:this.data.data.proposer_name,
          pan:this.data.data.proposer_pan,
          dob:this.data.data.proposer_dob
        },
          'C'
        );

      if (this.__insTrax.value == 'B') {
        this.__subbrkArnMst.push({code:this.data.data.code});
        this.__insTrax.controls['sub_arn_no'].setValue(this.data.data.code, {
          emitEvent: false,
        });
        // this.__insTrax.controls['sub_brk_cd'].setValue(this.data.data.code, {
        //   emitEvent: false,
        // });
      }
    /** Insured Person */
      this.getItems(
        {
          client_code:this.data.data.proposer_code,
          id:this.data.data.proposer_id,
          client_name:this.data.data.proposer_name,
          pan:this.data.data.proposer_pan,
          dob:this.data.data.insured_person_dob
        }
          ,
          'I'
      );
    /** Bank */
      this.getItems(
        {
          micr_code : this.data.data.micr_code,
          bank_name: this.data.data.bank_name,
          id: this.data.data.chq_bank,
          ifs_code: this.data.data.ifs_code,
          branch_name:this.data.data.branch_name,
          branch_addr: this.data.data.branch_addr
        },
        'B'
      );
    }
  }

  getFormLoginAtMst() {
    this.__dbIntr
      .api_call(0, '/ins/company', null)
      .pipe(pluck('data'))
      .subscribe((res: insComp[]) => {
        this.__frmLoginAtMst = res;
      });
  }
  getCompanyType(__res) {
    this.__dbIntr
      .api_call(0, '/ins/company', 'ins_type_id=' + __res)
      .pipe(pluck('data'))
      .subscribe((res: insComp[]) => {
        this.__cmpMst = res;
      });
  }
  getProductType(__res) {
    this.__dbIntr
      .api_call(0, '/ins/productType', 'ins_type_id=' + __res)
      .pipe(pluck('data'))
      .subscribe((res: insPrdType[]) => {
        this.__prdTypeMst = res;
      });
  }
  getProductName(__ins_type_id, __comp_id,__prd_type_id) {
    if (__ins_type_id && __comp_id && __prd_type_id) {
      this.__dbIntr
        .api_call(
          0,
          '/ins/product',
          'ins_type_id=' + __ins_type_id
          + '&company_id=' + __comp_id
          + '&product_type_id=' + __prd_type_id
        )
        .pipe(pluck('data'))
        .subscribe((res: insProduct[]) => {
          this.__prdMst = res;
        });
    } else {
      this.__prdMst = [];
    }
  }
  setnetPremium(gross_premium) {
    let premium = 0;
    premium = (gross_premium / 118) * 100;
    this.__insTrax.patchValue({
      net_premium: premium.toFixed(2),
    });
  }
  ngAfterViewInit() {

    /** Mode Of Premium */
    this.__insTrax.controls['mode_of_premium'].valueChanges.subscribe(res =>{
      this.setPolicyPremiumPayingTerm(
        this.__insTrax.controls['policy_term'].value,
        res);
    })

    /**Policy Term Change */
    this.__insTrax.controls['policy_term'].valueChanges.subscribe(res =>{
         this.setPolicyPremiumPayingTerm(res,this.__insTrax.controls['mode_of_premium'].value);
    })

    /**Insured Buisness Type */
    this.__insTrax.controls['insure_bu_type'].valueChanges.subscribe(res =>{
      this.__insTrax.controls['policy_no'].setValidators(res == 'R' ? [Validators.required] : null);
      this.__insTrax.controls['policy_no'].updateValueAndValidity({emitEvent:false});
    })
    /**End */

    /** TIN STATUS */
    this.__insTrax.controls['tin_status'].valueChanges.subscribe((res) => {
      this.__insTrax.controls['temp_tin_no'].setValidators(
        res == 'Y' ? [Validators.required] : null
      );
      this.__insTrax.controls['temp_tin_no'].updateValueAndValidity({
        emitEvent: false,
      });
    });
    /** END */
    // Bank SEARCH
    this.__insTrax.controls['micr_code'].valueChanges
      .pipe(
        tap(() => (this.__isBankPending = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.searchItems('/depositbank', dt) : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__bnkMst = value;
          this.searchResultVisibilityForBank('block');
          this.__insTrax.patchValue({
            chq_bank: '',
            bank_name: '',
          });
          this.__dialogDtForBnk = null;
          this.__isBankPending = false;
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isBankPending = false;
        },
      });

    /**Mode Of Payment */
    this.__insTrax.controls['mode_of_payment'].valueChanges.subscribe((res) => {
      this.__insTrax.controls['chq_no'].setValidators(
        res == 'O'
          ? [
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(6),
              Validators.pattern('^[0-9]*$'),
            ]
          : null
      );
      this.__insTrax.controls['acc_no'].setValidators(res == 'O' ? [Validators.required] : null)
      this.__insTrax.controls['payment_ref_no'].setValidators(res == 'N' ? [Validators.required] : null);
      this.__insTrax.controls['bank_name'].setValidators(res == 'O' ? [Validators.required] : null);
      this.__insTrax.controls['chq_bank'].setValidators(res == 'O' ? [Validators.required] : null);
      this.__insTrax.controls['micr_code'].setValidators(res == 'O' ? [Validators.required] : null);
      this.__insTrax.controls['chq_no'].updateValueAndValidity({emitEvent: false,});
      this.__insTrax.controls['payment_ref_no'].updateValueAndValidity({emitEvent: false,});
      this.__insTrax.controls['bank_name'].updateValueAndValidity({emitEvent: false,});
      this.__insTrax.controls['chq_bank'].updateValueAndValidity({emitEvent: false,});
      this.__insTrax.controls['micr_code'].updateValueAndValidity({emitEvent: false});
      this.__insTrax.controls['acc_no'].updateValueAndValidity({emitEvent:false});
    });

    /** Gross Premium Change*/
    this.__insTrax.controls['gross_premium'].valueChanges.subscribe((res) => {
      this.setnetPremium(res);
    });

    /** company name Change*/
    this.__insTrax.controls['company_id'].valueChanges.subscribe((res) => {
      this.getProductName(
        this.__insTrax.controls['ins_type_id'].value,
        res,
        this.__insTrax.controls['product_type_id'].value
        );
    });
    /**Insurance Type Id Change */
    this.__insTrax.controls['ins_type_id'].valueChanges.subscribe((res) => {
      this.__insTrax.controls['sum_assured'].setValidators(res == '2' ? [Validators.required] : null);
      this.__insTrax.controls['sum_insured'].setValidators((res == '1' || res == '3') ? [Validators.required] : null);
      this.__insTrax.controls['premium_paying_date'].setValidators(res == '1' ? [Validators.required] : null);
      this.__insTrax.controls['third_party_premium'].setValidators((res == '1' && this.__insTrax.controls['product_type_id'].value == '3') ? [Validators.required] : null);
      this.__insTrax.controls['od_premium'].setValidators((res == '1' && this.__insTrax.controls['product_type_id'].value == '3') ? [Validators.required] : null);
      this.__insTrax.controls['sum_insured'].updateValueAndValidity({emitEvent: false});
      this.__insTrax.controls['sum_assured'].updateValueAndValidity({emitEvent: false});
      this.__insTrax.controls['premium_paying_date'].updateValueAndValidity({emitEvent: false});
      this.__insTrax.controls['third_party_premium'].updateValueAndValidity({emitEvent:false});
      this.__insTrax.controls['od_premium'].updateValueAndValidity({emitEvent:false});

      this.getCompanyType(res);
      this.getProductType(res);
      this.getProductName(
        res,
        this.__insTrax.controls['company_id'].value,
        this.__insTrax.controls['product_type_id'].value
        );
    });

    /** Product Type Change */
    this.__insTrax.controls['product_type_id'].valueChanges.subscribe(res =>{
      this.getProductName(
        this.__insTrax.controls['ins_type_id'].value,
        this.__insTrax.controls['company_id'].value,
        res
        );
      this.__insTrax.controls['third_party_premium'].setValidators((res == '3' && this.__insTrax.controls['ins_type_id'].value == '1') ? [Validators.required] : null);
      this.__insTrax.controls['od_premium'].setValidators((res == '3' && this.__insTrax.controls['ins_type_id'].value == '1') ? [Validators.required] : null);
      this.__insTrax.controls['third_party_premium'].updateValueAndValidity({emitEvent:false});
      this.__insTrax.controls['od_premium'].updateValueAndValidity({emitEvent:false});
    })

    // Temporary Tin Number
    this.__insTrax.controls['temp_tin_no'].valueChanges
      .pipe(
        tap(() => (this.__istemporaryspinner = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1
            ? this.__dbIntr.searchTin('/ins/formreceived', dt + '&flag=C')
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
        error: (err) => (this.__istemporaryspinner = false),
      });

    /**Buisness Type Change */
    this.__insTrax.controls['bu_type'].valueChanges.subscribe((res) => {
      this.__insTrax.controls['euin_no'].setValue('', { emitEvent: false });
      this.__insTrax.controls['sub_arn_no'].setValidators(
        res == 'B' ? [Validators.required] : null
      );
      this.__insTrax.controls['sub_arn_no'].setAsyncValidators(
        res == 'B' ? [this.__utility.SubBrokerValidators(this.__subbrkArnMst)] : null
      );
      this.__insTrax.controls['sub_arn_no'].setValue('', { emitEvent: false });
      // this.__insTrax.controls['sub_brk_cd'].setValue('', { emitEvent: false });
      this.__insTrax.controls['sub_arn_no'].updateValueAndValidity({
        emitEvent: false,
      });
      // this.__insTrax.controls['sub_brk_cd'].updateValueAndValidity({
      //   emitEvent: false,
      // });
    });

    /** EUIN Number */
    this.__insTrax.controls['euin_no'].valueChanges
      .pipe(
        tap(() => (this.__isEuinPending = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1
            ? this.__dbIntr.searchItems(
                '/employee',
                global.containsSpecialChars(dt) ? dt.split(' ')[0] : dt
                +
                  (this.__insTrax.controls['bu_type'].value == 'B'
                    ? this.__insTrax.controls['sub_arn_no'].value
                      ? '&sub_brk_cd=' +
                        this.__insTrax.controls['sub_arn_no'].value
                      : "&sub_brk_cd=''"
                    : '')
              )
            : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__euinMst = value;
          this.searchResultVisibilityForEUIN('block');
          this.__isEuinPending = false;
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isEuinPending = false;
        },
      });

    /**change Event of sub Broker Arn Number */
    this.__insTrax.controls['sub_arn_no'].valueChanges
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

          // this.__insTrax.controls['sub_brk_cd'].setValue('');
          this.__subbrkArnMst = value;
          this.searchResultVisibilityForSubBrk('block');
          this.__isSubArnPending = false;
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isSubArnPending = false;
        },
      });

    /**Change Event of Proposer Code */
    this.__insTrax.controls['proposer_code'].valueChanges
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
          this.__isCldtlsEmpty = value.data.length > 0 ? false : true;
          this.searchResultVisibilityForClient('block');
          this.__insTrax.patchValue({
            proposer_id: '',
            proposer_name: '',
          });
          this.__isClientPending = false;
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isClientPending = false;
        },
      });

    /**Check Same As Above */
    this.__insTrax.controls['is_same'].valueChanges.subscribe((res) => {
      this.getItems(res ? this.__dialogDtForClient : '', 'I');
    });

    /**insured person search */
    this.__insTrax
      .get('insured_person.insured_person_code')!
      .valueChanges.pipe(
        tap(() => (this.__isInsuredPersonExist = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.searchItems('/client', dt) : []
        ),
        map((x: any) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__insuredPerson = value.data;
          this.searchResultVisibilityForInsuredPerson('block');
          this.__insTrax
            .get(['insured_person', 'insured_person_id'])
            .setValue('');
          this.__insTrax
            .get(['insured_person', 'insured_person_name'])
            .setValue('');
          this.__insTrax
            .get(['insured_person', 'insured_person_pan'])
            .setValue('');
          this.__insTrax
            .get(['insured_person', 'insured_person_dob'])
            .setValue('');
          this.__isInsuredPersonExist = false;
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isInsuredPersonExist = false;
        },
      });
  }

  /**Set Policy Premium Paying Term agains Policy Term For General Insurance */
  setPolicyPremiumPayingTerm(__policy_term,__mode_of_premium){
    if(this.__insTrax.controls['ins_type_id'].value == '1'){
    if(__policy_term && __mode_of_premium){
      let __calPremiumPayingTerm;
      switch(__mode_of_premium){
        case 'M' :
                   __calPremiumPayingTerm = (__policy_term * 12) / 12;
                   break;
        case 'Q' :
                   __calPremiumPayingTerm = (__policy_term * 12) / 4;
                   break;
        case 'A' :
                   __calPremiumPayingTerm = (__policy_term * 12) / 12;
                   break;
        case 'H' :
                   __calPremiumPayingTerm = (__policy_term * 12) / 6;
                   break;
        case 'S' :  __calPremiumPayingTerm = 1;
                   break;
        default: break;
      }
      this.__insTrax.controls['policy_pre_pay_term'].setValue(__calPremiumPayingTerm,{emitEvent:false});
    }
     }
  }

  InsuranceTrax() {

    const __insTrax = new FormData();
    __insTrax.append(
      'tin_status',
      global.getActualVal(this.__insTrax.value.tin_status)
    );
    __insTrax.append(
      'temp_tin_no',
      (this.__insTrax.value.tin_status == 'Y'
        ? global.getActualVal(this.__insTrax.value.temp_tin_no)
        : '')
    );
    __insTrax.append(
      'bu_type',
      global.getActualVal(this.__insTrax.value.bu_type)
    );
    __insTrax.append(
      'euin_no',
      this.__insTrax.value.euin_no
        ? this.__insTrax.value.euin_no.split(' ')[0]
        : ''
    );
    if (this.__insTrax.value.bu_type == 'B') {
      // __insTrax.append(
      //   'sub_brk_cd',
      //   global.getActualVal(this.__insTrax.value.sub_brk_cd)
      // );
      __insTrax.append(
        'sub_arn_no',
        global.getActualVal(this.__insTrax.value.sub_arn_no)
      );
    }
    __insTrax.append(
      'ins_type_id',
      global.getActualVal(this.__insTrax.value.ins_type_id)
    );
    __insTrax.append(
      'insure_bu_type',
      global.getActualVal(this.__insTrax.value.insure_bu_type)
    );
    __insTrax.append(
      'proposer_id',
      global.getActualVal(this.__insTrax.value.proposer_id)
    );
    __insTrax.append(
      'insured_person_code',
      global.getActualVal(
        this.__insTrax.get('insured_person.insured_person_code').value
      )
    );
    __insTrax.append(
      'insured_person_name',
      global.getActualVal(
        this.__insTrax.get('insured_person.insured_person_name').value
      )
    );
    __insTrax.append(
      'insured_person_pan',
      global.getActualVal(
        this.__insTrax.get('insured_person.insured_person_pan').value
      )
    );
    __insTrax.append(
      'insured_person_dob',
      global.getActualVal(
        this.__insTrax.get('insured_person.insured_person_dob').value
      )
    );
    __insTrax.append(
      'insured_person_id',
      global.getActualVal(
        this.__insTrax.get('insured_person.insured_person_id').value
      )
    );

    __insTrax.append(
      'company_id',
      global.getActualVal(this.__insTrax.value.company_id)
    );
    __insTrax.append(
      'product_type_id',
      global.getActualVal(this.__insTrax.value.product_type_id)
    );
    __insTrax.append(
      'product_id',
      global.getActualVal(this.__insTrax.value.product_id)
    );

    if(this.__insTrax.value.ins_type_id == '2'){
      __insTrax.append(
        'sum_assured',
        global.getActualVal(this.__insTrax.value.sum_assured)
      );
    }
    else if(this.__insTrax.value.ins_type_id == '3'){
      __insTrax.append(
        'sum_insured',
        global.getActualVal(this.__insTrax.value.sum_insured)
      );
    }
    else{
      __insTrax.append(
        'sum_insured',
        global.getActualVal(this.__insTrax.value.sum_insured)
      );
      __insTrax.append(
        'premium_paying_date',
        global.getActualVal(this.__insTrax.value.premium_paying_date)
      );
      if(this.__insTrax.value.product_type_id == '3'){
        __insTrax.append(
          'third_party_premium',
          global.getActualVal(this.__insTrax.value.third_party_premium)
        );
        __insTrax.append(
          'od_premium',
          global.getActualVal(this.__insTrax.value.od_premium)
        );
      }
    }

    __insTrax.append(
      'mode_of_premium',
      global.getActualVal(this.__insTrax.value.mode_of_premium)
    );
    __insTrax.append(
      'gross_premium',
      global.getActualVal(this.__insTrax.value.gross_premium)
    );
    __insTrax.append(
      'net_premium',
      global.getActualVal(this.__insTrax.value.net_premium)
    );
    __insTrax.append(
      'mode_of_payment',
      global.getActualVal(this.__insTrax.value.mode_of_payment)
    );
    if (this.__insTrax.value.mode_of_payment == 'O') {
      __insTrax.append(
        'chq_no',
        global.getActualVal(this.__insTrax.value.chq_no)
      );
      __insTrax.append(
        'acc_no',
        global.getActualVal(this.__insTrax.value.acc_no)
      );
      __insTrax.append(
        'chq_bank',
        global.getActualVal(this.__insTrax.value.chq_bank)
      );
    } else if (this.__insTrax.value.mode_of_payment == 'N') {
      __insTrax.append(
        'payment_ref_no',
        global.getActualVal(this.__insTrax.value.payment_ref_no)
      );
      __insTrax.append(
        'acc_no',
        global.getActualVal(this.__insTrax.value.acc_no)
      );
      __insTrax.append(
        'chq_bank',
        global.getActualVal(this.__insTrax.value.chq_bank)
      );
    }
    __insTrax.append(
      'policy_term',
      global.getActualVal(this.__insTrax.value.policy_term)
    );
    __insTrax.append(
      'policy_pre_pay_term',
      global.getActualVal(this.__insTrax.value.policy_pre_pay_term)
    );

    __insTrax.append('app_form_scan', this.__insTrax.value.app_form_scan);
    __insTrax.append(
      'comp_login_at',
      global.getActualVal(this.__insTrax.value.comp_login_at)
    );
    __insTrax.append(
      'remarks',
      global.getActualVal(this.__insTrax.value.remarks)
    );

    /** If Insure Buisness Type is Fresh then send proposal number */
    if(this.__insTrax.value.insure_bu_type == 'F'){
      __insTrax.append(
        'proposal_no',
        global.getActualVal(this.__insTrax.value.proposal_no)
      );
    }
    /** If Insure Buisness Type is Renewal then send proposal number */
    else{
      __insTrax.append(
        'policy_no',
        global.getActualVal(this.__insTrax.value.policy_no)
      );
    }

    this.__dbIntr
      .api_call(1, '/ins/insTraxCreate', __insTrax)
      .subscribe((res: any) => {
        this.dialogRef.close({ id: res.data.tin_no, data: res.data });
        this.__utility.showSnackbar(
          res.suc == 1 ? 'Form Submitted Successfully' : res.msg,
          res.suc
        );
      });
  }

  /**Get Insurance Type */
  getInsTypeMst() {
    this.__dbIntr
      .api_call(0, '/ins/type', null)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.__insTypeMst = res;
      });
  }

  /**Bank Outside Click */
  outsideClickforbank(__ev) {
    if (__ev) {
      this.searchResultVisibilityForBank('none');
    }
  }

  /**Insured Person Outside Click */
  outsideClickforInsuredPerson(__ev) {
    if (__ev) {
      this.searchResultVisibilityForInsuredPerson('none');
    }
  }
  /** OutSide Click of Temporary TIN Number */
  outsideClickfortempTin(__ev) {
    if (__ev) {
      this.searchResultVisibility('none');
    }
  }
  /**OutSide Click For EUIN*/
  outsideClick(__ev) {
    if (__ev) {
      this.searchResultVisibilityForEUIN('none');
    }
  }
  /**OutSide Click For SubBrk*/
  outsideClickforSubBrkArn(__ev) {
    if (__ev) {
      this.searchResultVisibilityForSubBrk('none');
    }
  }
  /**OutSide Click For Client*/

  outsideClickforClient(__ev) {
    if (__ev) {
      this.searchResultVisibilityForClient('none');
    }
  }
  /**Search Result Off against Bank */
  searchResultVisibilityForBank(display_mode) {
    this.__searchbnk.nativeElement.style.display = display_mode;
  }
  /**Search Result Off against Insured Person */
  searchResultVisibilityForInsuredPerson(display_mode) {
    this.__insuredCd.nativeElement.style.display = display_mode;
  }
  /**Search Result Off against Proposer Code */
  searchResultVisibilityForClient(display_mode) {
    this.__clientCode.nativeElement.style.display = display_mode;
  }
  /** Search Result Off against Sub Broker */
  searchResultVisibilityForSubBrk(display_mode) {
    this.__subBrkArn.nativeElement.style.display = display_mode;
  }
  /** Search Result Off against EUIN Number */
  searchResultVisibilityForEUIN(display_mode) {
    this.__searchRlt.nativeElement.style.display = display_mode;
  }
  /** Search Result Off against Temporary TIN Number */
  searchResultVisibility(display_mode) {
    this.__searchTempTin.nativeElement.style.display = display_mode;
  }

  minimize() {
    this.dialogRef.updateSize('40%', '60px');
    this.dialogRef.updatePosition({ bottom: '0px', right: '0px' });
  }
  maximize() {
    this.dialogRef.updateSize('60%');
    this.__isVisible = !this.__isVisible;
  }
  fullScreen() {
    this.dialogRef.updateSize('80%');
    this.__isVisible = !this.__isVisible;
  }

  getItems(__el, mode) {
    switch (mode) {
      case 'T':
        this.__insTrax.controls['temp_tin_no'].setValue(__el.temp_tin_no, {
          emitEvent: false,
        });
        this.searchResultVisibility('none');
        this.getTraxDtlsAgainstTemporaryTin(__el);
        break;
      case 'E':
        this.__insTrax.controls['euin_no'].setValue(
          __el.euin_no + ' - ' + __el.emp_name,
          { emitEvent: false }
        );
        this.searchResultVisibilityForEUIN('none');
        break;
      case 'S':
        this.__insTrax.controls['sub_arn_no'].setValue(__el.code, {
          emitEvent: false,
        });
        // this.__insTrax.controls['sub_brk_cd'].setValue(__el.code);
        this.searchResultVisibilityForSubBrk('none');
        break;
      case 'I':
        this.__insTrax
          .get(['insured_person', 'insured_person_code'])
          .setValue(__el ? __el.client_code : '', { emitEvent: false });
        this.__insTrax
          .get(['insured_person', 'insured_person_id'])
          .setValue(__el ? __el.id : '');
        this.__insTrax
          .get(['insured_person', 'insured_person_name'])
          .setValue(__el ? __el.client_name : '');
        this.__insTrax
          .get(['insured_person', 'insured_person_pan'])
          .setValue(__el ? __el.pan : '');
        this.__insTrax
          .get(['insured_person', 'insured_person_dob'])
          .setValue(__el ? __el.dob : '');
        this.searchResultVisibilityForInsuredPerson('none');
        break;
      case 'C':
        this.__dialogDtForClient = __el;
        this.__insTrax.controls['proposer_code'].reset(__el.client_code, {
          onlySelf: true,
          emitEvent: false,
        });
        this.__insTrax.patchValue({
          proposer_name: __el.client_name,
          proposer_id: __el.id,
        });
        this.searchResultVisibilityForClient('none');
        break;
      case 'B':
        this.__dialogDtForBnk = __el;
        this.__insTrax.controls['micr_code'].reset(__el.micr_code, {
          onlySelf: true,
          emitEvent: false,
        });
        this.__insTrax.patchValue({
          bank_name: __el.bank_name,
          chq_bank: __el.id,
        });
        this.searchResultVisibilityForBank('none');
        break;
      default:
        break;
    }
  }
  getTraxDtlsAgainstTemporaryTin(res) {
    // this.__insTrax.controls['ins_type_id'].reset(res.ins_type_id,{onlySelf:true,emitEvent:true});
    this.__insTrax.patchValue({
      bu_type: res.bu_type,
      insure_bu_type: res.insure_bu_type,
      ins_type_id:res.ins_type_id,
      company_id:res.company_id
    });
    setTimeout(() => {
      this.__euinMst.push({euin_no:res.euin_no,emp_name: res.emp_name})
      this.getItems(res, 'E');

      this.__clientMst.push(
        {
          client_code:res.proposer_code,
          client_name: res.proposer_name,
          id:res.proposer_id
        }
        );
      this.getItems(
        {
          client_code: res.proposer_code,
          client_name: res.proposer_name,
          id: res.proposer_id,
          dob: res.dob,
          pan: res.pan,
        },
        'C'
      );
      if (res.bu_type == 'B') {
        this.__subbrkArnMst.push({code:res.sub_arn_no})
        this.getItems({code:res.sub_arn_no}, 'S');
      }
    }, 200);
  }
  navigateTo(menu) {
    // this.openDialogforClient(menu);
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
            :this.__dialogDtForBnk.bank_name,
      dt:
        __type == 'C'
          ? this.__dialogDtForClient
          : this.__dialogDtForBnk,
    };
    try {
      const dialogref = this.__dialog.open(
        DialogForViewComponent,
        dialogConfig
      );
    } catch (ex) { }
  }
  preventNonumeric(__ev) {
    dates.numberOnly(__ev);
  }
  getFIle(__ev) {
    this.__insTrax
      .get('file')
      .setValidators([
        Validators.required,
        fileValidators.fileExtensionValidator(this.allowedExtensions),
        fileValidators.fileSizeValidator(__ev.files),
      ]);
    this.__insTrax.get('file').updateValueAndValidity();
    if (this.__insTrax.get('file').status == 'VALID' && __ev.files.length > 0) {
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
    this.__insTrax.get(formcontrlname).patchValue(__val);
  }
  isNumber(__ev) {
    // dates.isNumber(__ev);
  }
  createClient(__menu, __mode) {
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
        if (dt) {
          this.getItems(dt.data, __mode);
        }
      });
    } catch (ex) {}
  }
  existingClient() {
    this.getItems('', 'I');
    this.__insTrax.controls['is_same'].setValue(false, { emitEvent: false });
    this.__propser_name.nativeElement.focus();
  }

 checkIfEmpExists(emp_name: string): Observable<boolean> {
    if(global.containsSpecialChars(emp_name)){
      return of(
        this.__euinMst.findIndex((x) => x.euin_no == emp_name.split(' ')[0])!= -1);
    }
    else{
      return of(this.__euinMst.findIndex((x) => x.euin_no == emp_name)!= -1);

    }
}
EmpValidators(): AsyncValidatorFn {
return (control: AbstractControl): Observable<ValidationErrors | null> => {
  return this.checkIfEmpExists(control.value).pipe(
    map(res => {
       if(control.value){
         return res ?  null : { empExists: true };
       }
       return null
    })
  );
};
}
}
