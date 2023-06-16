import { Overlay } from '@angular/cdk/overlay';
import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  QueryList,
  ViewChildren,
  ViewChild,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { JsonExporterService } from 'mat-table-exporter';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  pluck,
  switchMap,
  tap,
} from 'rxjs/operators';
import { rnt } from 'src/app/__Model/Rnt';
import { category } from 'src/app/__Model/__category';
import { responseDT } from 'src/app/__Model/__responseDT';
import { subcat } from 'src/app/__Model/__subcategory';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import buType from '../../../../../../../../../../assets/json/buisnessType.json';
import { dates } from 'src/app/__Utility/disabledt';
import { global } from 'src/app/__Utility/globalFunc';
import { ManualUpdateEntryForMFComponent } from 'src/app/shared/manual-update-entry-for-mf/manual-update-entry-for-mf.component';
import { client } from 'src/app/__Model/__clientMst';
import { amc } from 'src/app/__Model/amc';

@Component({
  selector: 'app-rpt',
  templateUrl: './rpt.component.html',
  styleUrls: ['./rpt.component.css'],
})
export class RPTComponent implements OnInit {
  @ViewChildren('buTypeChecked') private __buTypeChecked: QueryList<ElementRef>;
  @ViewChildren('trnsTypeChecked')
  private __trnsTypeChecked: QueryList<ElementRef>;
  @ViewChildren('rntChecked') private __rntChecked: QueryList<ElementRef>;

  @ViewChild('searchTin') __searchTin: ElementRef;
  @ViewChild('clientCd') __clientCode: ElementRef;
  @ViewChild('searchEUIN') __searchRlt: ElementRef;
  @ViewChild('subBrkArn') __subBrkArn: ElementRef;
  @ViewChild('searchAMC') __AmcSearch: ElementRef;

  __isTinspinner: boolean = false;
  __isClientPending: boolean = false;
  __isSubArnPending: boolean = false;
  __isEuinPending: boolean = false;
  __isAmcPending: boolean = false;

  tinMst: any = [];
  __clientMst: client[] = [];
  __subbrkArnMst: any = [];
  __euinMst: any = [];
  amcMst: amc[] = [];

