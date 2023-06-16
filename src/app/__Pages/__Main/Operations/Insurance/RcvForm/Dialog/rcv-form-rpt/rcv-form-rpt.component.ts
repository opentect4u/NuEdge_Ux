import { Overlay } from '@angular/cdk/overlay';
import {
  Component,
  OnInit,
  Inject,
  QueryList,
  ElementRef,
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
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { global } from 'src/app/__Utility/globalFunc';
import buType from '../../../../../../../../assets/json/buisnessType.json';
import { RcvFormCrudComponent } from '../rcv-form-crud/rcv-form-crud.component';

@Component({
  selector: 'app-rcv-form-rpt',
  templateUrl: './rcv-form-rpt.component.html',
  styleUrls: ['./rcv-form-rpt.component.css'],
})
export class RcvFormRPTComponent implements OnInit {
  @ViewChildren('insTypeChecked')
  private __insTypeChecked: QueryList<ElementRef>;
  @ViewChildren('buTypeChecked') private __buTypeChecked: QueryList<ElementRef>;
  @ViewChild('searchEUIN') __searchRlt: ElementRef;
  @ViewChild('searchTempTin') __searchTempTin: ElementRef;
  @ViewChild('subBrkArn') __subBrkArn: ElementRef;

  @ViewChild('clientCd') __clientCode: ElementRef;
  __isClientPending: boolean = false;
  __isEuinPending: boolean = false;
  __istemporaryspinner: boolean = false;
  __isSubArnPending: boolean = false;

  __clientMst: client[] = [];
  __euinMst: any = [];
  __temp_tinMst: any = [];
  __subbrkArnMst: any = [];

  __sortAscOrDsc: any = { active: '', direction: 'asc' };
  toppings = new FormControl();
  toppingList: any = [
    { id: 'edit', text: 'Edit' },
    { id: 'delete', text: 'Delete' },
    { id: 'sl_no', text: 'Sl No' },
    { id: 'temp_tin_no', text: 'Temporary Tin Number' },
    { id: 'bu_type', text: 'Buisness type' },
    { id: 'sub_brk_cd', text: 'Sub Broker Code' },
    { id: 'euin_no', text: 'Employee' },
    { id: 'ins_type_name', text: 'Insurance Type' },
    { id: 'insure_bu_type', text: 'Insure ' },
    { id: 'proposer_name', text: 'Proposer Name' },
    { id: 'rcv_datetime', text: 'Receive DateTime' },
    { id: 'recv_from', text: 'Reaceive From' },
  ];
  __bu_type = buType;
  __kycStatus: any = [
    { id: 'Y', status: 'With KYC' },
    { id: 'N', status: 'Without KYC' },
  ];
  __export = new MatTableDataSource<any>([]);
  __isAdd: boolean = false;
  __isVisible: boolean = true;
  __RcvForms = new MatTableDataSource<any>([]);
  __pageNumber = new FormControl(10);
  __paginate: any = [];
  __columns: string[] = [];
  __exportedClmns: string[] = [
    'sl_no',
    'temp_tin_no',
    'bu_type',
    'rcv_datetime',
  ];
  __columnsForSummary: string[] = [
    'edit',
    'delete',
    'sl_no',
    'temp_tin_no',
    'bu_type',
    'rcv_datetime',
  ];
  __columnsForDtls: string[] = [
    'edit',
    'delete',
    'sl_no',
    'temp_tin_no',
    'bu_type',
    'sub_brk_cd',
    'euin_no',
    'ins_type_name',
    'insure_bu_type',
    'proposer_name',
    'rcv_datetime',
    'recv_from',
  ];
  __rcvForms = new FormGroup({
    options: new FormControl('2'),
    proposer_code: new FormControl(''),
    recv_from: new FormControl(''),
    sub_brk_cd: new FormControl(''),
    euin_no: new FormControl(''),
    temp_tin_no: new FormControl(''),
    bu_type: new FormArray([]),
    ins_type_id: new FormArray([]),
    is_all: new FormControl(false),
    dt_type: new FormControl(''),
    start_dt: new FormControl(''),
    end_dt: new FormControl(''),
    is_all_bu_type: new FormControl(false),
  });
  __insTypeMst: any = [];
  __transType: any = [];
  constructor(
    private __Rpt: RPTService,
    private __dialog: MatDialog,
    private __utility: UtiliService,
    public dialogRef: MatDialogRef<RcvFormRPTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dbIntr: DbIntrService
  ) {}
  __trans_types: any;
  ngOnInit() {
    this.__columns = this.__columnsForSummary;
    this.toppings.setValue(this.__columns);
    this.getRcvForm();
    this.getInstTypeMSt();
  }

  getInstTypeMSt() {
    this.__dbIntr
      .api_call(0, '/ins/type', null)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.__insTypeMst = res;
      });
  }
  getRcvForm(
    column_name: string | null = '',
    sort_by: string | null | '' = 'asc'
  ) {
    const __rcvFormSearch = new FormData();
    __rcvFormSearch.append('paginate', this.__pageNumber.value);
    __rcvFormSearch.append(
      'proposer_code',
      this.__rcvForms.value.proposer_code
        ? this.__rcvForms.value.proposer_code
        : ''
    );
    __rcvFormSearch.append(
      'recv_from',
      this.__rcvForms.value.recv_from ? this.__rcvForms.value.recv_from : ''
    );
    __rcvFormSearch.append(
      'sub_brk_cd',
      this.__rcvForms.value.sub_brk_cd ? this.__rcvForms.value.sub_brk_cd : ''
    );
    __rcvFormSearch.append(
      'euin_no',
      this.__rcvForms.value.euin_no ? this.__rcvForms.value.euin_no : ''
    );
    __rcvFormSearch.append(
      'bu_type',
      JSON.stringify(this.__rcvForms.value.bu_type)
    );
    __rcvFormSearch.append(
      'temp_tin_no',
      this.__rcvForms.value.temp_tin_no ? this.__rcvForms.value.temp_tin_no : ''
    );
    __rcvFormSearch.append('column_name', column_name);
    __rcvFormSearch.append('sort_by', sort_by ? sort_by : 'asc');
    __rcvFormSearch.append(
      'ins_type_id',
      JSON.stringify(this.__rcvForms.value.ins_type_id)
    );
    __rcvFormSearch.append(
      'start_date',
      global.getActualVal(this.__rcvForms.controls['start_dt'].disabled ? this.__rcvForms.getRawValue().start_dt : this.__rcvForms.value.start_dt)
    );
    __rcvFormSearch.append('end_date',
    global.getActualVal(this.__rcvForms.controls['end_dt'].disabled ? this.__rcvForms.getRawValue().end_dt : this.__rcvForms.value.end_dt));
    this.__dbIntr
      .api_call(1, '/ins/formreceivedDetailSearch', __rcvFormSearch)
      .pipe(map((x: any) => x.data))
      .subscribe((res: any) => {
        this.__paginate = res.links;
        this.__RcvForms = new MatTableDataSource(res.data);
        this.__RcvForms._updateChangeSubscription();
        this.tableExport(column_name, sort_by, __rcvFormSearch);
      });
  }



  ngAfterViewInit() {
    this.__rcvForms.controls['options'].valueChanges.subscribe((res) => {
      if (res == '1') {
        this.__columns = this.__columnsForDtls;
        this.toppings.setValue(this.__columnsForDtls);
        this.__exportedClmns = [
          'sl_no',
          'temp_tin_no',
          'bu_type',
          'sub_brk_cd',
          'euin_no',
          'ins_type_name',
          'insure_bu_type',
          'proposer_name',
          'rcv_datetime',
          'recv_from',
        ];
      } else {
        this.__columns = this.__columnsForSummary;
        this.toppings.setValue(this.__columnsForSummary);
        this.__exportedClmns = [
          'sl_no',
          'temp_tin_no',
          'bu_type',
          'rcv_datetime',
        ];
      }
    });
    this.toppings.valueChanges.subscribe((res) => {
      const clm = ['edit', 'delete'];
      this.__columns = res;
      this.__exportedClmns = res.filter((item) => !clm.includes(item));
    });

    this.__rcvForms.controls['is_all'].valueChanges.subscribe((res) => {
      const ins_type: FormArray = this.__rcvForms.get(
        'ins_type_id'
      ) as FormArray;
      ins_type.clear();
      if (!res) {
        this.uncheckAll();
      } else {
        this.__insTypeMst.forEach((__el) => {
          ins_type.push(new FormControl(__el.id));
        });
        this.checkAll();
      }
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
    this.__rcvForms.controls['dt_type'].valueChanges.subscribe((res) => {
      this.__rcvForms.controls['start_dt'].reset(
        res && res != 'R' ? dates.calculateDT(res) : ''
      );
      this.__rcvForms.controls['end_dt'].reset(
        res && res != 'R' ? dates.getTodayDate() : ''
      );
      if( res && res != 'R'){
        this.__rcvForms.controls['start_dt'].disable();
        this.__rcvForms.controls['end_dt'].disable();
      }
      else{
        this.__rcvForms.controls['start_dt'].enable();
        this.__rcvForms.controls['end_dt'].enable();
      }
    });
    this.__rcvForms.controls['proposer_code'].valueChanges
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
        complete: () => console.log(''),
        error: (err) => {
          this.__isClientPending = false;
        },
      });
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

    // Temporary Tin Number
    this.__rcvForms.controls['temp_tin_no'].valueChanges
      .pipe(
        tap(() => (this.__istemporaryspinner = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1
            ? this.__dbIntr.searchTin('/ins/formreceived', dt )
            : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__temp_tinMst = value;
          this.searchResultVisibilityForTempTin('block');
          this.__istemporaryspinner = false;
        },
        complete: () => console.log(''),
        error: (err) => (this.__istemporaryspinner = false),
      });

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
  }
  uncheckAll() {
    this.__insTypeChecked.forEach((element: any) => {
      element.checked = false;
    });
  }
  checkAll() {
    this.__insTypeChecked.forEach((element: any) => {
      element.checked = true;
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
  tableExport(
    column_name: string | null = '',
    sort_by: string | null | '' = 'asc',
    __frmData
  ) {
    __frmData.delete('paginate');
    this.__dbIntr
      .api_call(1, '/ins/formreceivedExport', __frmData)
      .pipe(map((x: any) => x.data))
      .subscribe((res: any) => {
        this.__export = new MatTableDataSource(res);
        this.__export._updateChangeSubscription();
      });
  }

  getval(__itemsPerPage) {
    this.__pageNumber.setValue(__itemsPerPage);
    this.submit();
  }
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&sort_by=' + this.__sortAscOrDsc.direction) +
            ('&ins_type_id=' +
              JSON.stringify(this.__rcvForms.value.ins_type_id)) +
            ('&start_date=' +
              global.getActualVal(this.__rcvForms.controls['start_dt'].disabled ? this.__rcvForms.getRawValue().start_dt : this.__rcvForms.value.start_dt)) +
            ('&end_date=' +
              global.getActualVal(this.__rcvForms.controls['end_dt'].disabled ? this.__rcvForms.getRawValue().end_dt : this.__rcvForms.value.end_dt)) +
            ('&column_name=' + this.__sortAscOrDsc.active) +
            ('&proposer_code=' + this.__rcvForms.value.proposer_code
              ? this.__rcvForms.value.proposer_code
              : '') +
            ('&recv_from=' + this.__rcvForms.value.recv_from
              ? this.__rcvForms.value.recv_from
              : '') +
            ('&sub_brk_cd=' + this.__rcvForms.value.sub_brk_cd
              ? this.__rcvForms.value.sub_brk_cd
              : '') +
            ('&euin_no=' + this.__rcvForms.value.euin_no
              ? this.__rcvForms.value.euin_no
              : '') +
            ('&temp_tin_no=' + this.__rcvForms.value.temp_tin_no
              ? this.__rcvForms.value.temp_tin_no
              : '') +
            ('&bu_type=' + JSON.stringify(this.__rcvForms.value.bu_type))
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res.data);
          this.__paginate = res.links;
        });
    }
  }
  private setPaginator(__res) {
    this.__RcvForms = new MatTableDataSource(__res);
  }
  deleteRcvForm(__element, index) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.width = '30%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'D',
      id: __element.temp_tin_no,
      title: 'Delete ' + __element.temp_tin_no,
      api_name: '/ins/formreceivedDelete',
    };
    try {
      const dialogref = this.__dialog.open(DeletemstComponent, dialogConfig);
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          this.__RcvForms.data.splice(index, 1);
          this.__RcvForms._updateChangeSubscription();
          this.__export.data.splice(
            this.__export.data.findIndex(
              (x: any) => x.temp_tin_no == __element.temp_tin_no
            ),
            1
          );
          this.__export._updateChangeSubscription();
        }
      });
    } catch (ex) {}
  }
  populateDT(__items) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = '80%';
    dialogConfig.id = 'INS_' + __items.temp_tin_no.toString();
    dialogConfig.hasBackdrop = false;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    try {
      dialogConfig.data = {
        flag: 'INSRF',
        id: __items.temp_tin_no,
        title: 'Form Recievable - Insurance',
        product_id: __items.product_id,
        trans_type_id: __items.trans_type_id,
        temp_tin_no: __items.temp_tin_no,
        right: global.randomIntFromInterval(1, 60),
      };
      const dialogref = this.__dialog.open(RcvFormCrudComponent, dialogConfig);

      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt.temp_tin_no) {
            //update ROW
            this.updateRow(dt.data);
          } else {
            this.__RcvForms.data.unshift(dt.data);
            this.__RcvForms._updateChangeSubscription();
            this.__export.data.unshift(dt.data);
            this.__export._updateChangeSubscription();
          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('80%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'client_name',
      });
    }
  }
  fullScreen() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
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

  updateRow(row_obj) {
    this.__RcvForms.data = this.__RcvForms.data.filter((value: any, key) => {
      if (value.temp_tin_no == row_obj.temp_tin_no) {
        value.arn_no = row_obj.arn_no;
        value.branch_code = row_obj.branch_code;
        value.bu_type = row_obj.bu_type;
        value.dob = row_obj.dob;
        value.euin_no = row_obj.euin_no;
        value.ins_type_id = row_obj.ins_type_id;
        value.ins_type_name = row_obj.ins_type_name;
        value.insure_bu_type = row_obj.insure_bu_type;
        value.pan = row_obj.pan;
        value.proposal_no = row_obj.proposal_no;
        value.proposer_code = row_obj.proposer_code;
        value.proposer_id = row_obj.proposer_id;
        value.proposer_name = row_obj.proposer_name;
        value.rec_datetime = row_obj.rec_datetime;
        value.recv_from = row_obj.recv_from;
        value.sub_arn_no = row_obj.sub_arn_no;
        value.sub_brk_cd = row_obj.sub_brk_cd;
        value.temp_tin_no = row_obj.temp_tin_no;
      }
    });
    this.__export.data = this.__export.data.filter((value: any, key) => {
      if (value.temp_tin_no == row_obj.temp_tin_no) {
        value.arn_no = row_obj.arn_no;
        value.branch_code = row_obj.branch_code;
        value.bu_type = row_obj.bu_type;
        value.dob = row_obj.dob;
        value.euin_no = row_obj.euin_no;
        value.ins_type_id = row_obj.ins_type_id;
        value.ins_type_name = row_obj.ins_type_name;
        value.insure_bu_type = row_obj.insure_bu_type;
        value.pan = row_obj.pan;
        value.proposal_no = row_obj.proposal_no;
        value.proposer_code = row_obj.proposer_code;
        value.proposer_id = row_obj.proposer_id;
        value.proposer_name = row_obj.proposer_name;
        value.rec_datetime = row_obj.rec_datetime;
        value.recv_from = row_obj.recv_from;
        value.sub_arn_no = row_obj.sub_arn_no;
        value.sub_brk_cd = row_obj.sub_brk_cd;
        value.temp_tin_no = row_obj.temp_tin_no;
      }
    });
  }

  exportPdf() {
    this.__Rpt.downloadReport(
      '#rcvForm',
      {
        title: 'Receive Form ',
      },
      'Receive Form'
    );
  }

  submit() {
    this.getRcvForm(this.__sortAscOrDsc.active, this.__sortAscOrDsc.direction);
  }
  sortData(sort) {
    this.__sortAscOrDsc = sort;
    this.getRcvForm(this.__sortAscOrDsc.active, this.__sortAscOrDsc.direction);
  }
  reset() {
    this.__rcvForms.reset({ emitEvent: false });
    this.__isAdd = false;
    this.__rcvForms.get('options').setValue('2');
    this.__rcvForms.patchValue({
      start_dt: '',
      end_dt: '',
      dt_type: '',
      is_all:false,
      is_all_bu_type:false
    });
    (<FormArray>this.__rcvForms.get('ins_type_id')).clear();
    (<FormArray>this.__rcvForms.get('bu_type')).clear();
    this.uncheckAll();
    this.uncheckAll_buType();
    this.__sortAscOrDsc = { active: '', direction: 'asc' };
    this.submit();
  }
  onInsTypeChange(e) {
    const ins_type: FormArray = this.__rcvForms.get('ins_type_id') as FormArray;
    if (e.checked) {
      ins_type.push(new FormControl(e.source.value));
    } else {
      let i: number = 0;
      ins_type.controls.forEach((item: any) => {
        if (item.value == e.source.value) {
          ins_type.removeAt(i);
          return;
        }
        i++;
      });
    }
    this.__rcvForms
      .get('is_all')
      .setValue(ins_type.controls.length == 3 ? true : false, {
        emitEvent: false,
      });
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
    this.__rcvForms.get('is_all_bu_type').setValue(
      bu_type.controls.length == 3 ? true : false,
      { emitEvent: false }
    );
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
  outsideClickfortempTin(__ev) {
    if (__ev) {
      this.searchResultVisibilityForTempTin('none');
    }
  }
  /** Search Result Off against Sub Broker */
  searchResultVisibilityForSubBrk(display_mode) {
    this.__subBrkArn.nativeElement.style.display = display_mode;
  }
  searchResultVisibilityForTempTin(display_mode) {
    this.__searchTempTin.nativeElement.style.display = display_mode;
  }
  searchResultVisibility(display_mode) {
    this.__searchRlt.nativeElement.style.display = display_mode;
  }
  outsideClickforClient(__ev) {
    if (__ev) {
      this.searchResultVisibilityForClient('none');
    }
  }
  searchResultVisibilityForClient(display_mode) {
    this.__clientCode.nativeElement.style.display = display_mode;
  }
  getItems(__items, __mode) {
    switch (__mode) {
      case 'C':
        this.__rcvForms.controls['proposer_code'].reset(__items.client_name, {
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
        this.__rcvForms.controls['temp_tin_no'].reset(__items.temp_tin_no, {
          emitEvent: false,
        });
        this.searchResultVisibilityForTempTin('none');
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
