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
import {
  debounceTime,
  distinctUntilChanged,
  map,
  pluck,
  switchMap,
  tap,
} from 'rxjs/operators';
import { responseDT } from 'src/app/__Model/__responseDT';
import { scheme } from 'src/app/__Model/__schemeMst';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import buisnessType from '../../../../../../../../assets/json/buisnessType.json';
import kycModification from '../../../../../../../../assets/json/kycModificatiotype.json';
import kycFresh from '../../../../../../../../assets/json/kycFresh.json';
import { global } from 'src/app/__Utility/globalFunc';
import { Observable, of } from 'rxjs';
import { PreviewdtlsDialogComponent } from 'src/app/shared/core/previewdtls-dialog/previewdtls-dialog.component';
import { CreateClientComponent } from 'src/app/shared/create-client/create-client.component';
import ClientType from '../../../../../../../../assets/json/clientTypeMenu.json';

@Component({
  selector: 'rcvFrmModificationForNonFin-component',
  templateUrl: './rcvFrmModificationForNonFin.component.html',
  styleUrls: ['./rcvFrmModificationForNonFin.component.css'],
})
export class RcvfrmmodificationfornonfinComponent implements OnInit {
  @ViewChild('schemeResForNonFin') __schemeResForNonFin: ElementRef;

  displayMode_forSub_arn_no: string;
  displayMode_forEuin: string;
  displayMode_forClient: string;
  displayMode_forScm: string;
  __clTypeMenu = ClientType;

  // __mcOptionMenu: any = [
  //   { flag: 'M', name: 'Minor', icon: 'person_pin' },
  //   { flag: 'P', name: 'Pan Holder', icon: 'credit_card' },
  //   { flag: 'N', name: 'Non Pan Holder', icon: 'credit_card_off' },
  // ];
  __isEuinNumberVisible: boolean = false;
  __issubBrkArnVisible: boolean = false;
  __isclientVisible: boolean = false;
  __isschemeVisible: boolean = false;
  __kycModification = kycModification;
  __kycFresh = kycFresh;
  __transType: any = [];
  __dialogDtForSchemeTo: any;
  __dialogDtForScheme: any;
  __clientMst:any = [];
  __buisness_type: any = buisnessType;
  __euinMst: any = [];
  __isCldtlsEmpty: boolean = false;
  __dialogDtForClient: any;
  __schemeMst: scheme[] = [];
  __subbrkArnMst: any = [];
  __isVisible: boolean = true;
  __rcvFormForNonFin = new FormGroup({
    id: new FormControl(this.data.id),
    sub_brk_cd: new FormControl(''),
    sub_arn_no: new FormControl(''),
    bu_type: new FormControl(this.data.data ? this.data.data.bu_type : '', [Validators.required]),
    euin_no: new FormControl('',
    {
      validators:[Validators.required],
      asyncValidators:[this.EUINValidators()]
    }
    ),
    client_code: new FormControl('', {
      validators:[Validators.required],
      asyncValidators:[this.ClientValidators()]
    }),
    client_id: new FormControl('', [Validators.required]),
    client_name: new FormControl(''),
    trans_id: new FormControl('', [Validators.required]),
    folio_number: new FormControl('', [Validators.required]),
    scheme_id: new FormControl('', [Validators.required]),
    scheme_name: new FormControl('', {
      validators:[Validators.required],
      asyncValidators:[this.SchemeValidators()]
    }),
    kyc_modification: new FormControl(''),
    existing_kyc_status: new FormControl(''),
    recv_from: new FormControl(''),
  });
  constructor(
    public dialogRef: MatDialogRef<RcvfrmmodificationfornonfinComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog,
    private overlay: Overlay
  ) {
    console.log(this.data);
  }