  __sortAscOrDsc: any = { active: '', direction: 'asc' };
  WindowObject: any;
  divToPrint: any;
  toppings = new FormControl();
  toppingList: any = [
    { id: 'edit', text: 'Edit' },
    { id: 'sl_no', text: 'Sl No' },
    { id: 'temp_tin_no', text: 'TIN Number' },
    { id: 'rnt_name', text: 'R&T' },
    { id: 'bu_type', text: 'Buisness Type' },
    { id: 'arn_no', text: 'ARN Number' },
    { id: 'euin_no', text: 'EUIN' },
    { id: 'first_client_name', text: 'First Client Name' },
    { id: 'first_client_code', text: 'First Client Code' },
    { id: 'first_client_pan', text: 'First Client Pan' },
    { id: 'mode_of_holding', text: 'Mode Of Holding' },
    { id: 'second_client_name', text: 'Second Client Name' },
    { id: 'second_client_code', text: 'Second Client Code' },
    { id: 'second_client_pan', text: 'Second Client Pan' },
    { id: 'third_client_name', text: 'Third Client Name' },
    { id: 'third_client_code', text: 'Third Client Code' },
    { id: 'third_client_pan', text: 'Third Client Pan' },
    { id: 'transaction', text: 'Transaction' },
    { id: 'scheme_name', text: 'Scheme Name' },
    { id: 'plan', text: 'Plan' },
    { id: 'option', text: 'Option' },
    { id: 'amount', text: 'Amount' },
    { id: 'chq', text: 'Chqeue Number' },
    { id: 'bank', text: 'Bank' },
    { id: 'inv_type', text: 'Investment Type' },
    { id: 'apl_no', text: 'Application Number' },
    { id: 'fol_no', text: 'Folio Number' },
    { id: 'kyc_status', text: 'KYC Status' },
    { id: 'delete', text: 'Delete' },
  ];
  __category: category[];
  __subCat: subcat[];
  __bu_type = buType;
  __rcvForms = new FormGroup({
    dt_type: new FormControl(''),
    start_dt: new FormControl(''),
    end_dt: new FormControl(''),
    is_all_bu_type: new FormControl(false),
    is_all_trns_type: new FormControl(false),
    is_all_rnt: new FormControl(false),
    options: new FormControl('2'),
    sub_brk_cd: new FormControl(''),
    tin_no: new FormControl(''),
    trans_type: new FormArray([]),
    client_code: new FormControl(''),
    amc_name: new FormControl(''),
    inv_type: new FormControl(''),
    euin_no: new FormControl(''),
    brn_cd: new FormControl(''),
    bu_type: new FormArray([]),
    rnt_name: new FormArray([]),
    cat_id: new FormControl(''),
    subcat_id: new FormControl(''),
    date_status: new FormControl('T'),
    start_date: new FormControl(this.getTodayDate()),
    end_date: new FormControl(this.getTodayDate()),
    login_status: new FormControl('N'),
  });
  __rnt: rnt[];
  __isAdd: boolean = false;
  __isVisible: boolean = true;
  __paginate: any = [];
  __pageNumber = new FormControl(10);
  __export = new MatTableDataSource<any>([]);
  __exportedClmns: string[] = [
    'sl_no',
    'temp_tin_no',
    'rnt_name',
    'bu_type',
    'transaction',
    'scheme_name',
  ];
  __financMst = new MatTableDataSource<any>([]);
  __columns = [];
  __trans_types: any;
  __columnsForSummary: string[] = [
    'edit',
    'sl_no',
    'temp_tin_no',
    'rnt_name',
    'bu_type',
    'transaction',
    'scheme_name',
    'delete',
  ];

