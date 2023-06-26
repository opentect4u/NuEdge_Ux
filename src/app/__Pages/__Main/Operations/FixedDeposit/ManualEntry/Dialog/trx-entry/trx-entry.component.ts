import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import buisnessType from '../../../../../../../../assets/json/buisnessType.json';
import { fdComp } from 'src/app/__Model/fdCmp';
import withoutKycMst from '../../../../../../../../assets/json/withoutKyc.json';
import KycMst from '../../../../../../../../assets/json/kyc.json';
import subOption from '../../../../../../../../assets/json/subOption.json';
import { dates } from 'src/app/__Utility/disabledt';
import TDSInfo from '../../../../../../../../assets/json/TDSInfo.json';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { CreateInvComponent } from '../create-inv/create-inv.component';
import { DialogDtlsComponent } from '../dialog-dtls/dialog-dtls.component';
@Component({
  selector: 'app-trx-entry',
  templateUrl: './trx-entry.component.html',
  styleUrls: ['./trx-entry.component.css']
})
export class TrxEntryComponent implements OnInit {
  @ViewChild('searchTempTin') __searchTempTin: ElementRef;
  @ViewChild('searchEUIN') __searchRlt: ElementRef;
  @ViewChild('subBrkArn') __subBrkArn: ElementRef;
  @ViewChild('clientCd') __clientCode: ElementRef;
  @ViewChild('searchbnk') __searchbnk: ElementRef;
  @ViewChild('firstInv') __firstInv: ElementRef;
  @ViewChild('sectInv') __secInv: ElementRef;



  __mcOptionMenu: any = [
    { flag: 'M', name: 'Minor', icon: 'person_pin' },
    { flag: 'P', name: 'Pan Holder', icon: 'credit_card' },
    { flag: 'N', name: 'Non Pan Holder', icon: 'credit_card_off' },
  ];


  __dialogDtForClient: any;
  __dialogDtForBnk: any;


  __istemporaryspinner: boolean = false;
  __isEuinPending: boolean = false;
  __isSubArnPending: boolean = false;
  __isClientPending: boolean = false;
  __isCldtlsEmpty:boolean =false;
  __isBankPending: boolean = false;
  __isFirstClientPending: boolean =false;
  __isSecClientPending: boolean = false;

  __temp_tinMst: any = [];
  __euinMst: any = [];
  __subbrkArnMst: any= [];
  __fdCompType: any = [];
  __fdComp: fdComp[]= []
  __fdScm: any =[];
  __clientMst: any=[];
  __firstInvMst: any=[];
   __secInvMst: any=[];
  __bnkMst: any=[];
  __loginAtMst: fdComp[] = [];
  __bu_type = buisnessType;
  __tdsInfo = TDSInfo;
  __subOpt;
  __kycMst: any =[];
  __isThirdHolderOpen:boolean = false;
  allowedExtensions = ['pdf'];

