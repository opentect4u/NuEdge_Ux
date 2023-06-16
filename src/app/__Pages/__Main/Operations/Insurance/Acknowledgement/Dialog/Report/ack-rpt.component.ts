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
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { insComp } from 'src/app/__Model/insComp';
import { insPrdType } from 'src/app/__Model/insPrdType';
import { insProduct } from 'src/app/__Model/insproduct';
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { global } from 'src/app/__Utility/globalFunc';
import { insTraxClm } from 'src/app/__Utility/InsuranceColumns/insTrax';
import buType from '../../../../../../../../assets/json/buisnessType.json';
import modeOfPremium from '../../../../../../../../assets/json/Master/modeofPremium.json';
import { AckEntryComponent } from '../Entry/ack-entry/ack-entry.component';
import ackStatus from '../../../../../../../../assets/json/Master/ackStatus.json';
@Component({
  selector: 'app-ack-rpt',
  templateUrl: './ack-rpt.component.html',
  styleUrls: ['./ack-rpt.component.css'],
})
export class AckRPTComponent implements OnInit {
  @ViewChild('searchEUIN') __searchRlt: ElementRef;
  @ViewChild('subBrkArn') __subBrkArn: ElementRef;
  @ViewChild('clientCd') __clientCode: ElementRef;
  __isClientPending: boolean = false;
  __isSubArnPending: boolean = false;
  __isEuinPending: boolean = false;

