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
import { sort } from 'src/app/__Model/sort';
import itemsPerPage from '../../../../../../../../assets/json/itemsPerPage.json';
import filterOpt from '../../../../../../../../assets/json/filterOption.json';
import { column } from 'src/app/__Model/tblClmns';
import { environment } from 'src/environments/environment';
import { PreviewDocumentComponent } from 'src/app/shared/core/preview-document/preview-document.component';
import { DomSanitizer } from '@angular/platform-browser';
type selectBtn ={
  label:string,
  value:string,
  icon:string
}
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  isOpenMegaMenu:boolean = false;

  __istemporaryspinner:boolean = false;
  __isClientPending:boolean = false;
  __euinMst: any = [];
  __subbrkArnMst: any = [];
  __clientMst: client[] = [];
  __compMst: fdComp[] = [];
  __compTypeMst: any = [];
  __scmMst: any = [];
  __tinMst: any =[];
  __brnchMst:any = [];
  __paginate: any = [];
  __bu_type: any=[];
  __rmMst: any=[];
  __pageNumber = '10';
  displayMode_forTemp_Tin:string;
  displayMode_forClient:string;
  sort = new sort();
  itemsPerPage:selectBtn[] = itemsPerPage;
  selectBtn:selectBtn[] = filterOpt
  __isVisible:boolean = false;
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
  __columns: column[] = [];
  __exportedClmns: string[];
  clmList: any= fdCertificateClm.Columns.filter(item => !['collected_from_comp','delivery_by','received_by'].includes(item.field))
  SelectedClms:string[]= [];
  settingsForEUIN = this.__utility.settingsfroMultiselectDropdown('euin_no','euin_no','Search Employee',1);
  settingsForbrnch = this.__utility.settingsfroMultiselectDropdown('id','brn_name','Search Branch',1);
  settingsForbuType = this.__utility.settingsfroMultiselectDropdown('bu_code','bu_type','Search Business Type',3);
  settingsForRM = this.__utility.settingsfroMultiselectDropdown('euin_no','emp_name','Search Relationship Manager',1);
  settingsForsubCode = this.__utility.settingsfroMultiselectDropdown('code','bro_name','Search Sub Broker',1);
  __insTraxForm = new FormGroup({
    btn_type:new FormControl('R'),
    options: new FormControl('2'),
    sub_brk_cd: new FormControl([],{updateOn:'blur'}),
    tin_no: new FormControl(''),
    insured_bu_type: new FormArray([]),
    brn_cd: new FormControl([],{updateOn:'blur'}),
    investor_code: new FormControl(''),
    investor_name: new FormControl(''),
    euin_no: new FormControl([]),
    bu_type: new FormControl([],{updateOn:'blur'}),
    rm_id: new FormControl([],{updateOn:'blur'}),
    frm_dt: new FormControl(''),
    to_dt: new FormControl(''),
    dt_type: new FormControl(''),
    date_range: new FormControl(''),
    company_id: new FormControl([],{updateOn:'blur'}),
    comp_type_id: new FormControl([],{updateOn:'blur'}),
    scheme_id: new FormControl([]),
    filter_type: new FormControl('')
  });
  __insTrax = new MatTableDataSource<any>([]);
  __exportTrax = new MatTableDataSource<any>([]);

  // __insuredbu_type = [
  //   { id: 'F', insuredbu_type: 'Fresh' },
  //   { id: 'R', insuredbu_type: 'Renewal' },
  // ];


  // @ViewChildren('buTypeChecked')
  // private __buTypeChecked: QueryList<ElementRef>;

  // @ViewChild('searchEUIN') __searchRlt: ElementRef;
  // @ViewChild('subBrkArn') __subBrkArn: ElementRef;
  // @ViewChild('clientCd') __clientCode: ElementRef;

  // __isSubArnPending: boolean = false;
  // __isEuinPending: boolean = false;
  // __isClientPending: boolean = false;
  // divToPrint: any;
  // WindowObject: any;
  // __mode_of_premium = modeOfPremium;
  // __columns: string[] = [];
  // __euinMst: any = [];
  // __subbrkArnMst: any = [];
  // __clientMst: client[] = [];
  // __compMst: fdComp[] = [];
  // __compTypeMst: any = [];
  // __scmMst: any = [];


  // __exportedClmns: string[];
  // __sortAscOrDsc: any = { active: '', direction: 'asc' };
  // __pageNumber = new FormControl(10);
  // __paginate: any = [];
  // __bu_type = buType;
  // __isVisible: boolean = false;
  // __insTraxMst = new MatTableDataSource<any>([]);
  // __insTraxForm = new FormGroup({
  //   options: new FormControl('2'),
  //   sub_brk_cd: new FormControl(''),
  //   tin_no: new FormControl(''),
  //   insured_bu_type: new FormArray([]),
  //   brn_cd: new FormControl(''),
  //   investor_code: new FormControl(''),
  //   euin_no: new FormControl(''),
  //   bu_type: new FormArray([]),
  //   date_status: new FormControl('T'),
  //   start_date: new FormControl(this.getTodayDate()),
  //   end_date: new FormControl(this.getTodayDate()),
  //   login_status: new FormControl('N'),
  //   frm_dt: new FormControl(''),
  //   to_dt: new FormControl(''),
  //   dt_type: new FormControl(''),
  //   company_id: new FormControl([]),
  //   comp_type_id: new FormControl([]),
  //   scheme_id: new FormControl([]),
  //   filter_type: new FormControl(''),
  //   is_all_bu_type: new FormControl(false)
  // });
  // toppings = new FormControl();
  // toppingList = fdTraxClm.COLUMN_SELECTOR;
  constructor(
    private __Rpt: RPTService,
    private __dialog: MatDialog,
    private __utility: UtiliService,
    public dialogRef: MatDialogRef<ReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private sanitizer:DomSanitizer,
    private __dbIntr: DbIntrService
  ) {}

  // setColumns(options) {
  //   const actions = ['collected_from_comp','delivery_by','received_by'];
  //   if (options == '1') {
  //     this.__columns = fdCertificateClm.COLUMNFORDETAILS;
  //   } else if (options == '2') {
  //     this.__columns = fdCertificateClm.INITIAL_COLUMNS;
  //   }
  //   this.toppings.setValue(this.__columns);
  //   this.__exportedClmns = this.__columns.filter(
  //     (x: any) => !actions.includes(x)
  //   );
  // }

  ngOnInit(): void {
      this.getCompanyTypeMst();
    this.getFDMstRPT();
    this.setColumns(this.__insTraxForm.value.options);
  }
  // getFDMstRPT(
  //   column_name: string | null | undefined = '',
  //   sort_by: string | null | undefined = 'asc'
  // ) {
  //   const __fd = new FormData();
  //   __fd.append('company_id', this.__insTraxForm.get('filter_type').value == 'A' ? JSON.stringify(this.__insTraxForm.value.company_id) : '[]');
  //   __fd.append('comp_type_id',this.__insTraxForm.get('filter_type').value == 'A' ?  JSON.stringify(this.__insTraxForm.value.comp_type_id) : '[]');
  //   __fd.append('scheme_id', this.__insTraxForm.get('filter_type').value == 'A' ? JSON.stringify(this.__insTraxForm.value.scheme_id) : '[]');

  //   __fd.append('bu_type', JSON.stringify(this.__insTraxForm.value.bu_type));
  //   __fd.append('column_name', column_name ? column_name : '');
  //   __fd.append('sort_by', sort_by ? sort_by : '');
  //   __fd.append('paginate', this.__pageNumber.value);
  //   __fd.append(
  //     'option',
  //     global.getActualVal(this.__insTraxForm.value.options)
  //   );
  //   if (this.__insTraxForm.value.options == '3') {
  //     __fd.append(
  //       'login_status',
  //       global.getActualVal(this.__insTraxForm.value.login_status)
  //     );
  //     __fd.append(
  //       'date_status',
  //       global.getActualVal(this.__insTraxForm.value.date_status)
  //     );
  //     __fd.append(
  //       'start_date',
  //       global.getActualVal(this.__insTraxForm.value.start_date)
  //     );
  //     __fd.append(
  //       'end_date',
  //       global.getActualVal(this.__insTraxForm.value.end_date)
  //     );
  //   } else {
  //     __fd.append(
  //       'sub_brk_cd',
  //       global.getActualVal(this.__insTraxForm.value.sub_brk_cd)
  //     );
  //     __fd.append(
  //       'tin_no',
  //       global.getActualVal(this.__insTraxForm.value.tin_no)
  //     );
  //     __fd.append(
  //       'investor_name',
  //       global.getActualVal(this.__insTraxForm.value.investor_code)
  //     );
  //     __fd.append(
  //       'euin_no',
  //       global.getActualVal(this.__insTraxForm.value.euin_no)
  //     );
  //     __fd.append(
  //       'from_date',
  //       global.getActualVal(this.__insTraxForm.getRawValue().frm_dt)
  //     );
  //     __fd.append(
  //       'to_date',
  //       global.getActualVal(this.__insTraxForm.getRawValue().to_dt)
  //     );
  //   }
  //   this.__dbIntr
  //     .api_call(1, '/fd/deliveryUpdateDetailSearch', __fd)
  //     .pipe(pluck('data'))
  //     .subscribe((res: any) => {
  //       console.log(res);
  //       this.__insTrax = new MatTableDataSource(res.data);
  //       this.__paginate = res.links;
  //       this.tableExport(__fd);
  //     });
  // }

  // ngAfterViewInit() {
  //   this.__insTraxForm.controls['is_all_bu_type'].valueChanges.subscribe(
  //     (res) => {
  //       const bu_type: FormArray = this.__insTraxForm.get(
  //         'bu_type'
  //       ) as FormArray;
  //       bu_type.clear();
  //       if (!res) {
  //         this.uncheckAllForBuType();
  //       } else {
  //         this.__bu_type.forEach((__el) => {
  //           bu_type.push(new FormControl(__el.id));
  //         });
  //         this.checkAllForBuType();
  //       }
  //     }
  //   );



  //   this.__insTraxForm.controls['dt_type'].valueChanges.subscribe((res) => {
  //     this.__insTraxForm.controls['frm_dt'].setValue(
  //       res && res != 'R' ? dates.calculateDT(res) : ''
  //     );
  //     this.__insTraxForm.controls['to_dt'].setValue(
  //       res && res != 'R' ? dates.getTodayDate() : ''
  //     );
  //     if (res && res != 'R') {
  //       this.__insTraxForm.controls['frm_dt'].disable();
  //       this.__insTraxForm.controls['to_dt'].disable();
  //     } else {
  //       this.__insTraxForm.controls['frm_dt'].enable();
  //       this.__insTraxForm.controls['to_dt'].enable();
  //     }
  //   });

  //   this.__insTraxForm.controls['date_status'].valueChanges.subscribe((res) => {
  //     this.__insTraxForm.controls['start_date'].setValue(
  //       res == 'T' ? this.getTodayDate() : ''
  //     );
  //     this.__insTraxForm.controls['end_date'].setValue(
  //       res == 'T' ? this.getTodayDate() : ''
  //     );
  //   });
  //   this.__insTraxForm.controls['options'].valueChanges.subscribe((res) => {
  //     if (res != '3') {
  //       this.setColumns(res);
  //     }
  //   });
  //   this.toppings.valueChanges.subscribe((res) => {
  //     const clm = ['edit', 'delete'];
  //     this.__columns = res;
  //     this.__exportedClmns = res.filter((item) => !clm.includes(item));
  //   });

  //   // EUIN NUMBER SEARCH
  //   this.__insTraxForm.controls['euin_no'].valueChanges
  //     .pipe(
  //       tap(() => (this.__isEuinPending = true)),
  //       debounceTime(200),
  //       distinctUntilChanged(),
  //       switchMap((dt) =>
  //         dt?.length > 1 ? this.__dbIntr.searchItems('/employee', dt) : []
  //       ),
  //       map((x: responseDT) => x.data)
  //     )
  //     .subscribe({
  //       next: (value) => {
  //         console.log(value);
  //         this.__euinMst = value;
  //         this.searchResultVisibility('block');
  //         this.__isEuinPending = false;
  //       },
  //       complete: () => console.log(''),
  //       error: (err) => {
  //         this.__isEuinPending = false;
  //       },
  //     });

  //   /**change Event of sub Broker Arn Number */
  //   this.__insTraxForm.controls['sub_brk_cd'].valueChanges
  //     .pipe(
  //       tap(() => (this.__isSubArnPending = true)),
  //       debounceTime(200),
  //       distinctUntilChanged(),
  //       switchMap((dt) =>
  //         dt?.length > 1 ? this.__dbIntr.searchItems('/showsubbroker', dt) : []
  //       ),
  //       map((x: responseDT) => x.data)
  //     )
  //     .subscribe({
  //       next: (value) => {
  //         console.log('sasa');

  //         this.__subbrkArnMst = value;
  //         this.searchResultVisibilityForSubBrk('block');
  //         this.__isSubArnPending = false;
  //       },
  //       complete: () => console.log(''),
  //       error: (err) => {
  //         this.__isSubArnPending = false;
  //       },
  //     });

  //   this.__insTraxForm.controls['investor_code'].valueChanges
  //     .pipe(
  //       tap(() => (this.__isClientPending = true)),
  //       debounceTime(200),
  //       distinctUntilChanged(),
  //       switchMap((dt) =>
  //         dt?.length > 1 ? this.__dbIntr.searchItems('/client', dt) : []
  //       ),
  //       map((x: any) => x.data)
  //     )
  //     .subscribe({
  //       next: (value) => {
  //         this.__clientMst = value.data;
  //         this.searchResultVisibilityForClient('block');
  //         this.__isClientPending = false;
  //       },
  //       complete: () => console.log(''),
  //       error: (err) => {
  //         this.__isClientPending = false;
  //       },
  //     });

  //   /*** Product Type Change */
  //   this.__insTraxForm.controls['comp_type_id'].valueChanges.subscribe(
  //     (res) => {
  //       this.getSchemeMst(this.__insTraxForm.get('company_id').value, res);
  //     }
  //   );
  //   /*** END */

  //   /*** Comapny Change */
  //   this.__insTraxForm.controls['company_id'].valueChanges.subscribe((res) => {
  //     this.getSchemeMst(res, this.__insTraxForm.get('comp_type_id').value);
  //   });
  //   /*** END */
  // }

  // outsideClick(__ev) {
  //   if (__ev) {
  //     this.__isEuinPending = false;
  //     this.searchResultVisibility('none');
  //   }
  // }
  // searchResultVisibility(display_mode) {
  //   this.__searchRlt.nativeElement.style.display = display_mode;
  // }
  // searchInsurance() {
  //   this.getFDMstRPT(
  //     this.__sortAscOrDsc.active,
  //     this.__sortAscOrDsc.direction
  //   );
  // }


  // uncheckAllForBuType() {
  //   this.__buTypeChecked.forEach((element: any) => {
  //     element.checked = false;
  //   });
  // }
  // checkAllForBuType() {
  //   this.__buTypeChecked.forEach((element: any) => {
  //     element.checked = true;
  //   });
  // }

  // fullScreen() {
  //   this.dialogRef.removePanelClass('mat_dialog');
  //   this.dialogRef.addPanelClass('full_screen');
  //   this.dialogRef.updatePosition({ top: '0px' });
  //   this.__isVisible = !this.__isVisible;
  // }
  // minimize() {
  //   this.dialogRef.removePanelClass('mat_dialog');
  //   this.dialogRef.removePanelClass('full_screen');
  //   this.dialogRef.updateSize('40%', '55px');
  //   this.dialogRef.updatePosition({
  //     bottom: '0px',
  //     right: this.data.right + 'px',
  //   });
  // }
  // maximize() {
  //   this.dialogRef.removePanelClass('full_screen');
  //   this.dialogRef.addPanelClass('mat_dialog');
  //   this.dialogRef.updatePosition({ top: '0px' });
  //   this.__isVisible = !this.__isVisible;
  // }
  // getTodayDate() {
  //   return dates.getTodayDate();
  // }
  // getval(__paginate) {
  //    this.__pageNumber.setValue(__paginate.toString());
  //   this.searchInsurance();
  // }
  // getPaginate(__paginate: any | null = null) {
  //   if (__paginate) {
  //     this.__dbIntr
  //       .getpaginationData(
  //         __paginate.url +
  //           ('&paginate=' + this.__pageNumber) +
  //           ('&option=' + this.__insTraxForm.value.options) +
  //           +('&company_id=' + this.__insTraxForm.value.filter_type == 'A'
  //           ? JSON.stringify(this.__insTraxForm.value.company_id)
  //           : '[]')
  //           +('&comp_type_id=' + this.__insTraxForm.value.filter_type == 'A'
  //           ? JSON.stringify(this.__insTraxForm.value.comp_type_id)
  //           : '[]')
  //           +('&scheme_id=' + this.__insTraxForm.value.filter_type == 'A'
  //           ? JSON.stringify(this.__insTraxForm.value.scheme_id)
  //           : '[]')
  //           +
  //           ('&column_name=' + this.__sortAscOrDsc.active
  //             ? this.__sortAscOrDsc.active
  //             : '') +
  //           ('&sort_by=' + this.__sortAscOrDsc.direction
  //             ? this.__sortAscOrDsc.direction
  //             : '') +
  //           ('&tin_no=' + this.__insTraxForm.value.options == '3'
  //             ? ''
  //             : global.getActualVal(this.__insTraxForm.value.tin_no)) +
  //           ('&euin_no=' + this.__insTraxForm.value.options == '3'
  //             ? ''
  //             : global.getActualVal(this.__insTraxForm.value.euin_no)) +
  //           ('&bu_type' + this.__insTraxForm.value.options == '3'
  //             ? '[]'
  //             : this.__insTraxForm.value.bu_type.length > 0
  //             ? JSON.stringify(this.__insTraxForm.value.bu_type)
  //             : '') +
  //           ('&date_status=' + this.__insTraxForm.value.options == '3'
  //             ? global.getActualVal(this.__insTraxForm.value.date_status)
  //             : '') +
  //           ('&start_date=' + this.__insTraxForm.value.options == '3'
  //             ? global.getActualVal(this.__insTraxForm.value.start_date)
  //             : '') +
  //           ('&end_date=' + this.__insTraxForm.value.options == '3'
  //             ? global.getActualVal(this.__insTraxForm.value.end_date)
  //             : '') +
  //           ('&login_status=' + this.__insTraxForm.value.options == '3'
  //             ? global.getActualVal(this.__insTraxForm.value.login_status)
  //             : '') +
  //           ('&investor_name=' + this.__insTraxForm.value.options == '3'
  //             ? ''
  //             : global.getActualVal(this.__insTraxForm.value.investor_code)) +
  //           ('&from_date=' + this.__insTraxForm.value.options == '3'
  //             ? ''
  //             : global.getActualVal(this.__insTraxForm.getRawValue().frm_dt)) +
  //           ('&to_date=' + this.__insTraxForm.value.options == '3'
  //             ? ''
  //             : global.getActualVal(this.__insTraxForm.getRawValue().to_dt))
  //       )
  //       .pipe(map((x: any) => x.data))
  //       .subscribe((res: any) => {
  //         this.__insTrax = new MatTableDataSource(res);
  //       });
  //   } else {
  //   }
  // }
  // onbuTypeChange(e: any) {
  //   const bu_type: FormArray = this.__insTraxForm.get('bu_type') as FormArray;
  //   if (e.checked) {
  //     bu_type.push(new FormControl(e.source.value));
  //   } else {
  //     let i: number = 0;
  //     bu_type.controls.forEach((item: any) => {
  //       if (item.value == e.source.value) {
  //         bu_type.removeAt(i);
  //         return;
  //       }
  //       i++;
  //     });
  //   }
  //   this.__insTraxForm.get('is_all_bu_type').setValue(
  //     bu_type.controls.length == 3 ? true : false,
  //     {emitEvent:false}
  //   );

  // }
  // sortData(__ev) {
  //   this.__sortAscOrDsc = __ev;
  //   this.searchInsurance();
  // }
  // getModeOfPremium(premium) {
  //   return premium
  //     ? this.__mode_of_premium.filter((x: any) => (x.id = premium))[0].name
  //     : '';
  // }

  exportPdf() {
      this.__Rpt.downloadReport(
        '#FDC',
        {
          title: 'FD Certificate Delivery Report',
        },
        'FD Certificate Delivery Report'
      );
  }

  // outsideClickforSubBrkArn(__ev) {
  //   if (__ev) {
  //     this.searchResultVisibilityForSubBrk('none');
  //   }
  // }
  // /** Search Result Off against Sub Broker */
  // searchResultVisibilityForSubBrk(display_mode) {
  //   this.__subBrkArn.nativeElement.style.display = display_mode;
  // }
  // refresh() {
  //   // this.__insTraxForm.reset({ emitEvent: false });
  //   this.__insTraxForm.patchValue({
  //     options: '2',
  //     start_date: this.getTodayDate(),
  //     end_date: this.getTodayDate(),
  //     date_status: 'T',
  //     dt_type: '',
  //     login_status: 'N',
  //   });
  //   this.__insTraxForm.controls['company_id'].reset([],{emitEvent: false});
  //   this.__insTraxForm.controls['comp_type_id'].reset([],{emitEvent: false});
  //   this.__insTraxForm.controls['scheme_id'].reset([],{emitEvent: false});
  //   (<FormArray>this.__insTraxForm.get('bu_type')).clear();
  //   this.__insTraxForm.controls['investor_code'].reset('', {
  //     emitEvent: false,
  //   });
  //   this.__insTraxForm.controls['sub_brk_cd'].reset('', { emitEvent: false });
  //   this.__insTraxForm.controls['euin_no'].reset('', { emitEvent: false });
  //   this.uncheckAllForBuType();
  //   this.__sortAscOrDsc = { active: '', direction: 'asc' };
  //   this.searchInsurance();
  // }

  // getItems(__items, __mode) {
  //   console.log(__items);
  //   switch (__mode) {
  //     case 'C':
  //       this.__insTraxForm.controls['investor_code'].reset(
  //         __items.client_name,
  //         { emitEvent: false }
  //       );
  //       this.searchResultVisibilityForClient('none');
  //       break;
  //     case 'E':
  //       this.__insTraxForm.controls['euin_no'].reset(__items.emp_name, {

  //         emitEvent: false,
  //       });
  //       this.searchResultVisibility('none');
  //       break;
  //     case 'T':
  //       // this.__insTraxForm.controls['temp_tin_no'].reset(__items.temp_tin_no,{ onlySelf: true, emitEvent: false });
  //       // this.searchResultVisibilityForTempTin('none');
  //       break;
  //     case 'S':
  //       this.__insTraxForm.controls['sub_brk_cd'].reset(__items.code, {
  //         emitEvent: false,
  //       });
  //       this.searchResultVisibilityForSubBrk('none');
  //       break;
  //   }
  // }
  // outsideClickforClient(__ev) {
  //   if (__ev) {
  //     this.searchResultVisibilityForClient('none');
  //   }
  // }
  // searchResultVisibilityForClient(display_mode) {
  //   this.__clientCode.nativeElement.style.display = display_mode;
  // }
  // AdvanceFilter() {
  //   this.getCompanyMst();
  //   this.getCompanyTypeMst();
  // }
  // getCompanyMst() {
  //   this.__dbIntr
  //     .api_call(0, '/fd/company', null)
  //     .pipe(pluck('data'))
  //     .subscribe((res: fdComp[]) => {
  //       this.__compMst = res;
  //     });
  // }
  // getCompanyTypeMst() {
  //   this.__dbIntr
  //     .api_call(0, '/fd/companyType', null)
  //     .pipe(pluck('data'))
  //     .subscribe(res => {
  //       this.__compTypeMst = res;
  //     });
  // }
  // getSchemeMst(__comp_id, __prod_type_id) {
  //   console.log(__comp_id);

  //   if (__comp_id.length > 0 && __prod_type_id.length > 0) {

  //     const __fd = new FormData();
  //     __fd.append(
  //       'company_id',
  //       JSON.stringify(this.__insTraxForm.controls['company_id'].value)
  //     );
  //     __fd.append(
  //       'comp_type_id',
  //       JSON.stringify(this.__insTraxForm.controls['comp_type_id'].value)
  //     );
  //     this.__dbIntr
  //       .api_call(1, '/fd/schemeDetails', __fd)
  //       .pipe(pluck('data'))
  //       .subscribe(res => {
  //         this.__scmMst = res;
  //       });
  //   } else {
  //     this.__insTraxForm.controls['scheme_id'].setValue([], {
  //       emitEvent: false,
  //     });
  //   }
  // }
  // getSub_option(__subOpt){
  //   return subOpt.filter(x => x.id == __subOpt)[0]?.value;
  // }
  // getTDSInfo(__id){
  //   return tdsInfo.filter(x => x.id == __id)[0]?.name
  // }



  ngAfterViewInit() {
   this.__insTraxForm.controls['tin_no'].valueChanges.pipe(
     tap(() => (this.__istemporaryspinner = true)),
     debounceTime(200),
     distinctUntilChanged(),
     switchMap((dt) =>
       dt?.length > 1 ? this.__dbIntr.ReportTINSearch('/fd/fdTraxShow', dt) : []
     ),
     map((x: responseDT) => x.data)
   )
   .subscribe({
     next: (value) => {
       this.__tinMst = value;
       this.searchResultVisibilityForTempTin('block');
       this.__istemporaryspinner = false;
     },
     complete: () => console.log(''),
     error: (err) => {
       this.__istemporaryspinner = false;
     },
   });

   this.__insTraxForm.controls['dt_type'].valueChanges.subscribe((res) => {
     this.__insTraxForm.controls['date_range'].reset(
       res && res != 'R' ? ([new Date(dates.calculateDT(res)),new Date(dates.getTodayDate())]) : ''
     );
     this.__insTraxForm.controls['frm_dt'].reset(
       res && res != 'R' ? dates.calculateDT(res) : ''
     );
     this.__insTraxForm.controls['to_dt'].reset(
       res && res != 'R' ? dates.getTodayDate() : ''
     );
     if (res && res != 'R') {
       this.__insTraxForm.controls['date_range'].disable();
     } else {
       this.__insTraxForm.controls['date_range'].enable();
     }
   });

   this.__insTraxForm.controls['options'].valueChanges.subscribe((res) => {
       this.setColumns(res);
   });
   // EUIN NUMBER SEARCH
   /**change Event of sub Broker Arn Number */

   this.__insTraxForm.controls['investor_name'].valueChanges
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
         this.__insTraxForm.controls['investor_code'].reset('',{ emitEvent: false });
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
       this.getCompanyMst(res);
     }
   );
   /*** END */

   // /*** Comapny Change */
   this.__insTraxForm.controls['company_id'].valueChanges.subscribe((res) => {
     this.getSchemeMst(res,this.__insTraxForm.get('comp_type_id').value);
   });
   // /*** END */

 this.__insTraxForm.controls['brn_cd'].valueChanges.subscribe(res =>{
      this.getBusinessTypeMst(res)
    })
    this.__insTraxForm.controls['bu_type'].valueChanges.subscribe(res =>{
      this.disabledSubBroker(res);
       this.getRelationShipManagerMst(res,this.__insTraxForm.value.brn_cd);
    })
    this.__insTraxForm.controls['rm_id'].valueChanges.subscribe(res =>{
      if(this.__insTraxForm.value.bu_type.findIndex(item => item.bu_code == 'B') != -1){
               this.getSubBrokerMst(res);
      }
      else{
      this.__euinMst.length = 0;
        this.__euinMst = res;
      }
   })
   this.__insTraxForm.controls['sub_brk_cd'].valueChanges.subscribe(res =>{
    // if(res.length > 0){
      this.setEuinDropdown(res,this.__insTraxForm.value.rm_id);
    // }
   })
  }
  setEuinDropdown(sub_brk_cd,rm){
   this.__euinMst = rm.filter(item => !this.__subbrkArnMst.map(item=> {return item['emp_euin_no']}).includes(item.euin_no));
   if(sub_brk_cd.length > 0){
    sub_brk_cd.forEach(element => {
           if(this.__subbrkArnMst.findIndex((el) => element.code == el.code) != -1){
              this.__euinMst.push(
                {
                  euin_no:this.__subbrkArnMst[this.__subbrkArnMst.findIndex((el) => element.code == el.code)].euin_no,
                  emp_name:''
                }
                );
           }
    });
   }
   else{
     this.__euinMst = this.__euinMst.filter(item => !this.__subbrkArnMst.map(item => {return item['euin_no']}).includes(item.euin_no))
   }
  }
  disabledSubBroker(bu_type_ids){
    if(bu_type_ids.findIndex(item => item.bu_code == 'B') != -1){
      this.__insTraxForm.controls['sub_brk_cd'].enable();
    }
    else{
      this.__insTraxForm.controls['sub_brk_cd'].disable();
    }

  }
  getSubBrokerMst(arr_euin_no){
    if(arr_euin_no.length > 0){
    this.__dbIntr.api_call(0,'/subbroker',
    'arr_euin_no='+ JSON.stringify(arr_euin_no.map(item => {return item['euin_no']})))
    .pipe(pluck("data")).subscribe((res: any) =>{
      this.__subbrkArnMst = res.map(({code,bro_name,emp_euin_no,euin_no}) => ({
      code,
      emp_euin_no,
      euin_no,
      bro_name:bro_name +'-'+code
      })
      );
    })
  }
  else{
    this.__subbrkArnMst.length =0;
    this.__insTraxForm.controls['sub_brk_cd'].setValue([]);
  }

  }
  getBusinessTypeMst(brn_cd){
    if(brn_cd.length > 0){
    this.__dbIntr
    .api_call(0,'/businessType','arr_branch_id='+JSON.stringify(brn_cd.map(item => {return item['id']})))
    .pipe(pluck("data")).subscribe(res =>{
            this.__bu_type = res;
    })
  }
  else{
    this.__insTraxForm.controls['bu_type'].reset([],{emitEvent:true});
    this.__bu_type.length = 0;
  }
  }
  getRelationShipManagerMst(bu_type_id,arr_branch_id){
    if(bu_type_id.length > 0 && arr_branch_id.length > 0){
    this.__dbIntr.api_call(0,'/employee',
    'arr_bu_type_id='+ JSON.stringify(bu_type_id.map(item => {return item['bu_code']}))
    +'&arr_branch_id=' + JSON.stringify(arr_branch_id.map(item  => {return item['id']}))
    ).pipe(pluck("data"))
    .subscribe(res =>{
         this.__rmMst = res;
         console.log(this.__rmMst);

    })
  }
  else{
    this.__rmMst.length =0;
    this.__insTraxForm.controls['rm_id'].reset([]);
  }
  }

 getCompanyMst(arr_comp_type_id) {
  this.__dbIntr
    .api_call(0, '/fd/company', 'arr_cmp_type_id='+JSON.stringify(arr_comp_type_id.map(item => {return item['id']})))
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
getSchemeMst(__comp_id,arr_comp_type_id) {

  if (__comp_id.length > 0) {
    this.__dbIntr
      .api_call(0, '/fd/scheme',
      'arr_company_id='+ JSON.stringify(__comp_id.map(item => {return item['id']}))
      + '&arr_comp_type_id=' + JSON.stringify(arr_comp_type_id.map(item => {return item['id']}))
      )
      .pipe(pluck('data'))
      .subscribe(res => {
        this.__scmMst = res;
      });
  } else {
    this.__insTraxForm.controls['scheme_id'].setValue([], {emitEvent: false,});
    this.__scmMst.length = 0;
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
  searchInsurance(){
   this.getFDMstRPT();
  }
  onItemClick(el){
       if(el.option.value == 'A'){
        //Advance
           this.getBranchMst();
      }
       else{
        //Reset;
        this.reset()
       }
  }
  reset(){
    this.__rmMst.length = 0;
    this.__subbrkArnMst.length = 0;
    this.__euinMst.length = 0;
    this.__bu_type.length = 0;
    this. __insTraxForm.patchValue({
      options:'2',
      frm_dt:'',
      to_dt:'',
      dt_type: '',
      date_range: '',
      investor_code:''
    });
      this.__insTraxForm.get('sub_brk_cd').reset([],{emitEvent:false});
      this.__insTraxForm.get('brn_cd').reset([],{emitEvent:false});
      this.__insTraxForm.get('euin_no').reset([],{emitEvent:false});
      this.__insTraxForm.get('bu_type').reset([],{emitEvent:false});
      this.__insTraxForm.get('rm_id').reset([],{emitEvent:false});
      this.__insTraxForm.get('tin_no').reset('',{emitEvent:false});
      this.__insTraxForm.get('investor_name').reset('',{emitEvent:false});
      this.__insTraxForm.get('comp_type_id').reset([],{emitEvent:true});
      this.__pageNumber = '10';
      this.sort =new sort();
      this.searchInsurance();
   }
  getFDMstRPT() {
    const __fd = new FormData();
    __fd.append('paginate', this.__pageNumber);
    __fd.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
    __fd.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
    if(this.__insTraxForm.value.options == 2 || this.__insTraxForm.value.options == 1){
      __fd.append('from_date',global.getActualVal(this.__insTraxForm.getRawValue().frm_dt));
      __fd.append('to_date',global.getActualVal(this.__insTraxForm.getRawValue().to_dt));
      __fd.append('tin_no',global.getActualVal(this.__insTraxForm.value.tin_no));
      __fd.append('investor_code',global.getActualVal(this.__insTraxForm.value.investor_code));
      __fd.append('company_id', JSON.stringify(this.__insTraxForm.value.company_id.map(item => {return item['id']})));
      __fd.append('comp_type_id',JSON.stringify(this.__insTraxForm.value.comp_type_id.map(item => {return item['id']})));
      __fd.append('scheme_id', JSON.stringify(this.__insTraxForm.value.scheme_id.map(item => {return item['id']})));
      if(this.__insTraxForm.value.btn_type == 'A'){
      __fd.append('brn_cd', JSON.stringify(this.__insTraxForm.value.brn_cd.map(item => {return item['id']})));
      __fd.append('bu_type', JSON.stringify(this.__insTraxForm.value.bu_type.map(item => {return item['bu_code']})));
      __fd.append('rm_id', JSON.stringify(this.__insTraxForm.value.rm_id.map(item => {return item['euin_no']})));
      __fd.append('sub_brk_cd', JSON.stringify(this.__insTraxForm.value.sub_brk_cd.map(item => {return item['code']})));
      __fd.append('euin_no', JSON.stringify(this.__insTraxForm.value.euin_no.map(item => {return item['euin_no']})));
      }
    }
    this.__dbIntr
      .api_call(1, '/fd/deliveryUpdateDetailSearch', __fd)
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
      .api_call(1, '/fd/deliveryUpdateExport', formData)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__exportTrax = new MatTableDataSource(res);
      });
  }

  getBranchMst(){
    this.__dbIntr.api_call(0,'/branch',null).pipe(pluck("data")).subscribe(res =>{
        this.__brnchMst = res
    })
  }
  close(ev){
    this.__insTraxForm.patchValue({
      frm_dt: this.__insTraxForm.getRawValue().date_range ? dates.getDateAfterChoose(this.__insTraxForm.getRawValue().date_range[0]) : '',
      to_dt: this.__insTraxForm.getRawValue().date_range ? (global.getActualVal(this.__insTraxForm.getRawValue().date_range[1]) ?  dates.getDateAfterChoose(this.__insTraxForm.getRawValue().date_range[1]) : '') : ''
    });
  }
  getItems(__items, __mode) {
    switch (__mode) {
      case 'C':
        this.__insTraxForm.controls['investor_name'].reset(__items.client_name,{ emitEvent: false });
        this.__insTraxForm.controls['investor_code'].reset(__items.id,{ emitEvent: false });
        this.searchResultVisibilityForClient('none');
        break;
      case 'T':
        this.__insTraxForm.controls['tin_no'].reset(__items.tin_no,{ onlySelf: true, emitEvent: false });
        this.searchResultVisibilityForTempTin('none');
        break;
    }
  }
  searchResultVisibilityForTempTin(display_mode){
    this.displayMode_forTemp_Tin = display_mode;
  }
  searchResultVisibilityForClient(display_mode) {
    this.displayMode_forClient = display_mode;
  }
  getSelectedItemsFromParent(ev){
    this.getItems(ev.item, ev.flag);
  }
  customSort(ev){
    this.sort.field =ev.sortField;
    this.sort.order =ev.sortOrder;
    if(ev.sortField){
      this.getFDMstRPT();
    }

  }
  setColumns(options) {

    const clmToRemove = ['collected_from_comp','delivery_by','received_by','app_form_scan'];
    this.__columns = this.clmList.filter(item => item.isVisible.includes(Number(options)));
    this.__exportedClmns = this.__columns.filter(x => !clmToRemove.includes(x.field)).map(item => {return item['field']})
    this.SelectedClms = this.__columns.map(item => {return item['field']});
  }
  onSelectItem(itemPerpage){
    this.__pageNumber = itemPerpage;
    this.getFDMstRPT();
 }
 getPaginate(__paginate: any | null = null) {
  if(__paginate.url){
    this.__dbIntr
     .getpaginationData(
       __paginate.url +
         ('&paginate=' + this.__pageNumber) +
         ('&option=' + this.__insTraxForm.value.options) +
        (
         ('&from_date=' + global.getActualVal(this.__insTraxForm.getRawValue().frm_dt)) +
         ('&to_date=' + global.getActualVal(this.__insTraxForm.getRawValue().to_dt)) +
         ('&tin_no=' + global.getActualVal(this.__insTraxForm.value.tin_no)) +
         ('&investor_code=' + global.getActualVal(this.__insTraxForm.value.investor_code)) +
         ('&company_id=' + (JSON.stringify(this.__insTraxForm.value.company_id.map(item => {return item['id']})))) +
         ('&comp_type_id=' + (JSON.stringify(this.__insTraxForm.value.comp_type_id.map(item => {return item['id']})))) +
         ('&scheme_id=' + (JSON.stringify(this.__insTraxForm.value.scheme_id.map(item => {return item['id']}))))
          +
          (
           this.__insTraxForm.value.btn_type == 'A' ?
           (
             ('&brn_cd=' + (JSON.stringify(this.__insTraxForm.value.brn_cd.map(item => {return item['id']})))) +
             ('&rm_id=' + (JSON.stringify(this.__insTraxForm.value.rm_id.map(item => {return item['euin_no']})))) +
             ('&sub_brk_cd=' + (JSON.stringify(this.__insTraxForm.value.sub_brk_cd.map(item => {return item['code']})))) +
             ('&euin_no=' + (JSON.stringify(this.__insTraxForm.value.euin_no.map(item => {return item['euin_no']})))) +
             ('&bu_type=' + (JSON.stringify(this.__insTraxForm.value.bu_type.map(item => {return item['bu_code']}))))

           )
           :
           ''
         )))
     .pipe(map((x: any) => x.data))
     .subscribe((res: any) => {
       this.__insTrax = new MatTableDataSource(res.data);
       this.__paginate = res.links;
     });
 }
}
DocumentView(FdDtls){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = true;
  dialogConfig.width = '80%';
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.data = {
    title: 'Uploaded Scan Copy',
    data: FdDtls,
    copy_url:`${environment.app_formUrl_fd + FdDtls.app_form_scan}`,
    src:this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.app_formUrl + FdDtls.app_form_scan}`)
  };
  const dialogref = this.__dialog.open(PreviewDocumentComponent, dialogConfig);
}
getSelectedColumns(columns){
  const clm = ['collected_from_comp','delivery_by','received_by','app_form_scan'];
  this.__columns = columns.map(({ field, header }) => ({field, header}));
  this.__exportedClmns = this.__columns.filter((x: any) => !clm.includes(x.field)).map((x: any) => x.field);
}
}