  __fdTrax = new FormGroup({
     bu_type: new FormControl('',[Validators.required]),
     temp_tin_no: new FormControl('',[Validators.required]),
     euin_no: new FormControl('',
    {
      validators:[Validators.required],
      asyncValidators:[this.EmpValidators()]
    }),
     sub_brk_cd: new FormControl(''),
     comp_type_id: new FormControl('',[Validators.required]),
     comp_id: new FormControl('',[Validators.required]),
     scheme_id: new FormControl('',[Validators.required]),
     tin_status: new FormControl('Y',[Validators.required]),
     investor_code: new FormControl('',
     {
      validators:[Validators.required],
      asyncValidators:[this.ClientValidators()]
    }
     ),
     investor_id: new FormControl('',[Validators.required]),
     investor_name: new FormControl('',[Validators.required]),
     kyc_status: new FormControl('',[Validators.required]),
     inv_kyc: new FormControl('',[Validators.required]),
     existing_mode_of_holding: new FormControl('',[Validators.required]),
     fd_bu_type_id: new FormControl('',[Validators.required]),
     inv_type_id: new FormControl(''),
     application_no:new FormControl(''),
     fdr_no: new FormControl(''),
     option: new FormControl('',[Validators.required]),
     sub_option: new FormControl('',[Validators.required]),
     tenure_type: new FormControl('',[Validators.required]),
     tenure: new FormControl('',[Validators.required,Validators.pattern("^[0-9]*$")]),
     int_rate: new FormControl('',[Validators.required,Validators.pattern("^[0-9]*$")]),
     mat_instr: new FormControl('',[Validators.required]),
     amount: new FormControl('',[Validators.required,Validators.pattern("^[0-9]*$")]),
     trns_mode: new FormControl('',[Validators.required]),
     chq_bank: new FormControl(''),
     micr_code: new FormControl(''),
     bank_name: new FormControl(''),
     acc_no: new FormControl(''),
     payment_ref_no: new FormControl(''),
     chq_no: new FormControl('', [
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.pattern('^[0-9]*$'),
    ]),
    certificate_delivery_opt: new FormControl('',[Validators.required]),
    tds_info: new FormControl('',[Validators.required]),
    login_at: new FormControl('',[Validators.required]),
    remarks: new FormControl(''),
    ack_filePreview: new FormControl(''),
    filePreview: new FormControl(''),
    app_form_scan: new FormControl(''),
    file: new FormControl('', [
      Validators.required,
      fileValidators.fileExtensionValidator(this.allowedExtensions),
    ]),

    first_inv_dtls: new FormGroup({
      id: new FormControl(''),
      investor_name: new FormControl(''),
      investor_code: new FormControl(''),
      investor_pan: new FormControl(''),
      dob: new FormControl(''),
      kyc: new FormControl('')
    }),
    sec_inv_dtls: new FormGroup({
      id: new FormControl(''),
      investor_name: new FormControl(''),
      investor_code: new FormControl(''),
      investor_pan: new FormControl(''),
      dob: new FormControl(''),
      kyc: new FormControl('')
    })

    })

  __isVisible: boolean = true;
  constructor(
    private renderer: Renderer2,
    public dialogRef: MatDialogRef<TrxEntryComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog,
    private overlay: Overlay
  ) { }

  ngOnInit(): void {
    this.getCompanyTypeMst();
    this.getLoginMst();
  }



  getLoginMst(){
    this.__dbIntr.api_call(0,'/fd/company',null).pipe(pluck("data")).subscribe((res:fdComp[]) =>{
        this.__loginAtMst = res;
    })
  }

  navigateTo(__option,__cl_type){
    this.openDialogforClient(__option,__cl_type);
  }

