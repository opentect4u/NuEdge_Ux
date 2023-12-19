import { Overlay } from '@angular/cdk/overlay';
import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  pluck,
  skip,
  switchMap,
  tap,
} from 'rxjs/operators';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import buisnessType from '../../../../../../../../assets/json/buisnessType.json';
// import { CreateClientComponent } from '../../../../../shared/create-client/create-client.component';
import { PreviewdtlsDialogComponent } from 'src/app/shared/core/previewdtls-dialog/previewdtls-dialog.component';
import { CreateClientComponent } from 'src/app/shared/create-client/create-client.component';
import ClientType from '../../../../../../../../assets/json/clientTypeMenu.json';
@Component({
  selector: 'rcvModification-component',
  templateUrl: './rcvModification.component.html',
  styleUrls: ['./rcvModification.component.css'],
})
export class RcvmodificationComponent implements OnInit {
  __isClientSpinner: boolean = false;
  __isEuinSpinner: boolean = false;
  __isSubBrkArnSpinner: boolean = false;
  __isschemeSpinner: boolean = false;
  __isschemetoSpinner: boolean  =false;

  displayMode_forClient:string;
  displayMode_forScm:string;
  displayMode_forEuin: string;
  displayMode_forSub_arn_no: string;
  displayMode_forScmTo: string ;
  __trans_types: any = [];
  __isVisible: boolean = true;

  __isCldtlsEmpty: boolean = false;
  __dialogDtForClient: any;
  __dialogDtForScheme: any;
  __dialogDtForSchemeTo: any;
  __clTypeMenu = ClientType;
  __transType: any = [];
  __clientMst: any = [];
  __euinMst: any = [];
  __subbrkArnMst: any = [];
  __schemeMst: any = [];
  __schemeMstforSwitchTo: any = [];
  __buisness_type: any = buisnessType;
  __rcvForm = new FormGroup({
    sub_brk_cd: new FormControl(''),
    sub_arn_no: new FormControl(''),
    bu_type: new FormControl('', [Validators.required]),
    euin_no: new FormControl('', {
      validators: [Validators.required],
      asyncValidators: this.EUINValidators(),
    }),
    application_no: new FormControl(''),
    trans_id: new FormControl('', [Validators.required]),
    id: new FormControl(''),
    client_code: new FormControl('', {
      validators:[Validators.required],
      asyncValidators:[this.ClientValidators()]
    }),
    client_id: new FormControl('', [Validators.required]),
    client_name: new FormControl(''),
    scheme_id: new FormControl('', [Validators.required]),
    scheme_name: new FormControl('',
    {
      validators:[Validators.required],
      asyncValidators:[this.SchemeValidators()]
    }
    ),
    recv_from: new FormControl(''),
    inv_type: new FormControl('', [Validators.required]),
    kyc_status: new FormControl(''),
    switch_scheme_to: new FormControl(''),
    scheme_id_to: new FormControl(''),
    folio_no: new FormControl(''),
  });
  constructor(
    public dialogRef: MatDialogRef<RcvmodificationComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog,
    private overlay: Overlay
  ) {
    this.__utility.__isvisibleMenuIcon$.pipe(skip(1)).subscribe((res) => {
      if (this.data.id == res.id && this.data.flag == res.flag) {
        this.__isVisible = res.isVisible;
      }
    });
  }

