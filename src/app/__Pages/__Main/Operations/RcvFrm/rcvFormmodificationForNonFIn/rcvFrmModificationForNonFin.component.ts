import { Overlay } from '@angular/cdk/overlay';
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { scheme } from 'src/app/__Model/__schemeMst';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import buisnessType from '../../../../../../assets/json/buisnessType.json';
import { createClientComponent } from '../createClient/createClient.component';
import { DialogDtlsComponent } from '../dialogDtls/dialogDtls.component';
import kycModification from '../../../../../../assets/json/kycModificatiotype.json';
import kycFresh from '../../../../../../assets/json/kycFresh.json';

@Component({
  selector: 'rcvFrmModificationForNonFin-component',
  templateUrl: './rcvFrmModificationForNonFin.component.html',
  styleUrls: ['./rcvFrmModificationForNonFin.component.css'],
})
export class RcvfrmmodificationfornonfinComponent implements OnInit {
  @ViewChild('subBrkArnFornonFin') subBrkArnFornonFin: ElementRef;
  @ViewChild('searchResultforEuin') searchResultforEuin: ElementRef;
  @ViewChild('clientCdFornonFin') __clientCode: ElementRef;
  @ViewChild('schemeResForNonFin') __schemeResForNonFin: ElementRef;

  __mcOptionMenu: any = [
    { flag: 'M', name: 'Minor', icon: 'person_pin' },
    { flag: 'P', name: 'Pan Holder', icon: 'credit_card' },
    { flag: 'N', name: 'Non Pan Holder', icon: 'credit_card_off' },
  ];
  __isEuinNumberVisible: boolean = false;
  __issubBrkArnVisible: boolean = false;
  __isclientVisible: boolean = false;
  __isschemeVisible: boolean = false;
  __kycModification = kycModification;
  __kycFresh = kycFresh;
  __transType: any = [];
  __dialogDtForSchemeTo: any;
  __dialogDtForScheme: any;
  __clientMst: client[] = [];
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
    euin_no: new FormControl('', [Validators.required]),
    client_code: new FormControl('', [Validators.required]),
    client_id: new FormControl('', [Validators.required]),
    client_name: new FormControl(''),
    trans_id: new FormControl('', [Validators.required]),
    folio_number: new FormControl('', [Validators.required]),
    scheme_id: new FormControl('', [Validators.required]),
    scheme_name: new FormControl('', [Validators.required]),
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
    this.setFormControl();
    }, 500);
  }
  setFormControl(){
      this.__rcvFormForNonFin.patchValue({
        folio_number: this.data.data.folio_no ? this.data.data.folio_no : '',
        recv_from:this.data.data.recv_from ? this.data.data.recv_from : '',
        trans_id: this.data.data.trans_id ? this.data.data.trans_id : ''
      });
      this.getItems(
        {
          client_name:this.data.data.client_name,
          client_code: this.data.data.client_code,
          id:this.data.data.client_id
        },
        'C'
      );
      this.__rcvFormForNonFin.controls['euin_no'].setValue(this.data.data.euin_no+ ' - '+ this.data.data.emp_name,{emitEvent:false});
      if(this.data.data.bu_type == 'B'){
        this.getItems(
          {
             arn_no: this.data.data.sub_arn_no,
             code:this.data.data.sub_brk_cd
          },
          'S'
        )
      }

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
        this.__rcvFormForNonFin.controls['sub_brk_cd'].setValidators(
          res == 'B' ? [Validators.required] : null
        );
        this.__rcvFormForNonFin.controls['sub_arn_no'].setValidators(
          res == 'B' ? [Validators.required] : null
        );
        this.__rcvFormForNonFin.controls['sub_brk_cd'].updateValueAndValidity();
        this.__rcvFormForNonFin.controls['sub_arn_no'].updateValueAndValidity();
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
              ? 'Form with temporary TIN number ' +
                  res.data.temp_tin_no +
                  ' has been updated successfully'
              : 'Something went wrong! Plase try again later ',
            res.suc
          );
        } else {
          this.__utility.showSnackbar(
            res.suc == 1
              ? 'Form with temporary TIN number ' +
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
        // this.settransTypeCount(this.__rcvForm.value.trans_id == 1 ? 0 : (this.__rcvForm.value.trans_id == 2 ? 1 : 2));

        this.__rcvFormForNonFin.reset();
      });
  }
  outsideClickforSubBrkArn(__ev) {
    this.__issubBrkArnVisible = false;
    if (__ev) {
      this.searchResultVisibilityForSubBrkArn('none');
    }
  }
  outsideClick(__ev) {
    this.__isEuinNumberVisible = false;
    if (__ev) {
      this.searchResultVisibility('none');
    }
  }
  outsideClickforScheme(__ev) {
    this.__isschemeVisible = false;
    if (__ev) {
      this.searchResultVisibilityForScheme('none');
    }
  }
  searchResultVisibilityForScheme(display_mode) {
    this.__schemeResForNonFin.nativeElement.style.display = display_mode;
  }
  outsideClickforClient(__ev) {
    this.__isclientVisible = false;
    if (__ev) {
      this.searchResultVisibilityForClient('none');
    }
  }
  searchResultVisibilityForClient(display_mode) {
    this.__clientCode.nativeElement.style.display = display_mode;
  }
  searchResultVisibilityForSubBrkArn(display_mode) {
    this.subBrkArnFornonFin.nativeElement.style.display = display_mode;
  }
  searchResultVisibility(display_mode) {
    this.searchResultforEuin.nativeElement.style.display = display_mode;
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
      const dialogref = this.__dialog.open(createClientComponent, dialogConfig);
      dialogref.afterClosed().subscribe((dt) => {
        console.log(dt);
        if (dt) {
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
      const dialogref = this.__dialog.open(DialogDtlsComponent, dialogConfig);
    } catch (ex) {}
  }
}