  openDialogforClient(__menu,__cl_type){
    console.log(__menu);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.disableClose = false;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = "100%";
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass="fullscreen-dialog"
    dialogConfig.data ={
      flag:'CL',
      id:0,
      items:null,
      title:  'Create ' + (__menu.flag == 'M' ? 'Minor' : (__menu.flag == 'P' ? 'PAN Holder' : (__menu.flag == 'N' ? 'Non Pan Holder' : 'Existing'))),
      cl_type:__menu.flag
    }
    try{
      const dialogref = this.__dialog.open(CreateInvComponent, dialogConfig);
      dialogref.afterClosed().subscribe(dt => {
        console.log(dt);
               if(dt){

                switch(__cl_type){
                  case 'C' :
                    this.__isCldtlsEmpty = false;
                    this.__clientMst.push(dt.data);
                    this.getItems(dt.data,'C');
                    break;
                  case 'SI':
                    this.__firstInvMst.push(dt.data);
                    this.getItems(dt.data,'SI');
                    break;
                  case 'TI':
                      this.__secInvMst.push(dt.data);
                      this.getItems(dt.data,'TI');
                      break;
                }
               }
      })
    }
    catch(ex){
    }
  }
  preventNonumeric(__ev) {
    dates.numberOnly(__ev)
  }
  getCompanyTypeMst(){
    this.__dbIntr.api_call(0,'/fd/companyType',null).pipe(pluck("data")).subscribe(res =>{
       this.__fdCompType = res;
    })
  }
  getCompanyMst(comp_type_id){
    if(comp_type_id){
      this.__dbIntr.api_call(0,'/fd/company','comp_type_id='+comp_type_id).pipe(pluck("data")).subscribe((res: fdComp[]) =>{
        this.__fdComp = res;
     })
    }
    else{
      this.__fdComp.length = 0;
    }

  }
  getschemeMst(comp_type_id,comp_id){
    if(comp_type_id && comp_id){
      this.__dbIntr.api_call(0,'/fd/scheme','comp_type_id='+comp_type_id + '&comp_id='+comp_id).pipe(pluck("data")).subscribe(res =>{
        this.__fdScm = res;
     })
    }
    else{
      this.__fdScm.length = 0;
    }


  }
  ngAfterViewInit(){

    this.__fdTrax.controls['existing_mode_of_holding'].valueChanges.subscribe(res =>{
            this.__fdTrax.get(['first_inv_dtls','investor_code']).setValidators(res == 'A' || res == 'J' ? [Validators.required] : null);
            this.__fdTrax.get(['first_inv_dtls','investor_name']).setValidators(res == 'A' || res == 'J' ? [Validators.required] : null);
            this.__fdTrax.get(['first_inv_dtls','dob']).setValidators(res == 'A' || res == 'J' ? [Validators.required] : null);
            this.__fdTrax.get(['first_inv_dtls','investor_pan']).setValidators(res == 'A' || res == 'J' ? [Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'), Validators.minLength(10), Validators.maxLength(10)] : null);
            this.__fdTrax.get(['first_inv_dtls','investor_code']).updateValueAndValidity({emitEvent:false});
            this.__fdTrax.get(['first_inv_dtls','investor_name']).updateValueAndValidity({emitEvent:false});
            this.__fdTrax.get(['first_inv_dtls','id']).updateValueAndValidity({emitEvent:false});
            this.__fdTrax.get(['first_inv_dtls','dob']).updateValueAndValidity({emitEvent:false});
            this.__fdTrax.get(['first_inv_dtls','investor_pan']).updateValueAndValidity({emitEvent:false});
            if(res == 'S'){
              this.cancel();
              this.cancelSecondHolder();
            }

    })


    /** Transaction Mode */
    this.__fdTrax.controls['trns_mode'].valueChanges.subscribe(res =>{
      this.__fdTrax.controls['chq_no'].setValidators(
        res == 'O'
          ? [
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(6),
              Validators.pattern('^[0-9]*$'),
            ]
          : null
      );
      this.__fdTrax.controls['acc_no'].setValidators(res == 'O' ? [Validators.required] : null)
      this.__fdTrax.controls['payment_ref_no'].setValidators(res == 'N' ? [Validators.required] : null);
      this.__fdTrax.controls['bank_name'].setValidators(res == 'O' ? [Validators.required] : null);
      this.__fdTrax.controls['chq_bank'].setValidators(res == 'O' ? [Validators.required] : null);
      this.__fdTrax.controls['micr_code'].setValidators(res == 'O' ? [Validators.required] : null);
      this.__fdTrax.controls['chq_no'].updateValueAndValidity({emitEvent: false,});
      this.__fdTrax.controls['payment_ref_no'].updateValueAndValidity({emitEvent: false,});
      this.__fdTrax.controls['bank_name'].updateValueAndValidity({emitEvent: false,});
      this.__fdTrax.controls['chq_bank'].updateValueAndValidity({emitEvent: false,});
      this.__fdTrax.controls['micr_code'].updateValueAndValidity({emitEvent: false});
      this.__fdTrax.controls['acc_no'].updateValueAndValidity({emitEvent:false});
    })

    /** Option Change */
    this.__fdTrax.controls['option'].valueChanges.subscribe(res =>{
    console.log(res);


    switch (res) {
      case 'C':
        this.__subOpt = subOption.filter(x => x.option == 'C');
        this.__fdTrax.controls['sub_option'].setValue(res);
        this.__fdTrax.controls['sub_option'].disable({onlySelf:true});
        break;
      case 'N':
          this.__subOpt = subOption.filter(x => x.option == 'N');
          this.__fdTrax.controls['sub_option'].setValue('');
          this.__fdTrax.controls['sub_option'].enable({onlySelf:true});
          break;
      default:
        this.__fdTrax.controls['sub_option'].setValue('');
        this.__fdTrax.controls['sub_option'].enable({onlySelf:true});
        break;
    }
    })

    /** Fixed Deposit Buisness Type Change */
    this.__fdTrax.controls['fd_bu_type_id'].valueChanges.subscribe(res =>{
      this.__fdTrax.controls['inv_type_id'].setValue(res);
      this.__fdTrax.controls['fdr_no'].setValidators(res == 'R' ? [Validators.required] : null);
      this.__fdTrax.controls['fdr_no'].updateValueAndValidity();
    })

    /** Investment Type Change */
    // this.__fdTrax.controls['inv_type_id'].valueChanges.subscribe(res =>{
    //   console.log();



    // })

    /** change Event of kyc status */
    this.__fdTrax.controls['kyc_status'].valueChanges.subscribe(res =>{
      this.__kycMst = res == 'Y' ? KycMst : withoutKycMst;
    })

     /**Change Event of Proposer Code */
     this.__fdTrax.controls['investor_code'].valueChanges
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
         this.__fdTrax.patchValue({
           investor_id: '',
           investor_name: '',
         });
         this.__isClientPending = false;
       },
       complete: () => console.log(''),
       error: (err) => {
         this.__isClientPending = false;
       },
     });