  ngOnInit() {
    this.getTransactionType();
    setTimeout(() => {
      if(this.data.temp_tin_no){
        this.setFormControl();
      }
    }, 500);
  }
  setFormControl(){
      this.__rcvFormForNonFin.patchValue({
        folio_number: this.data.data.folio_no ? this.data.data.folio_no : '',
        recv_from:this.data.data.recv_from ? this.data.data.recv_from : '',
        trans_id: this.data.data.trans_id ? this.data.data.trans_id : ''
      });



      /** CLIENT BINDING */
      this.__clientMst.push({
        client_name:this.data.data.client_name,
        client_code: this.data.data.client_code,
        id:this.data.data.client_id
      })

      this.getItems(this.__clientMst[0],'C');
     /** END */

      /** EUIN BINDING */
      this.__euinMst.push(
        {
          euin_no:this.data.data.euin_no,
          emp_name:this.data.data.emp_name
        }
      )
      this.getItems(this.__euinMst[0],'E');
      /** END */

      /** Sub Broker Binding */
      if(this.data.data.bu_type == 'B'){
        this.__subbrkArnMst.push({
          arn_no: this.data.data.sub_arn_no,
          code:this.data.data.sub_brk_cd
       })
        this.getItems(
         this.__subbrkArnMst[0],
          'S'
        )
      }
      /** END */
      /** Scheme Binding */
      this.__schemeMst.push({scheme_name:this.data.data.scheme_name,id:this.data.data.scheme_id})
      this.getItems(
        {
          scheme_name: this.data.data.scheme_name,
          id: this.data.data.scheme_id
        },
        'SC'
      );
  }
  ngAfterViewInit() {
    this.__rcvFormForNonFin.controls['bu_type'].valueChanges.subscribe(
      (res) => {
        this.__rcvFormForNonFin.controls['sub_arn_no'].setValue('', {
          onlySelf: true,
          emitEvent: false,
        });
        this.__rcvFormForNonFin.controls['euin_no'].setValue('', {
          onlySelf: true,
          emitEvent: false,
        });
        this.__rcvFormForNonFin.controls['sub_brk_cd'].setValue('', {
          onlySelf: true,
          emitEvent: false,
        });

        if(res == 'B'){
          this.__rcvFormForNonFin.controls['sub_arn_no'].setValidators([Validators.required]);
          this.__rcvFormForNonFin.controls['sub_arn_no'].setAsyncValidators([this.SubBrokerValidators()]);
          this.__rcvFormForNonFin.controls['sub_brk_cd'].setValidators([Validators.required]);
        }
        else{
          this.__rcvFormForNonFin.controls['sub_arn_no'].removeValidators([Validators.required]);
          this.__rcvFormForNonFin.controls['sub_arn_no'].removeAsyncValidators([this.SubBrokerValidators()]);
          this.__rcvFormForNonFin.controls['sub_brk_cd'].removeValidators([Validators.required]);
        }
        this.__rcvFormForNonFin.controls['sub_arn_no'].updateValueAndValidity({emitEvent:false});
      }
    );

    //SUB BROKER ARN SEARCH
    this.__rcvFormForNonFin.controls['sub_arn_no'].valueChanges
      .pipe(
        tap(() => (this.__issubBrkArnVisible = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.searchItems('/showsubbroker', dt) : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe({
        next: (value) => {
          console.log(value);
          this.__subbrkArnMst = value;
          this.searchResultVisibilityForSubBrkArn('block');
          this.__issubBrkArnVisible = false;
        },
        complete: () => console.log(''),
        error: (err) => console.log(),
      });
    // EUIN NUMBER SEARCH
    this.__rcvFormForNonFin.controls['euin_no'].valueChanges
      .pipe(
        tap(() => (this.__isEuinNumberVisible = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1
            ? this.__dbIntr.searchItems(
                '/employee',
                dt +
                  (this.__rcvFormForNonFin.controls['sub_arn_no'].value
                    ? '&sub_arn_no=' +
                      this.__rcvFormForNonFin.controls[
                        'sub_arn_no'
                      ].value.split(' ')[0]
                    : '')
              )
            : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__euinMst = value;
          this.searchResultVisibility('block');
          this.__isEuinNumberVisible = false;
        },
        complete: () => console.log(''),
        error: (err) => console.log(),
      });

    //Client Code Search
    this.__rcvFormForNonFin.controls['client_code'].valueChanges
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
          this.__isclientVisible = false;
          this.__rcvFormForNonFin.patchValue({
            client_id: '',
            client_name: '',
          });
        },
        complete: () => console.log(''),
        error: (err) => console.log(),
      });

    //Scheme Search
    this.__rcvFormForNonFin.controls['scheme_name'].valueChanges
      .pipe(
        tap(() => (this.__isschemeVisible = true)),
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
          this.__dialogDtForScheme = null;
          this.__rcvFormForNonFin.patchValue({ scheme_id: '' });
          this.__schemeMst = value;
          this.searchResultVisibilityForScheme('block');
          this.__isschemeVisible = false;
        },
        complete: () => console.log(''),
        error: (err) => console.log(),
      });

    //Transaction Search
    this.__rcvFormForNonFin.controls['trans_id'].valueChanges.subscribe(
      (res) => {
        console.log(res);
        this.__rcvFormForNonFin.controls['scheme_id'].setValidators(
          res != '12' && res != '13' ? [Validators.required] : null
        );
        this.__rcvFormForNonFin.controls['scheme_name'].setValidators(
          res != '12' && res != '13' ? [Validators.required] : null
        );
        this.__rcvFormForNonFin.controls['folio_number'].setValidators(
          res != '12' && res != '13' ? [Validators.required] : null
        );
        this.__rcvFormForNonFin.controls['kyc_modification'].setValidators(
          res == '12' ? [Validators.required] : null
        );
        this.__rcvFormForNonFin.controls['existing_kyc_status'].setValidators(
          res == '13' ? [Validators.required] : null
        );
        this.__rcvFormForNonFin.controls[
          'kyc_modification'
        ].updateValueAndValidity();
        this.__rcvFormForNonFin.controls[
          'existing_kyc_status'
        ].updateValueAndValidity();
        this.__rcvFormForNonFin.controls['scheme_name'].updateValueAndValidity({
          onlySelf: true,
          emitEvent: false,
        });
        this.__rcvFormForNonFin.controls['scheme_id'].updateValueAndValidity();
        this.__rcvFormForNonFin.controls[
          'folio_number'
        ].updateValueAndValidity();
        console.log(this.__rcvFormForNonFin.controls['scheme_id'].value);

        console.log(
          this.__rcvFormForNonFin.controls['scheme_id'].status,
          this.__rcvFormForNonFin.controls['scheme_name'].status,
          this.__rcvFormForNonFin.controls['folio_number'].status,
          this.__rcvFormForNonFin.controls['kyc_modification'].status,
          this.__rcvFormForNonFin.controls['existing_kyc_status'].status
        );
      }
    );
  }
  getTransactionType() {
    console.log('aas');

    this.__dbIntr
      .api_call(0, '/showTrans', 'trans_type_id=' + this.data.trans_type_id)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        console.log(res);
        this.__transType = res;
      });
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
  recieveForm() {
    const __rcvFormForNonFin = new FormData();
    __rcvFormForNonFin.append('bu_type', this.__rcvFormForNonFin.value.bu_type);
    __rcvFormForNonFin.append(
      'euin_no',
      this.__rcvFormForNonFin.value.euin_no.split(' ')[0]
    );
    __rcvFormForNonFin.append(
      'sub_arn_no',
      this.__rcvFormForNonFin.value.sub_arn_no
        ? this.__rcvFormForNonFin.value.sub_arn_no
        : ''
    );
    __rcvFormForNonFin.append(
      'sub_brk_cd',
      this.__rcvFormForNonFin.value.sub_brk_cd
        ? this.__rcvFormForNonFin.value.sub_brk_cd
        : ''
    );
    __rcvFormForNonFin.append(
      'client_id',
      this.__rcvFormForNonFin.value.client_id
    );
    __rcvFormForNonFin.append('product_id', this.data.product_id);
    __rcvFormForNonFin.append(
      'trans_id',
      this.__rcvFormForNonFin.value.trans_id
    );
    __rcvFormForNonFin.append(
      'scheme_id',
      this.__rcvFormForNonFin.value.trans_id != '12' &&
        this.__rcvFormForNonFin.value.trans_id != '13'
        ? this.__rcvFormForNonFin.value.scheme_id
        : ''
    );
    __rcvFormForNonFin.append(
      'folio_no',
      this.__rcvFormForNonFin.value.trans_id != '12' &&
        this.__rcvFormForNonFin.value.trans_id != '13'
        ? this.__rcvFormForNonFin.value.folio_number
        : ''
    );
    __rcvFormForNonFin.append(
      'recv_from',
      this.__rcvFormForNonFin.value.recv_from
    );
    if (this.__rcvFormForNonFin.value.trans_id == '13') {
      __rcvFormForNonFin.append(
        'existing_kyc_status',
        this.__rcvFormForNonFin.value.existing_kyc_status
      );
    } else if (this.__rcvFormForNonFin.value.trans_id == '12') {
      __rcvFormForNonFin.append(
        'kyc_modification',
        this.__rcvFormForNonFin.value.kyc_modification
      );
    }
    __rcvFormForNonFin.append('id', this.__rcvFormForNonFin.value.id);
    this.__dbIntr
      .api_call(
        1,
        this.data.temp_tin_no ? '/formreceivedEdit' : '/formreceivedAdd',
        __rcvFormForNonFin
      )
      .subscribe((res: any) => {
        if (this.data.temp_tin_no) {
          this.__utility.showSnackbar(
            res.suc == 1
              ? 'Form with temporary TIN  ' +
                  res.data.temp_tin_no +
                  ' has been updated successfully'
              : 'Something went wrong! Plase try again later ',
            res.suc
          );
        } else {
          this.__utility.showSnackbar(
            res.suc == 1
              ? 'Form with temporary TIN  ' +
                  res.data.temp_tin_no +
                  ' has been received successfully'
              : 'Something went wrong! Plase try again later ',
            res.suc
          );
          this.dialogRef.close({
            trans_id:
              this.__rcvFormForNonFin.value.trans_id == 1
                ? 0
                : this.__rcvFormForNonFin.value.trans_id == 2
                ? 1
                : 2,
          });
        }
      });
  }

  searchResultVisibilityForScheme(display_mode) {
    this.displayMode_forScm = display_mode;
  }
  searchResultVisibilityForClient(display_mode) {
    this.displayMode_forClient = display_mode;
  }
  searchResultVisibilityForSubBrkArn(display_mode) {
    this.displayMode_forSub_arn_no = display_mode;
  }
  searchResultVisibility(display_mode) {
    this.displayMode_forEuin = display_mode;
  }
  getItems(__euinDtls, __mode) {
    console.log(__euinDtls);

    switch (__mode) {
      case 'S':
        this.__rcvFormForNonFin.controls['sub_arn_no'].reset(
          __euinDtls.arn_no,
          { onlySelf: true, emitEvent: false }
        );
        this.__rcvFormForNonFin.controls['sub_brk_cd'].setValue(
          __euinDtls.code
        );
        this.searchResultVisibilityForSubBrkArn('none');
        break;
      case 'E':
        this.__rcvFormForNonFin.controls['euin_no'].reset(
          __euinDtls.euin_no + ' - ' + __euinDtls.emp_name,
          { onlySelf: true, emitEvent: false }
        );
        this.searchResultVisibility('none');
        break;
      case 'C':
        this.__dialogDtForClient = __euinDtls;
        this.__rcvFormForNonFin.controls['client_code'].reset(
          __euinDtls.client_code,
          { onlySelf: true, emitEvent: false }
        );
        this.__rcvFormForNonFin.patchValue({
          client_name: __euinDtls.client_name,
          client_id: __euinDtls.id,
        });
        this.searchResultVisibilityForClient('none');
        break;
      case 'SC':
        this.__dialogDtForScheme = __euinDtls;
        this.__rcvFormForNonFin.controls['scheme_name'].reset(
          __euinDtls.scheme_name,
          { onlySelf: true, emitEvent: false }
        );
        this.__rcvFormForNonFin.patchValue({ scheme_id: __euinDtls.id });
        this.searchResultVisibilityForScheme('none');
        break;
      default:
        break;
    }
  }
  navigateTo(menu) {
    this.openDialogforClient(menu);
  }
  openDialogforClient(__menu) {
    console.log(__menu);

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
        console.log(dt);
        if (dt) {
          this.__clientMst.push(dt.data);
          this.__isCldtlsEmpty = false;
          this.getItems(dt.data, 'C');
        }
      });
    } catch (ex) {}
  }
  openDialog(__type) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
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
  getSelectedItemsFromParent(event){
    this.getItems(event.item,event.flag);
  }
}