  __columnsForDtls: string[] = [
    'edit',
    'sl_no',
    'temp_tin_no',
    'rnt_name',
    'bu_type',
    'arn_no',
    'euin_no',
    'first_client_name',
    'first_client_code',
    'first_client_pan',
    'mode_of_holding',
    'second_client_name',
    'second_client_code',
    'second_client_pan',
    'third_client_name',
    'third_client_code',
    'third_client_pan',
    'transaction',
    'scheme_name',
    'plan',
    'option',
    'amount',
    'chq',
    'bank',
    'inv_type',
    'apl_no',
    'fol_no',
    'kyc_status',
    'delete',
  ];
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private __dialog: MatDialog,
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<RPTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngAfterViewInit() {
    this.__rcvForms.controls['dt_type'].valueChanges.subscribe((res) => {
      this.__rcvForms.controls['start_dt'].reset(
        res && res != 'R' ? dates.calculateDT(res) : ''
      );
      this.__rcvForms.controls['end_dt'].reset(
        res && res != 'R' ? dates.getTodayDate() : ''
      );
      if (res && res != 'R') {
        this.__rcvForms.controls['start_dt'].disable();
        this.__rcvForms.controls['end_dt'].disable();
      } else {
        this.__rcvForms.controls['start_dt'].enable();
        this.__rcvForms.controls['end_dt'].enable();
      }
    });

    // AMC SEARCH
    this.__rcvForms.controls['amc_name'].valueChanges
      .pipe(
        tap(() => (this.__isAmcPending = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.searchItems('/amc', dt) : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.amcMst = value;
          this.searchResultVisibilityForAMC('block');
          this.__isAmcPending = false;
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isAmcPending = false;
        },
      });
    // End

    // EUIN NUMBER SEARCH
    this.__rcvForms.controls['euin_no'].valueChanges
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
    this.__rcvForms.controls['sub_brk_cd'].valueChanges
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
    this.__rcvForms.controls['client_code'].valueChanges
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
    this.__rcvForms.controls['tin_no'].valueChanges
      .pipe(
        tap(() => (this.__isTinspinner = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.ReportTINSearch('/mfTraxShow', dt) : []
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

    this.__rcvForms.controls['is_all_bu_type'].valueChanges.subscribe((res) => {
      const bu_type: FormArray = this.__rcvForms.get('bu_type') as FormArray;
      bu_type.clear();
      if (!res) {
        this.uncheckAll_buType();
      } else {
        this.__bu_type.forEach((__el) => {
          bu_type.push(new FormControl(__el.id));
        });
        this.checkAll_buType();
      }
    });

    this.__rcvForms.controls['is_all_trns_type'].valueChanges.subscribe(
      (res) => {
        const trns_type: FormArray = this.__rcvForms.get(
          'trans_type'
        ) as FormArray;
        trns_type.clear();
        if (!res) {
          this.uncheckAll_trnsType();
        } else {
          this.__transType.forEach((__el) => {
            trns_type.push(new FormControl(__el.id));
          });
          this.checkAll_trnsType();
        }
      }
    );

    this.__rcvForms.controls['is_all_rnt'].valueChanges.subscribe((res) => {
      const rntName: FormArray = this.__rcvForms.get('rnt_name') as FormArray;
      rntName.clear();
      if (!res) {
        this.uncheckAll_rnt();
      } else {
        this.__rnt.forEach((__el) => {
          rntName.push(new FormControl(__el.id));
        });
        this.checkAll_rnt();
      }
    });

    this.__rcvForms.controls['date_status'].valueChanges.subscribe((res) => {
      if (res == 'T') {
        this.__rcvForms.controls['start_date'].setValue('');
        this.__rcvForms.controls['end_date'].setValue('');
      }
    });
    this.__rcvForms.controls['options'].valueChanges.subscribe((res) => {
      console.log(res);
      if (res == '2') {
        this.__columns = this.__columnsForSummary;
        this.toppings.setValue(this.__columnsForSummary);
        this.__exportedClmns = [
          'sl_no',
          'temp_tin_no',
          'rnt_name',
          'bu_type',
          'transaction',
          'scheme_name',
        ];
      } else {
        this.__columns = this.__columnsForDtls;
        this.toppings.setValue(this.__columnsForDtls);
        this.__exportedClmns = [
          'sl_no',
          'temp_tin_no',
          'rnt_name',
          'bu_type',
          'arn_no',
          'euin_no',
          'first_client_name',
          'first_client_code',
          'first_client_pan',
          'mode_of_holding',
          'second_client_name',
          'second_client_code',
          'second_client_pan',
          'third_client_name',
          'third_client_code',
          'third_client_pan',
          'transaction',
          'scheme_name',
          'plan',
          'option',
          'amount',
          'chq',
          'bank',
          'inv_type',
          'apl_no',
          'fol_no',
          'kyc_status',
        ];
      }
      // else{

      // }
    });
    this.toppings.valueChanges.subscribe((res) => {
      const clm = ['edit', 'delete'];
      this.__columns = res;
      this.__exportedClmns = res.filter((item) => !clm.includes(item));
    });
  }
  __transType: any = [];
  ngOnInit() {
    this.__columns = this.__columnsForSummary;
    this.toppings.setValue(this.__columns);
    // this.tableExport();
    // this.submit();
    this.getNFORPT();
    this.getTransactionTypeDtls();
    this.getTransactionType();
    this.getCategory();
    this.getSubCategory();
    this.getRnt();
  }

  uncheckAll_buType() {
    this.__buTypeChecked.forEach((element: any) => {
      element.checked = false;
    });
  }
  checkAll_buType() {
    this.__buTypeChecked.forEach((element: any) => {
      element.checked = true;
    });
  }

  uncheckAll_trnsType() {
    this.__trnsTypeChecked.forEach((element: any) => {
      element.checked = false;
    });
  }
  checkAll_trnsType() {
    this.__trnsTypeChecked.forEach((element: any) => {
      element.checked = true;
    });
  }

  uncheckAll_rnt() {
    this.__rntChecked.forEach((element: any) => {
      element.checked = false;
    });
  }
  checkAll_rnt() {
    this.__rntChecked.forEach((element: any) => {
      element.checked = true;
    });
  }

  getRnt() {
    this.__dbIntr
      .api_call(0, '/rnt', null)
      .pipe(pluck('data'))
      .subscribe((res: rnt[]) => {
        this.__rnt = res;
      });
  }
  getCategory() {
    this.__dbIntr
      .api_call(0, '/category', null)
      .pipe(pluck('data'))
      .subscribe((res: category[]) => {
        this.__category = res;
      });
  }
  getSubCategory() {
    this.__dbIntr
      .api_call(0, '/subcategory', null)
      .pipe(pluck('data'))
      .subscribe((res: subcat[]) => {
        this.__subCat = res;
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
  getTransactionTypeDtls() {
    this.__dbIntr
      .api_call(
        0,
        '/mfTraxCreateShow',
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
  tableExport(__mfTrax: FormData) {
    __mfTrax.delete('paginate');
    this.__dbIntr
      .api_call(1, '/manualUpdateDetailSearch', __mfTrax)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__export = new MatTableDataSource(res);
      });
  }
  minimize() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.updateSize('40%', '55px');
    this.dialogRef.updatePosition({
      bottom: '0px',
      right: this.data.right + 'px',
    });
  }
  maximize() {
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }
  fullScreen() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }

  getval(__paginate) {
    this.__pageNumber.setValue(__paginate.toString());
    this.submit();
  }
  getPaginate(__paginate: any | null = null) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            // + (this.data.trans_id ? '&trans_id=' + this.data.trans_id : '')
            ('&option=' + this.__rcvForms.value.options) +
            ('&trans_type_id=' + this.data.trans_type_id) +
            // + ('&trans_id=' +  this.data.trans_id)
            ('&column_name=' + this.__sortAscOrDsc.active) +
            ('&sort_by=' + this.__sortAscOrDsc.direction) +
            ('&client_code=' + this.__rcvForms.value.client_code
              ? this.__rcvForms.value.client_code
              : '') +
            ('&sub_brk_cd=' + this.__rcvForms.value.sub_brk_cd
              ? this.__rcvForms.value.sub_brk_cd
              : '') +
            ('&trans_type=' +
              (this.__rcvForms.value.trans_type.length > 0
                ? JSON.stringify(this.__rcvForms.value.trans_type)
                : '')) +
            ('&tin_no=' + this.__rcvForms.value.tin_no
              ? this.__rcvForms.value.tin_no
              : '') +
            ('&amc_name=' + this.__rcvForms.value.amc_name
              ? this.__rcvForms.value.amc_name
              : '') +
            ('&inv_type=' + this.__rcvForms.value.inv_type
              ? this.__rcvForms.value.inv_type
              : '') +
            ('&euin_no=' + this.__rcvForms.value.euin_no
              ? this.__rcvForms.value.euin_no
              : '') +
            ('&brn_cd=' + this.__rcvForms.value.brn_cd
              ? this.__rcvForms.value.brn_cd
              : '') +
            ('&rnt_name' +
              (this.__rcvForms.value.rnt_name.length > 0
                ? JSON.stringify(this.__rcvForms.value.rnt_name)
                : '')) +
            ('&bu_type' +
              (this.__rcvForms.value.bu_type.length > 0
                ? JSON.stringify(this.__rcvForms.value.bu_type)
                : '')) +
            ('&cat_id=' + this.__rcvForms.value.cat_id
              ? this.__rcvForms.value.cat_id
              : '') +
            ('&subcat_id=' + this.__rcvForms.value.subcat_id
              ? this.__rcvForms.value.subcat_id
              : '') +
            ('&from_date=' +
              global.getActualVal(this.__rcvForms.getRawValue().start_dt)) +
            ('&to_date=' +
              global.getActualVal(this.__rcvForms.getRawValue().end_dt))
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res);
        });
    } else {
      // this.__dbIntr
      //   .api_call(0, '/mfTraxShow', 'paginate=' + this.__pageNumber)
      //   .pipe(map((x: any) => x.data))
      //   .subscribe((res: any) => {
      //     this.setPaginator(res);
      //   });
    }
  }
  setPaginator(res) {
    this.__financMst = new MatTableDataSource(res.data);
    this.__paginate = res.links;
  }
  populateDT(__items) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '50%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'MUNFO_' + (__items.tin_no ? __items.tin_no.toString() : '0'),
      isViewMode: __items.form_status == 'A' ? false : true,
      tin: __items.tin_no,
      tin_no: __items.tin_no,
      title: 'Manual Update For Non Financial',
      right: global.randomIntFromInterval(1, 60),
      data: __items,
    };
    dialogConfig.id =
      'FDMUNFO_' + (__items.tin_no ? __items.tin_no.toString() : '0');
    try {
      const dialogref = this.__dialog.open(
        ManualUpdateEntryForMFComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          this.updateRow(dt.data);
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'MUNFO_' + (__items.tin_no ? __items.tin_no.toString() : '0'),
      });
    }
  }
  updateRow(row_obj) {
    this.__financMst.data = this.__financMst.data.filter((value: any, key) => {
      if (value.tin_no == row_obj.tin_no) {
        value.manual_update_remarks = row_obj.manual_update_remarks;
        value.pending_reason = row_obj.pending_reason;
        value.reject_reason_id = row_obj.reject_reason_id;
        value.contact_per_email = row_obj.contact_per_email;
        value.contact_per_phone = row_obj.contact_per_phone;
        value.contact_per_name = row_obj.contact_per_name;
        value.contact_via = row_obj.contact_via;
        value.contact_to_comp = row_obj.contact_to_comp;
        value.folio_no = row_obj.folio_no;
        value.process_date = row_obj.process_date;
        value.manual_trans_status = row_obj.manual_trans_status;
        value.reject_memo = row_obj.reject_memo;
        value.upload_soa = row_obj.upload_soa;
        value.form_status = row_obj.form_status;
      }
      return true;
    });
  }

  getNFORPT(
    column_name: string | null = '',
    sort_by: string | null | '' = 'asc'
  ) {
    const __mfTrax = new FormData();
    __mfTrax.append('paginate', this.__pageNumber.value);
    __mfTrax.append('option', this.__rcvForms.value.options);
    __mfTrax.append('trans_type_id', this.data.trans_type_id);
    // __mfTrax.append('trans_id', this.data.trans_id);
    __mfTrax.append('column_name', column_name);
    __mfTrax.append('sort_by', sort_by);
    __mfTrax.append(
      'client_code',
      this.__rcvForms.value.client_code ? this.__rcvForms.value.client_code : ''
    );
    __mfTrax.append(
      'sub_brk_cd',
      this.__rcvForms.value.sub_brk_cd ? this.__rcvForms.value.sub_brk_cd : ''
    );
    __mfTrax.append(
      'trans_type',
      this.__rcvForms.value.trans_type.length > 0
        ? JSON.stringify(this.__rcvForms.value.trans_type)
        : ''
    );
    __mfTrax.append(
      'tin_no',
      this.__rcvForms.value.tin_no ? this.__rcvForms.value.tin_no : ''
    );
    __mfTrax.append(
      'amc_name',
      this.__rcvForms.value.amc_name ? this.__rcvForms.value.amc_name : ''
    );
    __mfTrax.append(
      'inv_type',
      this.__rcvForms.value.inv_type ? this.__rcvForms.value.inv_type : ''
    );
    __mfTrax.append(
      'euin_no',
      this.__rcvForms.value.euin_no ? this.__rcvForms.value.euin_no : ''
    );
    __mfTrax.append(
      'brn_cd',
      this.__rcvForms.value.brn_cd ? this.__rcvForms.value.brn_cd : ''
    );
    __mfTrax.append(
      'rnt_name',
      this.__rcvForms.value.rnt_name.length > 0
        ? JSON.stringify(this.__rcvForms.value.rnt_name)
        : ''
    );
    __mfTrax.append(
      'bu_type',
      this.__rcvForms.value.bu_type.length > 0
        ? JSON.stringify(this.__rcvForms.value.bu_type)
        : ''
    );
    __mfTrax.append(
      'cat_id',
      this.__rcvForms.value.cat_id ? this.__rcvForms.value.cat_id : ''
    );
    __mfTrax.append(
      'subcat_id',
      this.__rcvForms.value.subcat_id ? this.__rcvForms.value.subcat_id : ''
    );
    __mfTrax.append('from_date', this.__rcvForms.getRawValue().start_dt);
    __mfTrax.append('to_date', this.__rcvForms.getRawValue().end_dt);
    this.__dbIntr
      .api_call(1, '/manualUpdateDetailSearch', __mfTrax)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        // this.__paginate = res.links;
        this.setPaginator(res);
        this.tableExport(__mfTrax);
      });
  }

  submit() {
    this.getNFORPT(this.__sortAscOrDsc.active, this.__sortAscOrDsc.direction);
  }
  exportPdf() {
    if (this.__rcvForms.get('options').value == '3') {
      this.divToPrint = document.getElementById('__NFORPTMU__');
      this.WindowObject = window.open('', 'Print-Window');
      this.WindowObject.document.open();
      this.WindowObject.document.writeln('<!DOCTYPE html>');
      this.WindowObject.document.writeln(
        '<html><head><title></title><style type="text/css">'
      );
      this.WindowObject.document.writeln(
        '@media print { .center { text-align: center;}' +
          '                                         .inline { display: inline; }' +
          '                                         .underline { text-decoration: underline; }' +
          '                                         .left { margin-left: 315px;} ' +
          '                                         .right { margin-right: 375px; display: inline; }' +
          '                                          table { border-collapse: collapse; font-size: 10px;}' +
          '                                          th, td { border: 1px solid black; border-collapse: collapse; padding: 6px;}' +
          '                                           th, td { }' +
          '                                         .border { border: 1px solid black; } ' +
          '                                         .bottom { bottom: 5px; width: 100%; position: fixed; } ' +
          '                                           footer { position: fixed; bottom: 0;text-align: center; }' +
          '                                         td.dashed-line { border-top: 1px dashed gray; } } </style>'
      );
      this.WindowObject.document.writeln(
        '</head><body onload="window.print()">'
      );
      this.WindowObject.document.writeln(
        '<center><img src="/assets/images/logo.jpg" alt="">' +
          '<h3>NuEdge Corporate Pvt. Ltd</h3>' +
          '<h5> Day Sheet Report</h5></center>'
      );
      this.WindowObject.document.writeln(this.divToPrint.innerHTML);
      this.WindowObject.document.writeln(
        '<footer><small>This is an electronically generated report, hence does not require any signature</small></footer>'
      );
      this.WindowObject.document.writeln('</body></html>');
      this.WindowObject.document.close();
      setTimeout(() => {
        this.WindowObject.close();
      }, 100);
    } else {
      this.__Rpt.downloadReport(
        '#__nfoRPTMU',
        {
          title: 'NFO Report',
        },
        'NFO Report  '
      );
    }
  }
  onbuTypeChange(e: any) {
    const bu_type: FormArray = this.__rcvForms.get('bu_type') as FormArray;
    if (e.checked) {
      bu_type.push(new FormControl(e.source.value));
    } else {
      let i: number = 0;
      bu_type.controls.forEach((item: any) => {
        if (item.value == e.source.value) {
          bu_type.removeAt(i);
          return;
        }
        i++;
      });
    }
    this.__rcvForms
      .get('is_all_bu_type')
      .setValue(bu_type.controls.length == 3 ? true : false, {
        emitEvent: false,
      });
  }
  onrntTypeChange(e: any) {
    const rnt_name: FormArray = this.__rcvForms.get('rnt_name') as FormArray;
    if (e.checked) {
      rnt_name.push(new FormControl(e.source.value));
    } else {
      let i: number = 0;
      rnt_name.controls.forEach((item: any) => {
        if (item.value == e.source.value) {
          rnt_name.removeAt(i);
          return;
        }
        i++;
      });
    }
    this.__rcvForms
      .get('is_all_rnt')
      .setValue(rnt_name.controls.length == 3 ? true : false, {
        emitEvent: false,
      });
  }

  ontrnsTypeChange(e: any) {
    const trans_type: FormArray = this.__rcvForms.get(
      'trans_type'
    ) as FormArray;
    if (e.checked) {
      trans_type.push(new FormControl(e.source.value));
    } else {
      let i: number = 0;
      trans_type.controls.forEach((item: any) => {
        if (item.value == e.source.value) {
          trans_type.removeAt(i);
          return;
        }
        i++;
      });
    }
    this.__rcvForms
      .get('is_all_trns_type')
      .setValue(trans_type.controls.length == 3 ? true : false, {
        emitEvent: false,
      });
  }
  getminDate() {
    return dates.getminDate();
  }
  getTodayDate() {
    return dates.getTodayDate();
  }

  sortData(sort) {
    this.__sortAscOrDsc = sort;
    this.submit();
  }
  reset() {
    this.__rcvForms.reset();
    this.__isAdd = false;
    this.__rcvForms.get('options').setValue('2');
    this.__sortAscOrDsc = { active: '', direction: 'asc' };
    this.submit();
  }
  outsideClickforTin(__ev) {
    if (__ev) {
      this.searchResultVisibilityForTin('none');
    }
  }

  outsideClickforClient(__ev) {
    if (__ev) {
      this.searchResultVisibilityForClient('none');
    }
  }
  outsideClickforSubBrkArn(__ev) {
    if (__ev) {
      this.searchResultVisibilityForSubBrk('none');
    }
  }
  outsideClick(__ev) {
    if (__ev) {
      this.searchResultVisibility('none');
    }
  }
  outsideClickForAMC(__ev) {
    if (__ev) {
      this.searchResultVisibilityForAMC('none');
    }
  }
  searchResultVisibility(display_mode) {
    this.__searchRlt.nativeElement.style.display = display_mode;
  }
  /** Search Result Off against Sub Broker */
  searchResultVisibilityForSubBrk(display_mode) {
    this.__subBrkArn.nativeElement.style.display = display_mode;
  }
  searchResultVisibilityForClient(display_mode) {
    this.__clientCode.nativeElement.style.display = display_mode;
  }
  searchResultVisibilityForTin(display_mode) {
    this.__searchTin.nativeElement.style.display = display_mode;
  }
  searchResultVisibilityForAMC(display_mode) {
    this.__AmcSearch.nativeElement.style.display = display_mode;
  }
  getItems(__items, __mode) {
    switch (__mode) {
      case 'A':
        this.__rcvForms.controls['amc_name'].reset(__items.amc_name, {
          emitEvent: false,
        });
        this.searchResultVisibilityForAMC('none');
        break;
      case 'C':
        this.__rcvForms.controls['client_code'].reset(__items.client_name, {
          emitEvent: false,
        });
        this.searchResultVisibilityForClient('none');
        break;
      case 'E':
        this.__rcvForms.controls['euin_no'].reset(__items.emp_name, {
          emitEvent: false,
        });
        this.searchResultVisibility('none');
        break;
      case 'T':
        this.__rcvForms.controls['tin_no'].reset(__items.tin_no, {
          emitEvent: false,
        });
        this.searchResultVisibilityForTin('none');
        break;
      case 'S':
        this.__rcvForms.controls['sub_brk_cd'].reset(__items.code, {
          emitEvent: false,
        });
        this.searchResultVisibilityForSubBrk('none');
        break;
    }
  }
}