     /** FirstInvestor Change Event */
     this.__fdTrax.get('first_inv_dtls.investor_code')!.valueChanges
     .pipe(
       tap(() =>
        (this.__isFirstClientPending = true)),
       debounceTime(200),
       distinctUntilChanged(),
       switchMap((dt) =>
         dt?.length > 1 ? this.__dbIntr.searchItems('/client', dt) : []
       ),
       map((x: any) => x.data)
     )
     .subscribe({
       next: (value) => {
         this.__firstInvMst = value.data;
         this.searchResultVisibilityForFirstClient('block');
         console.log('ss');
         this.__fdTrax.patchValue({
          first_inv_dtls: {
            investor_name: '',
            investor_pan: '',
          }
         });
         this.__isFirstClientPending = false;
       },
       complete: () => console.log(''),
       error: (err) => {
         this.__isFirstClientPending = false;
       },
     });

      /** SecInvestor Change Event */
      this.__fdTrax.get('sec_inv_dtls.investor_code')!.valueChanges
      .pipe(
        tap(() =>
         (this.__isSecClientPending = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.searchItems('/client', dt) : []
        ),
        map((x: any) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__secInvMst = value.data;
          this.searchResultVisibilityForSecClient('block');
          console.log('ss');
          this.__fdTrax.patchValue({
           sec_inv_dtls: {
             investor_name: '',
             investor_pan: '',
           }
          });
          this.__isSecClientPending = false;
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isSecClientPending = false;
        },
      });





    /** Company Type Id Change */
    this.__fdTrax.controls['comp_type_id'].valueChanges.subscribe(res =>{
        this.getCompanyMst(res);
        this.getschemeMst(res,this.__fdTrax.get('comp_id').value)
    })
    /** company Change */
    this.__fdTrax.controls['comp_id'].valueChanges.subscribe(res =>{
      this.getschemeMst(this.__fdTrax.get('comp_type_id').value,res);
  })

