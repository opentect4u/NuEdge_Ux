import { Overlay } from '@angular/cdk/overlay';
import {
  Component,
  OnInit,
  Inject,
  ViewChildren,
  ElementRef,
  QueryList,
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
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { global } from 'src/app/__Utility/globalFunc';
import { fdTraxClm } from 'src/app/__Utility/fdColumns/TraxClm';
import buType from '../../../../../../../../assets/json/buisnessType.json';
import modeOfPremium from '../../../../../../../../assets/json/Master/modeofPremium.json';
import { responseDT } from 'src/app/__Model/__responseDT';
import { client } from 'src/app/__Model/__clientMst';

// import { TrxEntryComponent } from '../trx-entry/trx-entry.component';
import { fdComp } from 'src/app/__Model/fdCmp';
import subOpt from '../../../../../../../../assets/json/subOption.json';
import tdsInfo from '../../../../../../../../assets/json/TDSInfo.json'
import { EntryComponent } from '../entry/entry.component';
import { fdCertificateClm } from 'src/app/__Utility/fdColumns/fdcertificate';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  __comp_setting = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'comp_short_name',
    'Search Company'
  );
  __comp_type_setting = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'comp_type',
    'Search Company Type'
  );
  __scm_setting = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'scheme_name',
    'Search Scheme'
  );

  __insuredbu_type = [
    { id: 'F', insuredbu_type: 'Fresh' },
    { id: 'R', insuredbu_type: 'Renewal' },
  ];


  @ViewChildren('buTypeChecked')
  private __buTypeChecked: QueryList<ElementRef>;

  @ViewChild('searchEUIN') __searchRlt: ElementRef;
  @ViewChild('subBrkArn') __subBrkArn: ElementRef;
  @ViewChild('clientCd') __clientCode: ElementRef;

  __isSubArnPending: boolean = false;
  __isEuinPending: boolean = false;
  __isClientPending: boolean = false;
  divToPrint: any;
  WindowObject: any;
  __mode_of_premium = modeOfPremium;
  __columns: string[] = [];
  __euinMst: any = [];
  __subbrkArnMst: any = [];
  __clientMst: client[] = [];
  __compMst: fdComp[] = [];
  __compTypeMst: any = [];
  __scmMst: any = [];
  __insTrax = new MatTableDataSource<any>([]);
  __exportTrax = new MatTableDataSource<any>([]);

  __exportedClmns: string[];
  __sortAscOrDsc: any = { active: '', direction: 'asc' };
  __pageNumber = new FormControl(10);
  __paginate: any = [];
  __bu_type = buType;
  __isVisible: boolean = false;
  __insTraxMst = new MatTableDataSource<any>([]);
  __insTraxForm = new FormGroup({
    options: new FormControl('2'),
    sub_brk_cd: new FormControl(''),
    tin_no: new FormControl(''),
    insured_bu_type: new FormArray([]),
    brn_cd: new FormControl(''),
    investor_code: new FormControl(''),
    euin_no: new FormControl(''),
    bu_type: new FormArray([]),
    date_status: new FormControl('T'),
    start_date: new FormControl(this.getTodayDate()),
    end_date: new FormControl(this.getTodayDate()),
    login_status: new FormControl('N'),
    frm_dt: new FormControl(''),
    to_dt: new FormControl(''),
    dt_type: new FormControl(''),
    company_id: new FormControl([]),
    comp_type_id: new FormControl([]),
    scheme_id: new FormControl([]),
    filter_type: new FormControl(''),
    is_all_bu_type: new FormControl(false)
  });
  toppings = new FormControl();
  toppingList = fdTraxClm.COLUMN_SELECTOR;
  constructor(
    private __Rpt: RPTService,
    private __dialog: MatDialog,
    private __utility: UtiliService,
    public dialogRef: MatDialogRef<ReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dbIntr: DbIntrService
  ) {}

  setColumns(options) {
    const actions = ['collected_from_comp','delivery_by','received_by',];
    if (options == '1') {
      this.__columns = fdCertificateClm.COLUMNFORDETAILS;
    } else if (options == '2') {
      this.__columns = fdCertificateClm.INITIAL_COLUMNS;
    }
    this.toppings.setValue(this.__columns);
    this.__exportedClmns = this.__columns.filter(
      (x: any) => !actions.includes(x)
    );
  }

  ngOnInit(): void {
    this.getFDMstRPT();
    this.setColumns(this.__insTraxForm.value.options);
  }
  getFDMstRPT(
    column_name: string | null | undefined = '',
    sort_by: string | null | undefined = 'asc'
  ) {
    const __fd = new FormData();
    __fd.append('company_id', this.__insTraxForm.get('filter_type').value == 'A' ? JSON.stringify(this.__insTraxForm.value.company_id) : '[]');
    __fd.append('comp_type_id',this.__insTraxForm.get('filter_type').value == 'A' ?  JSON.stringify(this.__insTraxForm.value.comp_type_id) : '[]');
    __fd.append('scheme_id', this.__insTraxForm.get('filter_type').value == 'A' ? JSON.stringify(this.__insTraxForm.value.scheme_id) : '[]');

    __fd.append('bu_type', JSON.stringify(this.__insTraxForm.value.bu_type));
    __fd.append('column_name', column_name ? column_name : '');
    __fd.append('sort_by', sort_by ? sort_by : '');
    __fd.append('paginate', this.__pageNumber.value);
    __fd.append(
      'option',
      global.getActualVal(this.__insTraxForm.value.options)
    );
    if (this.__insTraxForm.value.options == '3') {
      __fd.append(
        'login_status',
        global.getActualVal(this.__insTraxForm.value.login_status)
      );
      __fd.append(
        'date_status',
        global.getActualVal(this.__insTraxForm.value.date_status)
      );
      __fd.append(
        'start_date',
        global.getActualVal(this.__insTraxForm.value.start_date)
      );
      __fd.append(
        'end_date',
        global.getActualVal(this.__insTraxForm.value.end_date)
      );
    } else {
      __fd.append(
        'sub_brk_cd',
        global.getActualVal(this.__insTraxForm.value.sub_brk_cd)
      );
      __fd.append(
        'tin_no',
        global.getActualVal(this.__insTraxForm.value.tin_no)
      );
      __fd.append(
        'investor_name',
        global.getActualVal(this.__insTraxForm.value.investor_code)
      );
      __fd.append(
        'euin_no',
        global.getActualVal(this.__insTraxForm.value.euin_no)
      );
      __fd.append(
        'from_date',
        global.getActualVal(this.__insTraxForm.getRawValue().frm_dt)
      );
      __fd.append(
        'to_date',
        global.getActualVal(this.__insTraxForm.getRawValue().to_dt)
      );
    }
    this.__dbIntr
      .api_call(1, '/fd/deliveryUpdateDetailSearch', __fd)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        console.log(res);
        this.__insTrax = new MatTableDataSource(res.data);
        this.__paginate = res.links;
        this.tableExport(__fd);
      });
  }
  tableExport(formData: FormData) {
    formData.delete('paginate');
    this.__dbIntr
      .api_call(1, '/fd/deliveryUpdateExport', formData)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__exportTrax = new MatTableDataSource(res);
      });
  }

  ngAfterViewInit() {
    this.__insTraxForm.controls['is_all_bu_type'].valueChanges.subscribe(
      (res) => {
        const bu_type: FormArray = this.__insTraxForm.get(
          'bu_type'
        ) as FormArray;
        bu_type.clear();
        if (!res) {
          this.uncheckAllForBuType();
        } else {
          this.__bu_type.forEach((__el) => {
            bu_type.push(new FormControl(__el.id));
          });
          this.checkAllForBuType();
        }
      }
    );



    this.__insTraxForm.controls['dt_type'].valueChanges.subscribe((res) => {
      this.__insTraxForm.controls['frm_dt'].setValue(
        res && res != 'R' ? dates.calculateDT(res) : ''
      );
      this.__insTraxForm.controls['to_dt'].setValue(
        res && res != 'R' ? dates.getTodayDate() : ''
      );
      if (res && res != 'R') {
        this.__insTraxForm.controls['frm_dt'].disable();
        this.__insTraxForm.controls['to_dt'].disable();
      } else {
        this.__insTraxForm.controls['frm_dt'].enable();
        this.__insTraxForm.controls['to_dt'].enable();
      }
    });

    this.__insTraxForm.controls['date_status'].valueChanges.subscribe((res) => {
      this.__insTraxForm.controls['start_date'].setValue(
        res == 'T' ? this.getTodayDate() : ''
      );
      this.__insTraxForm.controls['end_date'].setValue(
        res == 'T' ? this.getTodayDate() : ''
      );
    });
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
          console.log('sasa');

          this.__subbrkArnMst = value;
          this.searchResultVisibilityForSubBrk('block');
          this.__isSubArnPending = false;
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isSubArnPending = false;
        },
      });

    this.__insTraxForm.controls['investor_code'].valueChanges
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
    this.__insTraxForm.controls['comp_type_id'].valueChanges.subscribe(
      (res) => {
        this.getSchemeMst(this.__insTraxForm.get('company_id').value, res);
      }
    );
    /*** END */

    /*** Comapny Change */
    this.__insTraxForm.controls['company_id'].valueChanges.subscribe((res) => {
      this.getSchemeMst(res, this.__insTraxForm.get('comp_type_id').value);
    });
    /*** END */
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
  searchInsurance() {
    this.getFDMstRPT(
      this.__sortAscOrDsc.active,
      this.__sortAscOrDsc.direction
    );
  }


  uncheckAllForBuType() {
    this.__buTypeChecked.forEach((element: any) => {
      element.checked = false;
    });
  }
  checkAllForBuType() {
    this.__buTypeChecked.forEach((element: any) => {
      element.checked = true;
    });
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
            ('&paginate=' + this.__pageNumber) +
            ('&option=' + this.__insTraxForm.value.options) +
            +('&company_id=' + this.__insTraxForm.value.filter_type == 'A'
            ? JSON.stringify(this.__insTraxForm.value.company_id)
            : '[]')
            +('&comp_type_id=' + this.__insTraxForm.value.filter_type == 'A'
            ? JSON.stringify(this.__insTraxForm.value.comp_type_id)
            : '[]')
            +('&scheme_id=' + this.__insTraxForm.value.filter_type == 'A'
            ? JSON.stringify(this.__insTraxForm.value.scheme_id)
            : '[]')
            +
            ('&column_name=' + this.__sortAscOrDsc.active
              ? this.__sortAscOrDsc.active
              : '') +
            ('&sort_by=' + this.__sortAscOrDsc.direction
              ? this.__sortAscOrDsc.direction
              : '') +
            ('&tin_no=' + this.__insTraxForm.value.options == '3'
              ? ''
              : global.getActualVal(this.__insTraxForm.value.tin_no)) +
            ('&euin_no=' + this.__insTraxForm.value.options == '3'
              ? ''
              : global.getActualVal(this.__insTraxForm.value.euin_no)) +
            ('&bu_type' + this.__insTraxForm.value.options == '3'
              ? '[]'
              : this.__insTraxForm.value.bu_type.length > 0
              ? JSON.stringify(this.__insTraxForm.value.bu_type)
              : '') +
            ('&date_status=' + this.__insTraxForm.value.options == '3'
              ? global.getActualVal(this.__insTraxForm.value.date_status)
              : '') +
            ('&start_date=' + this.__insTraxForm.value.options == '3'
              ? global.getActualVal(this.__insTraxForm.value.start_date)
              : '') +
            ('&end_date=' + this.__insTraxForm.value.options == '3'
              ? global.getActualVal(this.__insTraxForm.value.end_date)
              : '') +
            ('&login_status=' + this.__insTraxForm.value.options == '3'
              ? global.getActualVal(this.__insTraxForm.value.login_status)
              : '') +
            ('&investor_name=' + this.__insTraxForm.value.options == '3'
              ? ''
              : global.getActualVal(this.__insTraxForm.value.investor_code)) +
            ('&from_date=' + this.__insTraxForm.value.options == '3'
              ? ''
              : global.getActualVal(this.__insTraxForm.getRawValue().frm_dt)) +
            ('&to_date=' + this.__insTraxForm.value.options == '3'
              ? ''
              : global.getActualVal(this.__insTraxForm.getRawValue().to_dt))
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
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
    );

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
  populateDT(__el) {
    console.log(__el.certificate_delivery_opt);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = '50%';
    dialogConfig.id = __el.tin_no;
    console.log(dialogConfig.id);
    dialogConfig.hasBackdrop = false;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    try {
      dialogConfig.data = {
        flag: 'FDC_' + __el.tin_no,
        id: 0,
        title: 'FD Certificate Delivery - ' + (__el.certificate_delivery_opt == 'H' ? 'Hand Delivery' : 'Postal Delivery'),
        right: global.randomIntFromInterval(1, 60),
        tin_no: __el.tin_no ? __el.tin_no : '',
        data: __el,
      };
      console.log(dialogConfig.data);
      const dialogref = this.__dialog.open(EntryComponent, dialogConfig);
      dialogref.afterClosed().subscribe((dt) => {
        if(dt){
          this.updateRow(dt.data);
        }

      });
    } catch (ex) {
      console.log(ex);
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'FDC_' + __el.tin_no,
      });
    }
  }
  updateRow(row_obj){
    console.log(row_obj);
    this.__insTrax.data = this.__insTrax.data.filter((value: any, key) => {
      if (value.tin_no == row_obj.tin_no) {
        value.cert_collect_by = row_obj.cert_collect_by;
        value.cert_collect_by_dt = row_obj.cert_collect_by_dt;
        value.cert_collect_from_comp = row_obj.cert_collect_from_comp;
        value.cert_delivery_by = row_obj.cert_delivery_by;
        value.cert_delivery_contact_no = row_obj.cert_delivery_contact_no;
        value.cert_delivery_cu_comp_name = row_obj.cert_delivery_cu_comp_name;
        value.cert_delivery_cu_dt = row_obj.cert_delivery_cu_dt;
        value.cert_delivery_cu_pod = row_obj.cert_delivery_cu_pod;
        value.cert_delivery_cu_pod_scan = row_obj.cert_delivery_cu_pod_scan;
        value.cert_delivery_dt = row_obj.cert_delivery_dt;
        value.cert_delivery_flag = row_obj.cert_delivery_flag;
        value.cert_delivery_name = row_obj.cert_delivery_name;
        value.cert_pending_remarks = row_obj.cert_pending_remarks;
        value.cert_rec_by_dt = row_obj.cert_rec_by_dt;
        value.cert_rec_by_name = row_obj.cert_rec_by_name;
        value.cert_rec_by_scan = row_obj.cert_rec_by_scan;
        value.certificate_delivery_opt = row_obj.certificate_delivery_opt;
      }
      return true;
    });
   }
  exportPdf() {
    if (this.__insTraxForm.get('options').value == '3') {
      this.__Rpt.printRPT('FDC');
    } else {
      this.__Rpt.downloadReport(
        '#FDC',
        {
          title: 'FD Certificate Delivery Report',
        },
        'FD Certificate Delivery Report'
      );
    }
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
  refresh() {
    // this.__insTraxForm.reset({ emitEvent: false });
    this.__insTraxForm.patchValue({
      options: '2',
      start_date: this.getTodayDate(),
      end_date: this.getTodayDate(),
      date_status: 'T',
      dt_type: '',
      login_status: 'N',
    });
    this.__insTraxForm.controls['company_id'].reset([],{emitEvent: false});
    this.__insTraxForm.controls['comp_type_id'].reset([],{emitEvent: false});
    this.__insTraxForm.controls['scheme_id'].reset([],{emitEvent: false});
    (<FormArray>this.__insTraxForm.get('bu_type')).clear();
    this.__insTraxForm.controls['investor_code'].reset('', {
      emitEvent: false,
    });
    this.__insTraxForm.controls['sub_brk_cd'].reset('', { emitEvent: false });
    this.__insTraxForm.controls['euin_no'].reset('', { emitEvent: false });
    this.uncheckAllForBuType();
    this.__sortAscOrDsc = { active: '', direction: 'asc' };
    this.searchInsurance();
  }

  getItems(__items, __mode) {
    console.log(__items);
    switch (__mode) {
      case 'C':
        this.__insTraxForm.controls['investor_code'].reset(
          __items.client_name,
          { emitEvent: false }
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
  outsideClickforClient(__ev) {
    if (__ev) {
      this.searchResultVisibilityForClient('none');
    }
  }
  searchResultVisibilityForClient(display_mode) {
    this.__clientCode.nativeElement.style.display = display_mode;
  }
  AdvanceFilter() {
    this.getCompanyMst();
    this.getCompanyTypeMst();
  }
  getCompanyMst() {
    this.__dbIntr
      .api_call(0, '/fd/company', null)
      .pipe(pluck('data'))
      .subscribe((res: fdComp[]) => {
        this.__compMst = res;
      });
  }
  getCompanyTypeMst() {
    this.__dbIntr
      .api_call(0, '/fd/companyType', null)
      .pipe(pluck('data'))
      .subscribe(res => {
        this.__compTypeMst = res;
      });
  }
  getSchemeMst(__comp_id, __prod_type_id) {
    console.log(__comp_id);

    if (__comp_id.length > 0 && __prod_type_id.length > 0) {

      const __fd = new FormData();
      __fd.append(
        'company_id',
        JSON.stringify(this.__insTraxForm.controls['company_id'].value)
      );
      __fd.append(
        'comp_type_id',
        JSON.stringify(this.__insTraxForm.controls['comp_type_id'].value)
      );
      this.__dbIntr
        .api_call(1, '/fd/schemeDetails', __fd)
        .pipe(pluck('data'))
        .subscribe(res => {
          this.__scmMst = res;
        });
    } else {
      this.__insTraxForm.controls['scheme_id'].setValue([], {
        emitEvent: false,
      });
    }
  }
  getSub_option(__subOpt){
    return subOpt.filter(x => x.id == __subOpt)[0]?.value;
  }
  getTDSInfo(__id){
    return tdsInfo.filter(x => x.id == __id)[0]?.name
  }
}