  __clientMst: client[] = [];
  __subbrkArnMst: any = [];
  __euinMst: any = [];
  __ackStatus = ackStatus;
  __comp_setting = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'comp_short_name',
    'Search Company'
  );
  __prod_type_setting = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'product_type',
    'Search Product Type'
  );
  __prod_setting = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'product_name',
    'Search Product'
  );


  @ViewChildren('ackStatus')
  private __ackstatus: QueryList<ElementRef>;
  @ViewChildren('insTypeChecked')
  private __insTypeChecked: QueryList<ElementRef>;
  @ViewChildren('insbuTypeChecked')
  private __insbuTypeChecked: QueryList<ElementRef>;
  @ViewChildren('buTypeChecked')
  private __buTypeChecked: QueryList<ElementRef>;

  __insuredbu_type = [
    { id: 'F', insuredbu_type: 'Fresh' },
    { id: 'R', insuredbu_type: 'Renewal' },
  ];
  divToPrint: any;
  WindowObject: any;
  __mode_of_premium = modeOfPremium;
  __columns: string[] = [];
  __insTrax = new MatTableDataSource<any>([]);
  __exportTrax = new MatTableDataSource<any>([]);

  __exportedClmns: string[];
  __sortAscOrDsc: any = { active: '', direction: 'asc' };
  __pageNumber = new FormControl(10);
  __paginate: any = [];
  __insType: any = [];
  __compMst: insComp[] = [];
  __prodTypeMst: insPrdType[] = [];
  __prdMst: insProduct[] = [];
  __bu_type = buType;
  __isVisible: boolean = true;
  __insTraxMst = new MatTableDataSource<any>([]);
  __insTraxForm = new FormGroup({
    options: new FormControl('2'),
    sub_brk_cd: new FormControl(''),
    tin_no: new FormControl(''),
    ins_type_id: new FormArray([]),
    insured_bu_type: new FormArray([]),
    brn_cd: new FormControl(''),
    proposer_code: new FormControl(''),
    euin_no: new FormControl(''),
    bu_type: new FormArray([]),
    is_all: new FormControl(false),
    is_all_ins_bu_type: new FormControl(false),
    dt_type: new FormControl(''),
    frm_dt: new FormControl(''),
    to_dt: new FormControl(''),
    filter_type: new FormControl(''),
    company_id: new FormControl([]),
    product_type_id: new FormControl([]),
    product_id: new FormControl([]),
    ack_status: new FormArray([]),
    is_all_ack_status: new FormControl(false),
    is_all_bu_type: new FormControl(false)

  });
  toppings = new FormControl();
  toppingList = insTraxClm.COLUMN_SELECTOR.filter((x: any) => x.id != 'delete');
  constructor(
    private __Rpt: RPTService,
    private __dialog: MatDialog,
    private __utility: UtiliService,
    public dialogRef: MatDialogRef<AckRPTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dbIntr: DbIntrService
  ) {}

  setColumns(options) {
    const actions = ['edit', 'delete'];
    const actionsToRemoveFromMainTable = ['delete'];
    if (options == '1') {
      this.__columns = insTraxClm.COLUMNFORDETAILS.filter(
        (x: any) => !actionsToRemoveFromMainTable.includes(x)
      );
    } else if (options == '2') {
      this.__columns = insTraxClm.INITIAL_COLUMNS.filter(
        (x: any) => !actionsToRemoveFromMainTable.includes(x)
      );
    }
    this.toppings.setValue(this.__columns);
    this.__exportedClmns = this.__columns.filter(
      (x: any) => !actions.includes(x)
    );
  }

  ngOnInit(): void {
    this.getInsuranceType();
    this.getInsMstRPT();
    this.setColumns(this.__insTraxForm.value.options);
  }
  getInsMstRPT(
    column_name: string | null | undefined = '',
    sort_by: string | null | undefined = 'asc'
  ) {
    const __fd = new FormData();

    __fd.append(
      'ack_status',
       JSON.stringify(this.__insTraxForm.value.ack_status)
    );
    __fd.append(
      'company_id',
      this.__insTraxForm.get('filter_type').value == 'A'
        ? JSON.stringify(this.__insTraxForm.value.company_id)
        : '[]'
    );
    __fd.append(
      'product_type_id',
      this.__insTraxForm.get('filter_type').value == 'A'
        ? JSON.stringify(this.__insTraxForm.value.product_type_id)
        : '[]'
    );
    __fd.append(
      'product_id',
      this.__insTraxForm.get('filter_type').value == 'A'
        ? JSON.stringify(this.__insTraxForm.value.product_id)
        : '[]'
    );
    __fd.append(
      'from_date',
      global.getActualVal(this.__insTraxForm.getRawValue().frm_dt)
    );
    __fd.append('to_date', global.getActualVal(this.__insTraxForm.getRawValue().to_dt));
    __fd.append('bu_type', JSON.stringify(this.__insTraxForm.value.bu_type));
    __fd.append('column_name', column_name ? column_name : '');
    __fd.append('sort_by', sort_by ? sort_by : 'asc');
    __fd.append('paginate', this.__pageNumber.value);
    __fd.append(
      'option',
      global.getActualVal(this.__insTraxForm.value.options)
    );
    __fd.append(
      'sub_brk_cd',
      global.getActualVal(this.__insTraxForm.value.sub_brk_cd)
    );
    __fd.append('tin_no', global.getActualVal(this.__insTraxForm.value.tin_no));
    __fd.append(
      'ins_type_id',
      JSON.stringify(this.__insTraxForm.value.ins_type_id)
    );
    __fd.append(
      'insured_bu_type',
      JSON.stringify(this.__insTraxForm.value.insured_bu_type)
    );
    __fd.append(
      'proposer_name',
      global.getActualVal(this.__insTraxForm.value.proposer_code)
    );
    __fd.append(
      'euin_no',
      global.getActualVal(this.__insTraxForm.value.euin_no)
    );
    this.__dbIntr
      .api_call(1, '/ins/ackDetailSearch', __fd)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__insTrax = new MatTableDataSource(res.data);
        this.__paginate = res.links;
        this.tableExport(__fd);
      });
  }
  tableExport(formData: FormData) {
    formData.delete('paginate');
    this.__dbIntr
      .api_call(1, '/ins/ackExport', formData)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__exportTrax = new MatTableDataSource(res);
      });
  }
  getInsuranceType() {
    this.__dbIntr
      .api_call(0, '/ins/type', null)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.__insType = res;
      });
  }
  ngAfterViewInit() {

     // EUIN NUMBER SEARCH
     this.__insTraxForm.controls['euin_no'].valueChanges
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
         console.log(value);
         this.__euinMst = value;
         this.searchResultVisibility('block');
         this.__isEuinPending = false;
       },
       complete: () => console.log(''),
       error: (err) => {
         this.__isEuinPending = false;
       },
     });

     /**change Event of sub Broker Arn Number */
     this.__insTraxForm.controls['sub_brk_cd'].valueChanges
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

    this.__insTraxForm.controls['proposer_code'].valueChanges
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



    /*** Product Type Change */
    this.__insTraxForm.controls['product_type_id'].valueChanges.subscribe(
      (res) => {
        this.getProductMst(this.__insTraxForm.get('company_id').value, res);
      }
    );
    /*** END */

    /*** Comapny Change */
    this.__insTraxForm.controls['company_id'].valueChanges.subscribe((res) => {
      this.getProductMst(res, this.__insTraxForm.get('product_type_id').value);
    });
    /*** END */
    this.__insTraxForm.controls['options'].valueChanges.subscribe((res) => {
      if (res != '3') {
        this.setColumns(res);
      }
    });
    this.toppings.valueChanges.subscribe((res) => {
      const clm = ['edit', 'delete'];
      this.__columns = res;
      this.__exportedClmns = res.filter((item) => !clm.includes(item));
    });

    this.__insTraxForm.controls['is_all'].valueChanges.subscribe((res) => {
      const ins_type: FormArray = this.__insTraxForm.get(
        'ins_type_id'
      ) as FormArray;
      ins_type.clear();
      if (!res) {
        this.uncheckAll();
      } else {
        this.__insType.forEach((__el) => {
          ins_type.push(new FormControl(__el.id));
        });
        this.checkAll();
      }
    });
    this.__insTraxForm.controls['is_all_bu_type'].valueChanges.subscribe((res) => {
      const bu_type: FormArray = this.__insTraxForm.get(
        'bu_type'
      ) as FormArray;
      bu_type.clear();
      if (!res) {
        this.uncheckAllbuType();
      } else {
        this.__bu_type.forEach((__el) => {
          bu_type.push(new FormControl(__el.id));
        });
        this.checkAllbuType();
      }
    });
    this.__insTraxForm.controls['is_all_ack_status'].valueChanges.subscribe((res) => {
      const ins_type: FormArray = this.__insTraxForm.get(
        'ack_status'
      ) as FormArray;
      ins_type.clear();
      if (!res) {
        this.uncheckAllForAckStatus();
      } else {
        this.__insType.forEach((__el) => {
          ins_type.push(new FormControl(__el.id));
        });
        this.checkAllForAckStatus();
      }
    });

    this.__insTraxForm.controls['dt_type'].valueChanges.subscribe((res) => {
      this.__insTraxForm.controls['frm_dt'].setValue(
        res && res != 'R' ? dates.getTodayDate() : ''
      );
      this.__insTraxForm.controls['to_dt'].setValue(
        res && res != 'R' ? dates.calculateDT(res) : ''
      );
      if (res && res != 'R') {
        this.__insTraxForm.controls['frm_dt'].disable();
        this.__insTraxForm.controls['to_dt'].disable();
      } else {
        this.__insTraxForm.controls['frm_dt'].enable();
        this.__insTraxForm.controls['to_dt'].enable();
      }
    });

    this.__insTraxForm.controls['is_all_ins_bu_type'].valueChanges.subscribe(
      (res) => {
        const ins_type: FormArray = this.__insTraxForm.get(
          'insured_bu_type'
        ) as FormArray;
        ins_type.clear();
        if (!res) {
          this.uncheckAllForInsBuType();
        } else {
          this.__insType.forEach((__el) => {
            ins_type.push(new FormControl(__el.id));
          });
          this.checkAllForInsBuType();
        }
      }
    );
  }
  searchInsurance() {
    this.getInsMstRPT(
      this.__sortAscOrDsc.active,
      this.__sortAscOrDsc.direction
    );
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
  getTodayDate() {
    return dates.getTodayDate();
  }
  getval(__paginate) {
     this.__pageNumber.setValue(__paginate.toString());
    this.searchInsurance();
  }
  getPaginate(__paginate: any | null = null) {
    if (__paginate) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
             ('&ack_status='+
             global.getActualVal(this.__insTraxForm.value.ack_status))
             +
            ('&company_id=' + this.__insTraxForm.value.filter_type == 'A'
              ? JSON.stringify(this.__insTraxForm.value.company_id)
              : '[]') +
            ('&product_type_id=' + this.__insTraxForm.value.filter_type == 'A'
              ? JSON.stringify(this.__insTraxForm.value.product_type_id)
              : '[]') +
            ('&product_id=' + this.__insTraxForm.value.filter_type == 'A'
              ? JSON.stringify(this.__insTraxForm.value.product_id)
              : '[]') +
            ('&paginate=' + this.__pageNumber) +
            ('&from_date=' +
              global.getActualVal(this.__insTraxForm.getRawValue().frm_dt)) +
            ('&to_date=' + global.getActualVal(this.__insTraxForm.getRawValue().to_dt)) +
            ('&option=' + this.__insTraxForm.value.options) +
            ('&ins_type_id=' +
              JSON.stringify(this.__insTraxForm.value.ins_type_id)) +
            ('&column_name=' + this.__sortAscOrDsc.active
              ? this.__sortAscOrDsc.active
              : '') +
            ('&sort_by=' + this.__sortAscOrDsc.direction
              ? this.__sortAscOrDsc.direction
              : 'asc') +
            ('&tin_no=' +
              global.getActualVal(this.__insTraxForm.value.tin_no)) +
            ('&euin_no=' +
              global.getActualVal(this.__insTraxForm.value.euin_no)) +
            ('&bu_type' + JSON.stringify(this.__insTraxForm.value.bu_type)) +
            ('&proposer_name=' +
              global.getActualVal(this.__insTraxForm.value.proposer_code)) +
            ('&insured_bu_type=' +
              JSON.stringify(this.__insTraxForm.value.insured_bu_type))
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          // this.setPaginator(res);
          this.__insTrax = new MatTableDataSource(res);
        });
    } else {
    }
  }
  onbuTypeChange(e: any) {
    const bu_type: FormArray = this.__insTraxForm.get('bu_type') as FormArray;
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
    this.__insTraxForm.get('is_all_bu_type').setValue(
      bu_type.controls.length == 3 ? true : false,
      {emitEvent:false}
    )
  }
  sortData(__ev) {
    this.__sortAscOrDsc = __ev;
    this.searchInsurance();
  }
  getModeOfPremium(premium) {
    return premium
      ? this.__mode_of_premium.filter((x: any) => (x.id = premium))[0].name
      : '';
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
      flag: 'ACKUPLNOFIN_' + (__items.tin_no ? __items.tin_no.toString() : '0'),
      isViewMode: __items.form_status == 'P' ? false : true,
      tin: __items.tin_no,
      tin_no: __items.tin_no,
      title: 'Upload Acknowledgement',
      right: global.randomIntFromInterval(1, 60),
      data: __items,
    };
    dialogConfig.id =
      'ACKUPLNONFIN_' + (__items.tin_no ? __items.tin_no.toString() : '0');
    try {
      const dialogref = this.__dialog.open(AckEntryComponent, dialogConfig);
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
        flag:
          'ACKUPLNOFIN_' + (__items.tin_no ? __items.tin_no.toString() : '0'),
      });
    }
  }
  exportPdf() {
    if (this.__insTraxForm.get('options').value == '3') {
      this.__Rpt.printRPT('InsRPT');
    } else {
      this.__Rpt.downloadReport(
        '#InsRPT',
        {
          title: 'Insurance Report',
        },
        'Insurance Report  '
      );
    }
  }
  refresh() {
    this.__insTraxForm.reset({ emitEvent: false });
    this.__insTraxForm.patchValue({
      options: '2',
      frm_dt: '',
      to_dt: '',
      dt_type: '',
      is_all: false,
      is_all_ins_bu_type: false,
      is_all_ack_status: false,
      is_all_bu_type:false
    });
    this.__insTraxForm.controls['company_id'].reset([],{emitEvent: false});
    this.__insTraxForm.controls['product_type_id'].reset([],{emitEvent: false});
    this.__insTraxForm.controls['product_id'].reset([],{emitEvent: false});
    (<FormArray>this.__insTraxForm.get('ack_status')).clear();
    (<FormArray>this.__insTraxForm.get('ins_type_id')).clear();
    (<FormArray>this.__insTraxForm.get('insured_bu_type')).clear();
    (<FormArray>this.__insTraxForm.get('bu_type')).clear();
    this.__insTraxForm.controls['proposer_code'].reset('', {
      emitEvent: false,
    });
    this.__insTraxForm.controls['sub_brk_cd'].reset('', { emitEvent: false });
    this.__insTraxForm.controls['euin_no'].reset('', { emitEvent: false });
    this.uncheckAll();
    this.uncheckAllForInsBuType();
    this.uncheckAllbuType();
    this.uncheckAllForAckStatus();
    this.__sortAscOrDsc = { active: '', direction: 'asc' };
    this.searchInsurance();
  }
  updateRow(row_obj) {
    console.log(row_obj);

    this.__insTrax.data = this.__insTrax.data.filter((value: any, key) => {
      if (value.tin_no == row_obj.tin_no) {
        (value.comp_login_cutt_off = row_obj.comp_login_cutt_off),
          (value.comp_login_dt = row_obj.comp_login_dt),
          (value.comp_login_time = row_obj.comp_login_dt?.split(' ')[1]),
          (value.ack_copy_scan = `${row_obj.ack_copy_scan}`),
          (value.form_status = row_obj.form_status),
          (value.ack_remarks = row_obj.ack_remarks);
      }
      return true;
    });
  }

  onInsTypeChange(e) {
    const ins_type: FormArray = this.__insTraxForm.get(
      'ins_type_id'
    ) as FormArray;
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
    this.__insTraxForm
      .get('is_all')
      .setValue(ins_type.controls.length == 3 ? true : false, {
        emitEvent: false,
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
  uncheckAllbuType() {
    this.__buTypeChecked.forEach((element: any) => {
      element.checked = false;
    });
  }
  checkAllbuType() {
    this.__buTypeChecked.forEach((element: any) => {
      element.checked = true;
    });
  }



  uncheckAllForAckStatus() {
    this.__ackstatus.forEach((element: any) => {
      element.checked = false;
    });
  }
  checkAllForAckStatus(){
    this.__ackstatus.forEach((element: any) => {
      element.checked = true;
    });
  }
  onAckStatusChange(e) {
    const ack_status: FormArray = this.__insTraxForm.get(
      'ack_status'
    ) as FormArray;
    if (e.checked) {
      ack_status.push(new FormControl(e.source.value));
    } else {
      let i: number = 0;
      ack_status.controls.forEach((item: any) => {
        if (item.value == e.source.value) {
          ack_status.removeAt(i);
          return;
        }
        i++;
      });
    }
    this.__insTraxForm
      .get('is_all_ack_status')
      .setValue(ack_status.controls.length == 2 ? true : false, {
        emitEvent: false,
      });
  }
  onInsBuTypeChange(e) {
    const ins_bu_type: FormArray = this.__insTraxForm.get(
      'insured_bu_type'
    ) as FormArray;
    if (e.checked) {
      ins_bu_type.push(new FormControl(e.source.value));
    } else {
      let i: number = 0;
      ins_bu_type.controls.forEach((item: any) => {
        if (item.value == e.source.value) {
          ins_bu_type.removeAt(i);
          return;
        }
        i++;
      });
    }
    this.__insTraxForm
      .get('is_all_ins_bu_type')
      .setValue(ins_bu_type.controls.length == 2 ? true : false, {
        emitEvent: false,
      });
  }
  uncheckAllForInsBuType() {
    this.__insbuTypeChecked.forEach((element: any) => {
      element.checked = false;
    });
  }
  checkAllForInsBuType() {
    this.__insbuTypeChecked.forEach((element: any) => {
      element.checked = true;
    });
  }
  AdvanceFilter() {
    this.getCompanyMst();
    this.getProductTypeMst();
  }
  getCompanyMst() {
    this.__dbIntr
      .api_call(0, '/ins/company', null)
      .pipe(pluck('data'))
      .subscribe((res: insComp[]) => {
        this.__compMst = res;
      });
  }
  getProductTypeMst() {
    this.__dbIntr
      .api_call(0, '/ins/productType', null)
      .pipe(pluck('data'))
      .subscribe((res: insPrdType[]) => {
        this.__prodTypeMst = res;
      });
  }
  getProductMst(__comp_id, __prod_type_id) {
    if (__comp_id.length > 0 && __prod_type_id.length > 0) {
      const __fd = new FormData();
      __fd.append(
        'company_id',
        JSON.stringify(this.__insTraxForm.controls['company_id'].value)
      );
      __fd.append(
        'product_type_id',
        JSON.stringify(this.__insTraxForm.controls['product_type_id'].value)
      );
      this.__dbIntr
        .api_call(1, '/ins/productDetails', __fd)
        .pipe(pluck('data'))
        .subscribe((res: insProduct[]) => {
          this.__prdMst = res;
        });
    } else {
      this.__insTraxForm.controls['product_id'].setValue([], {
        emitEvent: false,
      });
    }
  }
  outsideClickforClient(__ev) {
    if (__ev) {
      this.searchResultVisibilityForClient('none');
    }
  }
  searchResultVisibilityForClient(display_mode) {
    this.__clientCode.nativeElement.style.display = display_mode;
  }

  outsideClickforSubBrkArn(__ev) {
    if (__ev) {
      this.searchResultVisibilityForSubBrk('none');
    }
  }
  /** Search Result Off against Sub Broker */
  searchResultVisibilityForSubBrk(display_mode) {
    this.__subBrkArn.nativeElement.style.display = display_mode;
  }

  outsideClick(__ev) {
    if (__ev) {
      this.__isEuinPending = false;
      this.searchResultVisibility('none');
    }
  }
  searchResultVisibility(display_mode) {
    this.__searchRlt.nativeElement.style.display = display_mode;
  }
  getItems(__items, __mode) {
    console.log(__items);
    switch (__mode) {
      case 'C':
        this.__insTraxForm.controls['proposer_code'].reset(
          __items.client_name,
          {emitEvent: false }
        );
        this.searchResultVisibilityForClient('none');
        break;
      case 'E':
        this.__insTraxForm.controls['euin_no'].reset(__items.emp_name, {
          emitEvent: false,
        });
        this.searchResultVisibility('none');
        break;
      case 'T':
        // this.__insTraxForm.controls['temp_tin_no'].reset(__items.temp_tin_no,{ onlySelf: true, emitEvent: false });
        // this.searchResultVisibilityForTempTin('none');
        break;
      case 'S':
        this.__insTraxForm.controls['sub_brk_cd'].reset(__items.code, {
          emitEvent: false,
        });
        this.searchResultVisibilityForSubBrk('none');
        break;
    }
  }
}