     /** Temporary Tin Number */
     this.__fdTrax.controls['temp_tin_no'].valueChanges
     .pipe(
       tap(() => (this.__istemporaryspinner = true)),
       debounceTime(200),
       distinctUntilChanged(),
       switchMap((dt) =>
         dt?.length > 1
           ? this.__dbIntr.searchTin('/fd/formreceived', dt + '&flag=C')
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

          /**change Event of sub Broker Arn Number */
          this.__fdTrax.controls['sub_brk_cd'].valueChanges
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

      /** EUIN Number */
    this.__fdTrax.controls['euin_no'].valueChanges
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
                (this.__fdTrax.controls['bu_type'].value == 'B'
                  ? this.__fdTrax.controls['sub_brk_cd'].value
                    ? '&sub_brk_cd=' +
                      this.__fdTrax.controls['sub_brk_cd'].value
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

     /** Change Of TIN Status */
     this.__fdTrax.controls['tin_status'].valueChanges.subscribe(res =>{
       this.__fdTrax.controls['temp_tin_no'].setValidators(res == 'Y' ? [Validators.required] : null);
       this.__fdTrax.controls['temp_tin_no'].updateValueAndValidity({emitEvent:false});
     })
 /**Buisness Type Change */
  this.__fdTrax.controls['bu_type'].valueChanges.subscribe((res) => {
      this.__fdTrax.controls['euin_no'].setValue('', { emitEvent: false });
      this.__fdTrax.controls['sub_brk_cd'].setValidators(
        res == 'B' ? [Validators.required] : null
      );
      this.__fdTrax.controls['sub_brk_cd'].setAsyncValidators(
        res == 'B' ? [this.SubBrokerValidators()] : null
      );
      this.__fdTrax.controls['sub_brk_cd'].setValue('', { emitEvent: false });
      this.__fdTrax.controls['sub_brk_cd'].updateValueAndValidity({
        emitEvent: false,
      });
  });

  /** Bank SEARCH */
  this.__fdTrax.controls['micr_code'].valueChanges
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
      this.__fdTrax.patchValue({
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

  }

/** Second Investor Search Bar hide show */
  outsideClickforSecInvestor(__ev){
    if (__ev) {
      this.searchResultVisibilityForSecClient('none');
    }
  }
  searchResultVisibilityForSecClient(display_mode){
  this.__secInv.nativeElement.style.display = display_mode;
  }

/** First Investor Search Bar hide show */
  outsideClickforFirstInvestor(__ev){
    if (__ev) {
      this.searchResultVisibilityForFirstClient('none');
    }
  }
  searchResultVisibilityForFirstClient(display_mode){
  this.__firstInv.nativeElement.style.display = display_mode;

  }

  /**OutSide Click For Client*/
  outsideClickforClient(__ev) {
    if (__ev) {
      this.searchResultVisibilityForClient('none');
    }
  }
  /**Search Result Off against Proposer Code */
  searchResultVisibilityForClient(display_mode) {
    this.__clientCode.nativeElement.style.display = display_mode;
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
        this.__fdTrax.controls['temp_tin_no'].setValue(__el.temp_tin_no, {
          emitEvent: false,
        });
        this.searchResultVisibility('none');
        this.getTraxDtlsAgainstTemporaryTin(__el);
        break;
      case 'E':
        this.__fdTrax.controls['euin_no'].setValue(
          __el.euin_no + ' - ' + __el.emp_name,
          { emitEvent: false }
        );
        this.searchResultVisibilityForEUIN('none');
        break;
      case 'S':
        this.__fdTrax.controls['sub_brk_cd'].setValue(__el.code, {
          emitEvent: false,
        });
        this.searchResultVisibilityForSubBrk('none');
        break;
      case 'C':
        this.__dialogDtForClient = __el;
        this.__fdTrax.controls['investor_code'].reset(__el.client_code, {
          onlySelf: true,
          emitEvent: false,
        });
        this.__fdTrax.patchValue({
          investor_name: __el.client_name,
          investor_id: __el.id,
        });
        this.searchResultVisibilityForClient('none');
        break;
        case 'SI':
          this.__fdTrax.get(['first_inv_dtls','investor_code']).reset(__el ? global.getActualVal(__el.client_code) : '',{emitEvent:false})
          this.__fdTrax.patchValue({
            first_inv_dtls: {
              id:__el ? global.getActualVal(__el.id) : '',
              investor_name:__el ?  global.getActualVal(__el.client_name): '',
              investor_pan: __el ? global.getActualVal(__el.pan): '',
              dob:__el ? global.getActualVal(__el.dob): ''
            }
           });
           this.searchResultVisibilityForFirstClient('none');
        break;
        case 'TI':
        this.__fdTrax.get(['sec_inv_dtls','investor_code']).reset(__el ? global.getActualVal(__el.client_code) : '',{emitEvent:false})
        this.__fdTrax.patchValue({
          sec_inv_dtls: {
            id:__el ? global.getActualVal(__el.id) : '',
            investor_name:__el ?  global.getActualVal(__el.client_name): '',
            investor_pan: __el ? global.getActualVal(__el.pan): '',
            dob:__el ? global.getActualVal(__el.dob): ''
          }
         });
         this.searchResultVisibilityForSecClient('none');
         break;

        case 'B':
          this.__dialogDtForBnk = __el;
          this.__fdTrax.controls['micr_code'].reset(__el.micr_code, {
            onlySelf: true,
            emitEvent: false,
          });
          this.__fdTrax.patchValue({
            bank_name: __el.bank_name,
            chq_bank: __el.id,
          });
          this.searchResultVisibilityForBank('none');
          break;
    }
  }
  getTraxDtlsAgainstTemporaryTin(__el){
    console.log(__el)
   this.__fdTrax.patchValue({
    bu_type:__el.bu_type,
    fd_bu_type_id:__el.fd_bu_type,
    comp_type_id:__el.comp_type_id,
    comp_id: __el.comp_id,
    scheme_id:__el.scheme_id,
    inv_type_id: __el.fd_bu_type,
    application_no:__el.application_no
   })
   this.__euinMst.push({euin_no:__el.euin_no,emp_name:__el.emp_name});
   this.getItems({euin_no:__el.euin_no,emp_name:__el.emp_name},'E');
   this.__clientMst.push( {
    client_code:__el.investor_code,
    client_name:__el.investor_name,
    id:__el.investor_id
  });
   this.getItems(
    {
      client_code:__el.investor_code,
      client_name:__el.investor_name,
      id:__el.investor_id
    },
    'C');

    this.__isCldtlsEmpty = false;
    if(__el.bu_type == 'B'){
      this.__subbrkArnMst.push({code:__el.sub_arn_no});
      this.getItems(
        {
          code:__el.sub_arn_no
        },
        'S');
    }

  }
  /** OutSide Click of Temporary TIN Number */
  outsideClickfortempTin(__ev) {
    if (__ev) {
      this.searchResultVisibility('none');
    }
  }
  /** Search Result Off against Temporary TIN Number */
  searchResultVisibility(display_mode) {
    if(this.__searchTempTin)
    this.__searchTempTin.nativeElement.style.display = display_mode;
  }
  /**EUIN Number OutSide Click */
  outsideClick(__ev) {
    if (__ev) {
      this.searchResultVisibility('none');
    }
  }
  /** Search Result Off against EUIN Number */
  searchResultVisibilityForEUIN(display_mode) {
    if(this.__searchRlt)
    this.__searchRlt.nativeElement.style.display = display_mode;
  }

  /**OutSide Click For SubBrk*/
  outsideClickforSubBrkArn(__ev) {
    if (__ev) {
      this.searchResultVisibilityForSubBrk('none');
    }
  }
  /** Search Result Off against Sub Broker */
  searchResultVisibilityForSubBrk(display_mode) {
    this.__subBrkArn.nativeElement.style.display = display_mode;
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

checkIfSubBrokerExist(subBrk: string): Observable<boolean> {
  return of(this.__subbrkArnMst.findIndex((x) => x.code == subBrk) != -1);
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
      DialogDtlsComponent,
      dialogConfig
    );
  } catch (ex) { }
}
checkIfclientExist(cl_code: string): Observable<boolean> {
  return of(this.__clientMst.findIndex((x) => x.client_code == cl_code) != -1);
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
/**Bank Outside Click */
outsideClickforbank(__ev) {
  if (__ev) {
    this.searchResultVisibilityForBank('none');
  }
}
 /**Search Result Off against Bank */
 searchResultVisibilityForBank(display_mode) {
  this.__searchbnk.nativeElement.style.display = display_mode;
}
getFIle(__ev) {
  this.__fdTrax
    .get('file')
    .setValidators([
      Validators.required,
      fileValidators.fileExtensionValidator(this.allowedExtensions),
      fileValidators.fileSizeValidator(__ev.files),
    ]);
  this.__fdTrax.get('file').updateValueAndValidity();
  if (this.__fdTrax.get('file').status == 'VALID' && __ev.files.length > 0) {
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
  this.__fdTrax.get(formcontrlname).patchValue(__val);
}
submitFdTrax(){
 const __fd =new FormData();

    __fd.append('tin_status',this.__fdTrax.value.tin_status);
    if(this.__fdTrax.value.tin_status == 'Y'){
      __fd.append('temp_tin_no',this.__fdTrax.value.temp_tin_no);
    }
    __fd.append('bu_type',this.__fdTrax.value.bu_type);
    __fd.append('euin_no',global.containsSpecialChars(this.__fdTrax.value.euin_no) ?
    this.__fdTrax.value.euin_no.split(' ')[0] : this.__fdTrax.value.euin_no
    );

    if(this.__fdTrax.value.bu_type == 'B'){
      __fd.append('bu_type',this.__fdTrax.value.bu_type);
    }
    __fd.append('comp_type_id',this.__fdTrax.value.comp_type_id);
    __fd.append('company_id',this.__fdTrax.value.comp_id);
    __fd.append('scheme_id',this.__fdTrax.value.scheme_id);
    __fd.append('investor_id',this.__fdTrax.value.investor_id);
    __fd.append('investor_code',this.__fdTrax.value.investor_code);
    if(this.__fdTrax.value.existing_mode_of_holding != 'S'){
      __fd.append('second_client_id',this.__fdTrax.get(['first_inv_dtls','id']).value);
      __fd.append('second_client_name',this.__fdTrax.get(['first_inv_dtls','investor_name']).value);
      __fd.append('second_client_pan',this.__fdTrax.get(['first_inv_dtls','investor_pan']).value);
      __fd.append('second_client_code',this.__fdTrax.get(['first_inv_dtls','investor_code']).value);
      __fd.append('second_client_dob',this.__fdTrax.get(['first_inv_dtls','dob']).value);
      __fd.append('second_kyc',this.__fdTrax.get(['first_inv_dtls','kyc']).value);

      __fd.append('third_client_id',this.__fdTrax.get(['sec_inv_dtls','id']).value);
      __fd.append('third_client_name',this.__fdTrax.get(['sec_inv_dtls','investor_name']).value);
      __fd.append('third_client_pan',this.__fdTrax.get(['sec_inv_dtls','investor_pan']).value);
      __fd.append('third_client_code',this.__fdTrax.get(['sec_inv_dtls','investor_code']).value);
      __fd.append('third_client_dob',this.__fdTrax.get(['sec_inv_dtls','dob']).value);
      __fd.append('third_kyc',this.__fdTrax.get(['sec_inv_dtls','kyc']).value);

    }

   __fd.append('kyc_status',this.__fdTrax.value.kyc_status);
   __fd.append('investor_kyc',this.__fdTrax.value.inv_kyc);
   __fd.append('fd_bu_type',this.__fdTrax.value.fd_bu_type_id);
   __fd.append('investment_type',this.__fdTrax.value.inv_type_id);
   __fd.append('certificate_delivery_opt',this.__fdTrax.value.certificate_delivery_opt);


    if(this.__fdTrax.value.inv_type_id == 'F'){
      __fd.append('application_no',this.__fdTrax.value.inv_type_id);
    }
    else{
      __fd.append('fdr_no',this.__fdTrax.value.fdr_no);
    }
    __fd.append('option',this.__fdTrax.value.option);
    __fd.append('sub_option',this.__fdTrax.getRawValue().sub_option);
    __fd.append('tenure_type',this.__fdTrax.value.tenure_type);
    __fd.append('tenure',this.__fdTrax.value.tenure);
    __fd.append('interest_rate',this.__fdTrax.value.int_rate);
    __fd.append('maturity_instruction',this.__fdTrax.value.mat_instr);
    __fd.append('amount',this.__fdTrax.value.amount);
    __fd.append('mode_of_payment',this.__fdTrax.value.trns_mode);
    __fd.append('chq_bank',this.__fdTrax.value.chq_bank);
    __fd.append('acc_no',this.__fdTrax.value.acc_no);
     if(this.__fdTrax.value.trns_mode == 'O'){
      __fd.append('chq_no',this.__fdTrax.value.chq_no);

     }
     else{
      __fd.append('payment_ref_no',this.__fdTrax.value.payment_ref_no);
     }
     __fd.append('mode_of_holding',this.__fdTrax.value.existing_mode_of_holding);
     __fd.append('tds_info',this.__fdTrax.value.tds_info);
     __fd.append('comp_login_at',this.__fdTrax.value.login_at);
     __fd.append('remarks',this.__fdTrax.value.remarks);
     __fd.append('app_form_scan',this.__fdTrax.value.app_form_scan);
     this.__dbIntr.api_call(1,'/fd/fdTraxCreate',__fd).subscribe((res: any) =>{
       this.__utility.showSnackbar(res.suc == 1 ? "Form Submitted Successfully": res.msg,res.suc)
      if(res.suc == 1){
        this.dialogRef.close({tin_no:res.data.temp_tin_no,data:res.data});
      }

     })
  }
  cancel(){
    this.__isThirdHolderOpen=false;
    this.getItems(null,'TI');
    this.__secInvMst.length = 0;
    this.__fdTrax.get(['sec_inv_dtls','investor_name']).removeValidators([Validators.required]);
    this.__fdTrax.get(['sec_inv_dtls','dob']).removeValidators([Validators.required]);
    this.__fdTrax.get(['sec_inv_dtls','investor_pan']).removeValidators([Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'), Validators.minLength(10), Validators.maxLength(10)]);
    this.__fdTrax.get(['sec_inv_dtls','investor_name']).updateValueAndValidity({emitEvent:false});
    this.__fdTrax.get(['sec_inv_dtls','dob']).updateValueAndValidity({emitEvent:false});
    this.__fdTrax.get(['sec_inv_dtls','investor_pan']).updateValueAndValidity({emitEvent:false});
  }
  addThirdInvestor(){
    this.__isThirdHolderOpen=!this.__isThirdHolderOpen;
    this.__fdTrax.get(['sec_inv_dtls','investor_name']).setValidators([Validators.required]);
    this.__fdTrax.get(['sec_inv_dtls','dob']).setValidators([Validators.required]);
    this.__fdTrax.get(['sec_inv_dtls','investor_pan']).setValidators([Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'),
    Validators.minLength(10),
    Validators.maxLength(10)]);
    this.__fdTrax.get(['sec_inv_dtls','investor_name']).updateValueAndValidity({emitEvent:false});
    this.__fdTrax.get(['sec_inv_dtls','dob']).updateValueAndValidity({emitEvent:false});
    this.__fdTrax.get(['sec_inv_dtls','investor_pan']).updateValueAndValidity({emitEvent:false});
  }
  cancelSecondHolder(){
    this.getItems(null,'SI');
    this.__secInvMst.length = 0;
    this.__fdTrax.get(['first_inv_dtls','investor_name']).removeValidators([Validators.required]);
    this.__fdTrax.get(['first_inv_dtls','dob']).removeValidators([Validators.required]);
    this.__fdTrax.get(['first_inv_dtls','investor_pan']).removeValidators([Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'), Validators.minLength(10), Validators.maxLength(10)]);
    this.__fdTrax.get(['first_inv_dtls','investor_name']).updateValueAndValidity({emitEvent:false});
    this.__fdTrax.get(['first_inv_dtls','dob']).updateValueAndValidity({emitEvent:false});
    this.__fdTrax.get(['first_inv_dtls','investor_pan']).updateValueAndValidity({emitEvent:false});
  }
  focus(__mode){
         var __el = this.renderer.selectRootElement('#'+__mode);
        __el.focus();
    }

}