  ngOnInit() {
    this.getTransactionTypeDtls();
    this.getTransactionType();
    if (this.data.temp_tin_no) {
      this.setRcvFormDtls();
    }
  }
  getTransactionTypeDtls() {
    this.__dbIntr
      .api_call(
        0,
        '/formreceivedshow',
        'product_id=' +
          this.data.product_id +
          '&trans_type_id=' +
          this.data.trans_type_id
      )
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.__trans_types = res;
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
  setRcvFormDtls() {
    this.__dbIntr
      .api_call(0, '/formreceived', 'temp_tin_no=' + this.data.temp_tin_no)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.__rcvForm.patchValue({
          bu_type: global.getActualVal(res[0].bu_type),
          trans_id: global.getActualVal(res[0].trans_id),
          id: res[0].id,
          scheme_id: global.getActualVal(res[0].scheme_id),
          recv_from: global.getActualVal(res[0].recv_from),
          inv_type: global.getActualVal(res[0].inv_type),
          kyc_status: global.getActualVal(res[0].kyc_status),
          product_id: global.getActualVal(res[0].product_id),
          folio_no: global.getActualVal(res[0].folio_no),
          application_no: global.getActualVal(res[0].application_no)
        });

        /** FOR BINDING EUIN */
        setTimeout(() => {
          this.__euinMst = [
            { euin_no: res[0].euin_no, emp_name: res[0].emp_name },
          ];
          this.getItems(this.__euinMst[0],'E');

          /** FOR BINDING Sub Broker */
          if(this.__rcvForm.controls['bu_type'].value == 'B'){
            this.__subbrkArnMst.push({
              arn_no:res[0].sub_arn_no,
              code:res[0].sub_brk_cd
            })
            this.getItems(this.__subbrkArnMst[0],'S')
          }
        /**End */

         /** FOR BINDING Switch Scheme */
         if(this.__rcvForm.controls['trans_id'].value == 3){
           this.__schemeMstforSwitchTo.push({
             id:res[0].scheme_id_to,
             scheme_name:res[0].scheme_name_to
           });
           this.getItems(this.__schemeMstforSwitchTo[0],'ST');
         }
         /**End */
        }, 200);

         /** END */

        /** FOR BINDING CLIENT*/
         this.__clientMst.push({
          client_code:res[0].client_code,
          id:res[0].client_id,
          client_name: res[0].client_name,
          client_type:res[0].client_type
         })
         this.getItems(this.__clientMst[0],'C')
         /** END */

        /** FOR BINDING SCHEME / SWITCH SCHEME */
        this.__schemeMst.push({id:res[0].scheme_id,scheme_name:res[0].scheme_name});
        this.getItems(this.__schemeMst[0],'SC');
        /** END */
      });
  }

  ngAfterViewInit() {
    // EUIN NUMBER SEARCH
    this.__rcvForm.controls['euin_no'].valueChanges
      .pipe(
        tap(() => (this.__isEuinSpinner = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1
            ? this.__dbIntr.searchItems(
                '/employee',
                (global.containsSpecialChars(dt) ? dt.split(' ')[0] : dt)
                +
                  (this.__rcvForm.value.bu_type == 'B' ?
                  (this.__rcvForm.controls['sub_arn_no'].value
                    ? '&sub_arn_no=' +
                      this.__rcvForm.controls['sub_arn_no'].value.split(' ')[0]
                    : '') : '')
              )
            : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__euinMst = value;
          this.searchResultVisibility('block');
          this.__isEuinSpinner = false;
        },
        complete: () =>{},
        error: (err) => {
          this.__isEuinSpinner = false;
        },
      });

    //SUB BROKER ARN SEARCH

    this.__rcvForm.controls['sub_arn_no'].valueChanges
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
          this.__isSubBrkArnSpinner = false;
          this.getItems(null, 'E');
        },
        complete: () => {},
        error: (err) => {
          this.__isSubBrkArnSpinner = false;
        },
      });

    //Client Code Search
    this.__rcvForm.controls['client_code'].valueChanges
      .pipe(
        tap(() => (this.__isClientSpinner = true)),
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
          this.__rcvForm.patchValue({
            client_id: '',
            client_name: '',
          });
          this.__isClientSpinner = false;
        },
        complete: () => {},
        error: (err) => {
          this.__isClientSpinner = false;
        },
      });

    //Scheme Search
    this.__rcvForm.controls['scheme_name'].valueChanges
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
                  (this.data.trans_type_id == '4' ? 'N' : 'O')
              )
            : []
        ),
        map((x: any) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.searchResultVisibilityForScheme('block');
          this.__dialogDtForScheme = null;
          this.__rcvForm.patchValue({ scheme_id: '' });
          this.__schemeMst = value;
          this.__isschemeSpinner = false;
        },
        complete: () => {},
        error: (err) => {
          this.__isschemeSpinner = false;
        },
      });

    //switch Scheme Search
    this.__rcvForm.controls['switch_scheme_to'].valueChanges
      .pipe(
        tap(()=> this.__isschemetoSpinner = true),
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
          this.__dialogDtForSchemeTo = null;
          this.__rcvForm.patchValue({ scheme_id_to: '' });
          this.__schemeMstforSwitchTo = value;
          this.searchResultVisibilityForSchemeSwicthTo('block');
          this.__isschemetoSpinner = false;
        },
        complete: () => {},
        error: (err) => {this.__isschemetoSpinner = false;}
      });

    //On Change on buisness type
    this.__rcvForm.controls['bu_type'].valueChanges.subscribe((res) => {
      this.__rcvForm.controls['sub_arn_no'].setValue('', {
        onlySelf: true,
        emitEvent: false,
      });
      this.__rcvForm.controls['euin_no'].setValue('', {
        onlySelf: true,
        emitEvent: false,
      });
      this.__rcvForm.controls['sub_brk_cd'].setValue('', {
        onlySelf: true,
        emitEvent: false,
      });

      if(res == 'B'){
        this.__rcvForm.controls['sub_arn_no'].setValidators([Validators.required]);
        this.__rcvForm.controls['sub_arn_no'].setAsyncValidators([this.SubBrokerValidators()]);
        this.__rcvForm.controls['sub_brk_cd'].setValidators([Validators.required]);
      }
      else{
        this.__rcvForm.controls['sub_arn_no'].removeValidators([Validators.required]);
        this.__rcvForm.controls['sub_arn_no'].removeAsyncValidators([this.SubBrokerValidators()]);
        this.__rcvForm.controls['sub_brk_cd'].removeValidators([Validators.required]);
      }
      this.__rcvForm.controls['sub_arn_no'].updateValueAndValidity({emitEvent:false});
      this.__rcvForm.controls['sub_brk_cd'].updateValueAndValidity({emitEvent:false});

    });

    this.__rcvForm.controls['inv_type'].valueChanges.subscribe((res) => {
      if (res == 'A') {
        this.__rcvForm.controls['folio_no'].setValidators([
          Validators.required,
        ]);
        this.__rcvForm.controls['folio_no'].updateValueAndValidity();
      } else {
        this.__rcvForm.controls['folio_no'].removeValidators([
          Validators.required,
        ]);
        this.__rcvForm.controls['folio_no'].updateValueAndValidity();
      }
    });

    //trans_id change
    this.__rcvForm.controls['trans_id'].valueChanges.subscribe((res) => {
      if (res == '3') {
        this.__rcvForm.controls['scheme_id_to'].setValidators([
          Validators.required,
        ]);
        this.__rcvForm.controls['switch_scheme_to'].setValidators([
          Validators.required,
        ]);
        this.__rcvForm.controls['switch_scheme_to'].setAsyncValidators([
           this.SchemeToValidators()
        ]);
      } else {
        this.__rcvForm.controls['scheme_id_to'].removeValidators([
          Validators.required,
        ]);
        this.__rcvForm.controls['switch_scheme_to'].removeValidators([
          Validators.required,
        ]);
        this.__rcvForm.controls['switch_scheme_to'].removeAsyncValidators([this.SchemeToValidators()]);
      }
      this.__rcvForm.controls['scheme_id_to'].updateValueAndValidity({emitEvent:false});
      this.__rcvForm.controls['switch_scheme_to'].updateValueAndValidity({emitEvent:false});
    });
  }
  searchResultVisibility(display_mode) {
    // this.__searchRlt.nativeElement.style.display = display_mode;
    this.displayMode_forEuin = display_mode;
  }
  searchResultVisibilityForSubBrkArn(display_mode) {
    // this.__subBrkArn.nativeElement.style.display = display_mode;
    this.displayMode_forSub_arn_no = display_mode;
  }
  searchResultVisibilityForClient(display_mode) {
    // this.__clientCode.nativeElement.style.display = display_mode;
    this.displayMode_forClient = display_mode;
  }
  searchResultVisibilityForScheme(display_mode) {
    // this.__scheme.nativeElement.style.display = display_mode;
    this.displayMode_forScm = display_mode;
  }
  searchResultVisibilityForSchemeSwicthTo(display_mode) {
    // this.__scheme_swicth_to.nativeElement.style.display = display_mode;
    this.displayMode_forScmTo = display_mode;
  }
  getItems(__euinDtls, __type) {
    switch (__type) {
      case 'E':
        this.__rcvForm.controls['euin_no'].setValue(
          __euinDtls ? __euinDtls.euin_no + ' - ' + __euinDtls.emp_name : '',
          { emitEvent: false }
        );
        this.searchResultVisibility('none');
        break;
      case 'S':
        this.__rcvForm.controls['sub_arn_no'].setValue(__euinDtls.arn_no, {
          emitEvent: false,
        });
        this.__rcvForm.controls['sub_brk_cd'].setValue(__euinDtls.code);
        this.searchResultVisibilityForSubBrkArn('none');
        break;

      case 'C':
        this.__dialogDtForClient = __euinDtls;
        this.__rcvForm.controls['client_code'].reset(__euinDtls.client_code, {
          onlySelf: true,
          emitEvent: false,
        });
        this.__rcvForm.patchValue({
          client_name: __euinDtls.client_name,
          client_id: __euinDtls.id,
        });
        this.searchResultVisibilityForClient('none');
        break;

      case 'SC':
        this.__dialogDtForScheme = __euinDtls;
        this.__rcvForm.controls['scheme_name'].setValue(__euinDtls.scheme_name, {
          emitEvent: false,
        });
        this.__rcvForm.patchValue({ scheme_id: __euinDtls.id });
        this.searchResultVisibilityForScheme('none');
        break;

      case 'ST':
        this.__dialogDtForSchemeTo = __euinDtls;
        this.__rcvForm.controls['switch_scheme_to'].reset(
          __euinDtls.scheme_name,
          { onlySelf: true, emitEvent: false }
        );
        this.__rcvForm.patchValue({ scheme_id_to: __euinDtls.id });
        this.searchResultVisibilityForSchemeSwicthTo('none');
        break;

      default:
        break;
    }
  }

  outsideClickForSchemeSwitchTo(__ev) {
    if (__ev) {
      this.searchResultVisibilityForSchemeSwicthTo('none');
    }
  }

  recieveForm() {
    if (this.__rcvForm.invalid) {
      this.__utility.showSnackbar(
        'Forms can not be submitted, please try again later',
        0
      );
      return;
    }
    const __rcvForm = new FormData();
    __rcvForm.append('bu_type', this.__rcvForm.value.bu_type);
    __rcvForm.append(
      'euin_no',
      this.__rcvForm.value.euin_no.includes(' ')
        ? this.__rcvForm.value.euin_no.split(' ')[0]
        : this.__rcvForm.value.euin_no
    );
    __rcvForm.append(
      'sub_arn_no',
      this.__rcvForm.value.sub_arn_no ? this.__rcvForm.value.sub_arn_no : ''
    );
    __rcvForm.append(
      'sub_brk_cd',
      this.__rcvForm.value.sub_brk_cd ? this.__rcvForm.value.sub_brk_cd : ''
    );
    __rcvForm.append('client_id', this.__rcvForm.value.client_id);
    __rcvForm.append('product_id', this.data.product_id);
    __rcvForm.append('trans_id', this.__rcvForm.value.trans_id);
    __rcvForm.append('scheme_id', this.__rcvForm.value.scheme_id);
    __rcvForm.append('recv_from', this.__rcvForm.value.recv_from);
    __rcvForm.append('inv_type', this.__rcvForm.value.inv_type);


    __rcvForm.append('kyc_status', this.__rcvForm.value.kyc_status);
    __rcvForm.append('id', this.__rcvForm.value.id);
    if(this.__rcvForm.value.inv_type == 'A'){
      __rcvForm.append(
        'folio_no',
        this.__rcvForm.value.folio_no ? this.__rcvForm.value.folio_no : ''
      );
    }
    else{
      __rcvForm.append(
        'application_no',
        this.__rcvForm.value.application_no
          ? this.__rcvForm.value.application_no
          : ''
      );
    }
    __rcvForm.append(
      'temp_tin_no',
      this.data.temp_tin_no
        ? atob(this.data.temp_tin_no)
        : this.data.temp_tin_no
    );
    if (this.__rcvForm.value.trans_id == 3) {
      __rcvForm.append(
        'scheme_id_to',
        this.__rcvForm.get('scheme_id_to').value
      );
    }
    this.__dbIntr
      .api_call(
        1,
        this.data.temp_tin_no ? '/formreceivedEdit' : '/formreceivedAdd',
        __rcvForm
      )
      .subscribe((res: any) => {
        if (this.data.temp_tin_no) {
          this.__utility.showSnackbar(
            res.suc == 1
              ? 'Form with temporary TIN ' +
                  res.data.temp_tin_no +
                  ' has been updated successfully'
              : 'Something went wrong! Plase try again later ',
            res.suc
          );
        } else {
          this.__utility.showSnackbar(
            res.suc == 1
              ? 'Form with temporary TIN ' +
                  res.data.temp_tin_no +
                  ' has been received successfully'
              : 'Something went wrong! Plase try again later ',
            res.suc
          );
          this.dialogRef.close({
            trans_id:
              this.__rcvForm.value.trans_id == 1
                ? 0
                : this.__rcvForm.value.trans_id == 2
                ? 1
                : 2,
          });
        }
        // this.settransTypeCount(this.__rcvForm.value.trans_id == 1 ? 0 : (this.__rcvForm.value.trans_id == 2 ? 1 : 2));

        // this.__rcvForm.reset();
      });
  }
  openDialog(__type) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    // dialogConfig.disableClose = true;
    // dialogConfig.hasBackdrop = false;
    dialogConfig.width = __type == 'C' ? '100%' : '50%';
    if (__type == 'C') {
      dialogConfig.panelClass = 'fullscreen-dialog';
    }
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: __type,
      title:
        __type == 'C'
          ? this.__dialogDtForClient.client_name
          : __type == 'ST'
          ? this.__dialogDtForSchemeTo.scheme_name
          : this.__dialogDtForScheme.scheme_name,
      dt:
        __type == 'C'
          ? this.__dialogDtForClient
          : __type == 'ST'
          ? this.__dialogDtForSchemeTo
          : this.__dialogDtForScheme,
    };
    try {
      const dialogref = this.__dialog.open(PreviewdtlsDialogComponent, dialogConfig);
    } catch (ex) {}
  }
  navigateTo(menu) {
    this.openDialogforClient(menu);
  }
  openDialogforClient(__menu) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.disableClose = false;
    dialogConfig.hasBackdrop = false;
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
          this.__clientMst.push(dt.data);
          this.__isCldtlsEmpty = false;
          this.getItems(dt.data, 'C');
        }
      });
    } catch (ex) {}
  }
  // navigateTODashboard(__type_id){
  //   this.__utility.navigatewithqueryparams('main/rcvForm',{queryParams:{
  //     product_id: this.data.product_id,
  //     type_id: this.data.trans_type_id,
  //      trans_id: btoa(__type_id)
  //   }})
  // }
  // settransTypeCount(__index) {
  //   this.__trans_types[__index].count = this.__trans_types[__index].count + 1
  // }
  minimize() {
    this.dialogRef.updateSize('40%', '45px');
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

  checkIfclientExist(cl_code: string): Observable<boolean> {
    return of(this.__clientMst.findIndex((x) => (x.client_code == cl_code)) != -1);
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

  checkIfscmExist(scm_name: string): Observable<boolean> {
    return of(this.__schemeMst.findIndex((x) => (x.scheme_name == scm_name)) != -1);
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

  checkIfscmToExist(scm_name: string): Observable<boolean> {
    return of(this.__schemeMstforSwitchTo.findIndex((x) => (x.scheme_name == scm_name)) != -1);
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
  getSelectedItemsFromParent(event){
    this.getItems(event.item,event.flag);
  }
}
