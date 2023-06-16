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
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  pluck,
  switchMap,
  tap,
} from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import buType from '../../../../../../../../../../assets/json/buisnessType.json';
import { rnt } from 'src/app/__Model/Rnt';
import { ManualUpdateEntryForMFComponent } from 'src/app/shared/manual-update-entry-for-mf/manual-update-entry-for-mf.component';
import { client } from 'src/app/__Model/__clientMst';
import { amc } from 'src/app/__Model/amc';
import { responseDT } from 'src/app/__Model/__responseDT';
@Component({
  selector: 'app-search-rpt',
  templateUrl: './search-rpt.component.html',
  styleUrls: ['./search-rpt.component.css'],
})
export class SearchRPTComponent implements OnInit {
  @ViewChildren('buTypeChecked') private __buTypeChecked: QueryList<ElementRef>;
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

  __transType: any = [];
  __bu_type = buType;
  __rnt: rnt[];

  __paginate: any = [];
  __pageNumber = new FormControl(10);
  __ackForm = new FormGroup({
    is_all_bu_type: new FormControl(false),
    is_all_rnt: new FormControl(false),
    start_date: new FormControl(''),
    end_date: new FormControl(''),
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
  });
  __columns: string[] = [
    'edit',
    'sl_no',
    'temp_tin_no',
    'rnt_name',
    'bu_type',
    'arn_no',
    'euin_no',
    // 'first_client_name',
    // 'first_client_code',
    // 'first_client_pan'
  ];
  __ackMst = new MatTableDataSource<any>([]);
  constructor(
    public dialogRef: MatDialogRef<SearchRPTComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog,
    private overlay: Overlay
  ) {}
  __isVisible: boolean = true;
  ngOnInit() {
    this.submitAck();
    this.getRnt();
    this.getTransactionType();
  }
  ngAfterViewInit() {
    // AMC SEARCH
    this.__ackForm.controls['amc_name'].valueChanges
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
    this.__ackForm.controls['euin_no'].valueChanges
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
    this.__ackForm.controls['sub_brk_cd'].valueChanges
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
    this.__ackForm.controls['client_code'].valueChanges
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
    this.__ackForm.controls['tin_no'].valueChanges
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

    this.__ackForm.controls['is_all_bu_type'].valueChanges.subscribe((res) => {
      const bu_type: FormArray = this.__ackForm.get('bu_type') as FormArray;
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

    this.__ackForm.controls['is_all_rnt'].valueChanges.subscribe((res) => {
      const rntName: FormArray = this.__ackForm.get('rnt_name') as FormArray;
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
  getTransactionType() {
    this.__dbIntr
      .api_call(0, '/showTrans', 'trans_type_id=' + this.data.trans_type_id)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__transType = res;
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
  submitAck() {
    const __ack = new FormData();
    __ack.append('start_date', this.__ackForm.value.start_date);
    __ack.append('end_date', this.__ackForm.value.end_date);
    __ack.append('trans_type_id', this.data.trans_type_id);
    __ack.append('paginate', this.__pageNumber.value);
    __ack.append(
      'sub_brk_cd',
      this.__ackForm.value.sub_brk_cd ? this.__ackForm.value.sub_brk_cd : ''
    );
    __ack.append(
      'trans_type',
      this.__ackForm.value.trans_type.length > 0
        ? JSON.stringify(this.__ackForm.value.trans_type)
        : ''
    );
    __ack.append(
      'tin_no',
      this.__ackForm.value.tin_no ? this.__ackForm.value.tin_no : ''
    );
    __ack.append(
      'amc_name',
      this.__ackForm.value.amc_name ? this.__ackForm.value.amc_name : ''
    );
    __ack.append(
      'inv_type',
      this.__ackForm.value.inv_type ? this.__ackForm.value.inv_type : ''
    );
    __ack.append(
      'euin_no',
      this.__ackForm.value.euin_no ? this.__ackForm.value.euin_no : ''
    );
    __ack.append(
      'brn_cd',
      this.__ackForm.value.brn_cd ? this.__ackForm.value.brn_cd : ''
    );
    __ack.append(
      'rnt_name',
      this.__ackForm.value.rnt_name.length > 0
        ? JSON.stringify(this.__ackForm.value.rnt_name)
        : ''
    );
    __ack.append(
      'bu_type',
      this.__ackForm.value.bu_type.length > 0
        ? JSON.stringify(this.__ackForm.value.bu_type)
        : ''
    );

    this.__dbIntr
      .api_call(1, '/manualUpdateDetailSearch', __ack)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
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
      flag: 'MUNOFIN_' + (__items.tin_no ? __items.tin_no.toString() : '0'),
      isViewMode: __items.form_status == 'A' ? false : true,
      tin: __items.tin_no,
      tin_no: __items.tin_no,
      title: 'Manual Update For Non Financial',
      right: global.randomIntFromInterval(1, 60),
      data: __items,
    };
    dialogConfig.id =
      'FDMUNOFIN_' + (__items.tin_no ? __items.tin_no.toString() : '0');
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
        flag: 'MUNOFIN_' + (__items.tin_no ? __items.tin_no.toString() : '0'),
      });
    }
  }
  updateRow(row_obj) {
    this.__ackMst.data = this.__ackMst.data.filter((value: any, key) => {
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
  getval(__paginate) {
    this.__pageNumber.setValue(__paginate.toString());
    this.getPaginate();
  }
  getPaginate(__paginate: any | null = null) {
    if (__paginate) {
      this.__dbIntr
        .getpaginationData(__paginate.url + ('&paginate=' + this.__pageNumber))
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res);
        });
    } else {
      this.__dbIntr
        .api_call(0, '/mfTraxShow', 'paginate=' + this.__pageNumber)
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res);
        });
    }
  }
  setPaginator(res) {
    this.__ackMst = new MatTableDataSource(res);
    this.__paginate = res.links;
  }

  finalSubmitAck() {
    const __finalSubmit = new FormData();
    __finalSubmit.append('trans_type_id', this.data.trans_type_id);
    this.__dbIntr
      .api_call(1, '/ackFinalSubmit', __finalSubmit)
      .subscribe((res: any) => {
        this.__utility.showSnackbar(res.msg, res.suc);
      });
  }
  onbuTypeChange(e: any) {
    const bu_type: FormArray = this.__ackForm.get('bu_type') as FormArray;
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
    this.__ackForm
      .get('is_all_bu_type')
      .setValue(bu_type.controls.length == 3 ? true : false, {
        emitEvent: false,
      });
  }
  onrntTypeChange(e: any) {
    const rnt_name: FormArray = this.__ackForm.get('rnt_name') as FormArray;
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
    this.__ackForm
      .get('is_all_rnt')
      .setValue(rnt_name.controls.length == 3 ? true : false, {
        emitEvent: false,
      });
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
        this.__ackForm.controls['amc_name'].reset(__items.amc_name, {
          emitEvent: false,
        });
        this.searchResultVisibilityForAMC('none');
        break;
      case 'C':
        this.__ackForm.controls['client_code'].reset(__items.client_name, {
          emitEvent: false,
        });
        this.searchResultVisibilityForClient('none');
        break;
      case 'E':
        this.__ackForm.controls['euin_no'].reset(__items.emp_name, {
          emitEvent: false,
        });
        this.searchResultVisibility('none');
        break;
      case 'T':
        this.__ackForm.controls['tin_no'].reset(__items.tin_no, {
          emitEvent: false,
        });
        this.searchResultVisibilityForTin('none');
        break;
      case 'S':
        this.__ackForm.controls['sub_brk_cd'].reset(__items.code, {
          emitEvent: false,
        });
        this.searchResultVisibilityForSubBrk('none');
        break;
    }
  }
}
