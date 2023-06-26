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
import { rnt } from 'src/app/__Model/Rnt';
import { category } from 'src/app/__Model/__category';
import { responseDT } from 'src/app/__Model/__responseDT';
import { subcat } from 'src/app/__Model/__subcategory';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
// import buType from '../../../../../../../../../../../assets/json/buisnessType.json';
import { FinmodificationComponent } from '../financialModification/finModification.component';
import { client } from 'src/app/__Model/__clientMst';
import { amc } from 'src/app/__Model/amc';
import { global } from 'src/app/__Utility/globalFunc';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { mfFinClmns } from 'src/app/__Utility/MFColumns/finClmns';
import { scheme } from 'src/app/__Model/__schemeMst';
import { environment } from 'src/environments/environment';
import { PreviewDocumentComponent } from 'src/app/shared/core/preview-document/preview-document.component';
import { DomSanitizer } from '@angular/platform-browser';
import popupMenu from '../../../../../../../../../../../assets/json/Master/daySheetOpt.json'
import { sort } from 'src/app/__Model/sort';
import itemsPerPage from '../../../../../../../../../../../assets/json/itemsPerPage.json';

type selectBtn ={
  label:string,
  value:string,
  icon:string
}

@Component({
  selector: 'finRPT-component',
  templateUrl: './finRPT.component.html',
  styleUrls: ['./finRPT.component.css'],
})
export class FinrptComponent implements OnInit {
  selectBtn:selectBtn[] = [{ label: 'Advance Filter', value: 'A',icon:'pi pi-filter' }, { label: 'Reset', value: 'R',icon:'pi pi-refresh' }]
  itemsPerPage:selectBtn[] = itemsPerPage;

  daysheetpopupMenu = popupMenu;
  settingsforAMCDropdown = this.__utility.settingsfroMultiselectDropdown('id','amc_short_name','Search AMC',1);
  settingsforSchemeDropdown = this.__utility.settingsfroMultiselectDropdown('id','scheme_name','Search Scheme',1);
  settingsforBrnchDropdown = this.__utility.settingsfroMultiselectDropdown('id','brn_name','Search Branch',1);
  settingsforBuTypeDropdown = this.__utility.settingsfroMultiselectDropdown('id','bu_type','Search Business Type',1);
  settingsforRMDropdown = this.__utility.settingsfroMultiselectDropdown('id','rm_name','Search Relationship Manager',1);
  settingsforSubBrkDropdown = this.__utility.settingsfroMultiselectDropdown('id','sub_brk_cd','Search Sub Broker',1);
  settingsforEuinDropdown = this.__utility.settingsfroMultiselectDropdown('id','emp_name','Search Employee',1);
   isOpenMegaMenu = false;
  @ViewChild('searchTin') __searchTin: ElementRef;
  @ViewChild('clientCd') __clientCode: ElementRef;
  __isTinspinner: boolean = false;
  __isClientPending: boolean = false;
  selectRNT: any;
  printPdfClm: any = [];
  tinMst: any = [];
  __clientMst: client[] = [];
  __subbrkArnMst: any = [];
  __euinMst: any = [];
  __schemeMst: scheme[] = [];
  __branchMst: any = [];
  __RmMst: any = [];
  sort = new sort();
  WindowObject: any;
  divToPrint: any;
  SelectedClms: any= [];
  clmList: any = []
  __category: category[];
  __subCat: subcat[];
  __bu_type: any = [];
  __rcvForms = new FormGroup({
    date_range: new FormControl(''),
    btnType: new FormControl('R'),
    is_all_rnt: new FormControl(false),
    options: new FormControl('2'),
    sub_brk_cd: new FormControl([]),
    tin_no: new FormControl(''),
    client_name: new FormControl(''),
    client_code: new FormControl(''),
    amc_name: new FormControl([],{updateOn:'blur'}),
    scheme_name: new FormControl([],{updateOn:'blur'}),
    euin_no: new FormControl([]),
    brn_cd: new FormControl([],{updateOn:'blur'}),
    bu_type: new FormControl([],{updateOn:'blur'}),
    rm_name: new FormControl([],{updateOn:'blur'}),
    rnt_name: new FormArray([]),
    date_status: new FormControl('T'),
    start_date: new FormControl(this.getTodayDate()),
    end_date: new FormControl(this.getTodayDate()),
    login_status: new FormControl('N'),
    dt_type: new FormControl(''),
    frm_dt: new FormControl(''),
    to_dt: new FormControl(''),
    trans_id: new FormControl('')
  });
  amcMst: amc[] = [];
  __isVisible: boolean = true;
  __paginate: any = [];
  __pageNumber = new FormControl('10');
  __export = new MatTableDataSource<any>([]);
  __exportedClmns: any = [];
  __financMst = new MatTableDataSource<any>([]);
  __columns = [];
  __trans_types: any;

  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private __dialog: MatDialog,
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<FinrptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) {}

  get rnt_name(): FormArray{
    return this.__rcvForms.get('rnt_name') as FormArray;
  }

  /** Return formgroup inside formArray */
  setRntForm(rnt: rnt) {
    return new FormGroup({
      id: new FormControl(rnt ? rnt?.id : ''),
      name: new FormControl(rnt ? rnt?.rnt_name : ''),
      isChecked: new FormControl(false),
    });
  }
  /** End */
  ngAfterViewInit() {
    this.__rcvForms.controls['dt_type'].valueChanges.subscribe((res) => {
      this.__rcvForms.controls['date_range'].reset(
        res && res != 'R' ? ([new Date(dates.calculateDT(res)),new Date(dates.getTodayDate())]) : ''
      );
      this.__rcvForms.controls['frm_dt'].reset(
        res && res != 'R' ? dates.calculateDT(res) : ''
      );
      this.__rcvForms.controls['to_dt'].reset(
        res && res != 'R' ? dates.getTodayDate() : ''
      );
      if (res && res != 'R') {
        this.__rcvForms.controls['date_range'].disable();
      } else {
        this.__rcvForms.controls['date_range'].enable();
      }
    });

    /***** Event Trigger on Change AMC */
    this.__rcvForms.controls['amc_name'].valueChanges.subscribe(res =>{
      if(res){
        this.getSchemeAccordingToAMC(res);
      }
      else{
        this.__rcvForms.controls['scheme_name'].setValue([]);
      }
    })
    /***** End */


    /** Client Code Change */
    this.__rcvForms.controls['client_name'].valueChanges
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

        /** Change event occur when all rnt checkbox has been changed  */
        this.__rcvForms.controls['is_all_rnt'].valueChanges.subscribe(res =>{
          this.rnt_name.controls.map(item => {return item.get('isChecked').setValue(res,{emitEvent:false})});
        })
        /** End */

        /** Change event inside the formArray */
        this.rnt_name.valueChanges.subscribe(res =>{
        this.__rcvForms.controls['is_all_rnt'].setValue(res.every(item => item.isChecked),{emitEvent:false});
        })
        /*** End */

    this.__rcvForms.controls['date_status'].valueChanges.subscribe((res) => {
      if (res == 'T') {
        this.__rcvForms.controls['start_date'].setValue('');
        this.__rcvForms.controls['end_date'].setValue('');
      } else {
        this.__rcvForms.controls['start_date'].setValue(this.getTodayDate());
        this.__rcvForms.controls['end_date'].setValue(this.getTodayDate());
      }
    });
    this.__rcvForms.controls['options'].valueChanges.subscribe((res) => {
      this.setColumns(res,this.__rcvForms.controls['trans_id'].value);
    });

    this.__rcvForms.controls['brn_cd'].valueChanges.subscribe(res =>{
      this.getBusinessTypeMst(res)
    })
    this.__rcvForms.controls['bu_type'].valueChanges.subscribe(res =>{

    })
  }
  getBusinessTypeMst(brn_cd){
    this.__dbIntr
    .api_call(0,'/businessType','arr_branch_id='+JSON.stringify(brn_cd.map(item => {return item['id']})))
    .pipe(pluck("data")).subscribe(res =>{
            this.__bu_type = res;
    })
  }
  getRelationShipManagerMst(bu_type_id){
    // this.__dbIntr.api_call(0,'/relationShipManager','arr_bu_type_id='+ JSON.stringify())

  }
  ngOnInit() {
    this.getTransactionTypeDtls();
    this.getRnt();
    this.getAMC();
    this.setColumns(this.__rcvForms.controls['options'].value,this.__rcvForms.controls['trans_id'].value);
  }


  getAMC(){
    this.__dbIntr.api_call(0,'/amc',null).pipe(pluck("data")).subscribe((res: amc[]) =>{
           this.amcMst = res;
    })
  }
  getSchemeAccordingToAMC(amc){
    this.__dbIntr.api_call(0,'/scheme','arr_amc_id='+JSON.stringify(amc.map(item => {return item["id"]}))).pipe(pluck("data")).subscribe((res: scheme[]) =>{
      this.__schemeMst = res;
})

  }

  setColumns(options,trans_id){
    const clmToRemove = ['edit','app_frm_view'];
    const clmToRemoveForPIP = ['sip_type_name','scheme_name_to','sip_frequency','sip_date','sip_start_date','sip_end_date','sip_amount']
    const clmToRemoveForSIP = ['scheme_name_to'];
    const clmToRemoveForSwitch = ['sip_type_name','sip_frequency','sip_date','sip_start_date','sip_end_date','sip_amount'];
    this.clmList = trans_id == 3 ?
    mfFinClmns.COLUMN_SELECTOR.filter(x => !clmToRemoveForSwitch.includes(x.field))
    : (trans_id == 2 ?
      mfFinClmns.COLUMN_SELECTOR.filter(x => !clmToRemoveForSIP.includes(x.field))
    : mfFinClmns.COLUMN_SELECTOR.filter(x => !clmToRemoveForPIP.includes(x.field)))
    if(options == 2){
      this.__columns = trans_id == 2 ? mfFinClmns.SUMMARY_COPY_SIP
      : mfFinClmns.SUMMARY_COPY;
    }
    else if(options == 3){
      this.__columns = trans_id == 2 ? mfFinClmns.SUMMARY_COPY_SIP.filter(x => (x.field!='edit' && x.field!='app_frm_view')) : mfFinClmns.SUMMARY_COPY.filter(x => (x.field!='edit' && x.field!='app_frm_view'));
    }
    else{
      this.__columns =  trans_id == 3
         ? mfFinClmns.DETAILS_FOR_SWITCH_COLUMNS_COPY
         :  (trans_id == 1 ? mfFinClmns.DETAILS_FOR_PIP_COLUMNS_COPY
          : mfFinClmns.DETAILS_FOR_SIP_COLUMNS_COPY)
    }
    this.printPdfClm = trans_id == 2 ? mfFinClmns.SUMMARY_COPY_SIP.filter(x => (x.field!='edit' && x.field!='app_frm_view')) : mfFinClmns.SUMMARY_COPY.filter(x => (x.field!='edit' && x.field!='app_frm_view'));
    this.SelectedClms = this.__columns.map((x) => x.field);
    this.__exportedClmns = this.__columns.filter((x: any) => !clmToRemove.includes(x.field)).map((x: any) => x.field);
  }
  getFinRPT(column_name: string | null = '', sort_by: string | null | '' = '') {
    const __mfTrax = new FormData();
    __mfTrax.append('paginate', this.__pageNumber.value);
    __mfTrax.append('option', this.__rcvForms.value.options);
    __mfTrax.append(
      'trans_id',
      this.__rcvForms.value.trans_id
        ? this.__rcvForms.value.trans_id
        : ''
    );

    __mfTrax.append('trans_type_id' ,this.data.trans_type_id);
    __mfTrax.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
    __mfTrax.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
    if (this.__rcvForms.get('options').value != '3') {
      __mfTrax.append(
        'from_date',
        this.__rcvForms.getRawValue().frm_dt
          ? this.__rcvForms.getRawValue().frm_dt
          : ''
      );

      __mfTrax.append(
        'to_date',
        this.__rcvForms.getRawValue().to_dt
          ? this.__rcvForms.getRawValue().to_dt
          : ''
      );

      __mfTrax.append(
        'client_code',
        this.__rcvForms.value.client_code
          ? this.__rcvForms.value.client_code
          : ''
      );
      __mfTrax.append(
        'tin_no',
        this.__rcvForms.value.tin_no ? this.__rcvForms.value.tin_no : ''
      );
      __mfTrax.append(
        'amc_name',
        this.__rcvForms.value.amc_name ? JSON.stringify(this.__rcvForms.value.amc_name.map(item => {return item["id"]})) : '[]'
      );
      __mfTrax.append(
        'scheme_name',
        this.__rcvForms.value.scheme_name ? JSON.stringify(this.__rcvForms.value.scheme_name.map(item => {return item["id"]})) : '[]'
      );
 __mfTrax.append(
        'rnt_name',
      JSON.stringify(this.rnt_name.value.filter(x=> x.isChecked).map(item => {return item['id']}))
      );

      if(this.__rcvForms.value.btnType == 'A'){

      __mfTrax.append(
        'sub_brk_cd',
        this.__rcvForms.value.sub_brk_cd ? JSON.stringify(this.__rcvForms.value.sub_brk_cd.map(item => {return item["id"]})) : '[]'
      );
      __mfTrax.append(
        'euin_no',
        this.__rcvForms.value.euin_no ? JSON.stringify(this.__rcvForms.value.euin_no.map(item => {return item["id"]})) : '[]'
      );
      __mfTrax.append(
        'brn_cd',
        this.__rcvForms.value.brn_cd ? JSON.stringify(this.__rcvForms.value.brn_cd.map(item => {return item["id"]})) : '[]'
      );
       __mfTrax.append('rm_id',
       this.__rcvForms.value.rm_name ? JSON.stringify(this.__rcvForms.value.rm_name.map(item => {return item["id"]})) : '[]')

      __mfTrax.append(
        'bu_type',
        this.__rcvForms.value.bu_type
          ? JSON.stringify(this.__rcvForms.value.bu_type.map(item => {return item["id"]}))
          : '[]'
      );
    }
    } else {
      __mfTrax.append('login_status', this.__rcvForms.value.login_status);
      __mfTrax.append('date_status', this.__rcvForms.value.date_status);
      __mfTrax.append('start_date', this.__rcvForms.value.start_date);
      __mfTrax.append('end_date', this.__rcvForms.value.end_date);
    }
   this.__dbIntr
      .api_call(1, '/mfTraxDetailSearch', __mfTrax)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.setPaginator(res);
        this.tableExport(__mfTrax);
      });
  }

  getRnt() {
    this.__dbIntr
      .api_call(0, '/rnt', null)
      .pipe(pluck('data'))
      .subscribe((res: rnt[]) => {
        res.forEach((el: rnt) => {
          this.rnt_name.push(this.setRntForm(el));
        });
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
      .api_call(1, '/mfTraxExport', __mfTrax)
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

  getPaginate(__paginate: any | null = null) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&option=' + this.__rcvForms.value.options) +
            ('&trans_type_id=' + this.data.trans_type_id) +
            ('&field=' + (global.getActualVal(this.sort.field) ? this.sort.field : '')) +
            ('&order=' + (global.getActualVal(this.sort.order) ? this.sort.order : '1')) +
            ('&trans_id=' + this.__rcvForms.value.trans_id) +
            (this.__rcvForms.get('options').value != '3'
              ? '&client_code=' +
                (this.__rcvForms.value.client_code
                  ? this.__rcvForms.value.client_code
                  : '') +
                  ('&rnt_name=' +
                  (this.__rcvForms.value.rnt_name.length > 0
                    ? JSON.stringify(this.rnt_name.value.filter(x=> x.isChecked).map(item => {return item['id']}))
                    : '')) +
                ('&tin_no=' +
                  (this.__rcvForms.value.tin_no
                    ? this.__rcvForms.value.tin_no
                    : '')) +
                ('&amc_name=' +
                  (this.__rcvForms.value.amc_name
                    ? JSON.stringify(this.__rcvForms.value.amc_name.map(item => {return item["id"]}))
                    : '')) +
                ('&scheme_name=' +
                  (this.__rcvForms.value.scheme_name
                    ? JSON.stringify(this.__rcvForms.value.scheme_name.map(item => {return item["id"]}))
                    : '')) +
                (this.__rcvForms.value.btnType == 'A' ?
                ('&sub_brk_cd=' +
                  (this.__rcvForms.value.sub_brk_cd
                    ? JSON.stringify(this.__rcvForms.value.sub_brk_cd.map(item => {return item["id"]}))
                    : '')) +
                (
                  '&rm_id='+
                  (this.__rcvForms.value.rm_id
                    ? JSON.stringify(this.__rcvForms.value.rm_id.map(item => {return item["id"]}))
                    : '[]')
                ) +
                ('&euin_no=' +
                  (this.__rcvForms.value.euin_no
                    ? JSON.stringify(this.__rcvForms.value.euin_no.map(item => {return item["id"]}))
                    : '[]')) +
                ('&brn_cd=' +
                  (this.__rcvForms.value.brn_cd
                    ? JSON.stringify(this.__rcvForms.value.brn_cd.map(item => {return item["id"]}))
                    : '[]')) +

                ('&bu_type' +
                  (this.__rcvForms.value.bu_type
                    ? JSON.stringify(this.__rcvForms.value.bu_type.map(item => {return item["id"]}))
                    : '[]')) : '') +
                ('&from_date=' +
                  (this.__rcvForms.value.options != '3'
                    ? global.getActualVal(this.__rcvForms.getRawValue().frm_dt)
                    : '')) +
                ('&to_date=' +
                  (this.__rcvForms.value.options != '3'
                    ? global.getActualVal(this.__rcvForms.getRawValue().to_dt)
                    : ''))
              : '&login_status=' +
                this.__rcvForms.value.login_status +
                ('&date_status=' + this.__rcvForms.value.date_status) +
                ('&start_date=' + this.__rcvForms.value.start_date) +
                ('&end_date=' + this.__rcvForms.value.end_date))
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res);
        });
    }
  }
  setPaginator(res) {
    this.__financMst = new MatTableDataSource(res.data);
    this.__paginate = res.links;
  }
  populateDT(__element) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '60%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'FIN',
      product_id: this.data.product_id,
      trans_type_id: this.data.trans_type_id,
      id: __element.temp_tin_no ? __element.temp_tin_no : '0',
      title: 'Financial Entry',
      data: __element,
    };
    dialogConfig.id = __element.temp_tin_no ? __element.temp_tin_no : '0';
    try {
      const dialogref = this.__dialog.open(
        FinmodificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt?.id > 0) {
            if (dt.cl_type == 'E') {
            } else {
              // this.updateRow(dt.data);
            }
          } else {
          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('60%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'FIN',
      });
    }
  }
  submit() {
    this.getFinRPT();
  }
  exportPdf() {
      this.__Rpt.downloadReport(
        '#__finRPT',
        {
          title: 'Financial Report',
        },
        'Financial Report  '
      );
  }
  getminDate() {
    return dates.getminDate();
  }
  getTodayDate() {
    return dates.getTodayDate();
  }

  reset() {
    this.__rcvForms.patchValue({
      is_all_rnt: false,
    options: '2',
    tin_no: '',
    client_code: '',
    scheme_name: [],
    date_range:'',
    date_status: 'T',
    start_date: this.getTodayDate(),
    end_date: this.getTodayDate(),
    login_status: 'N',
    dt_type: '',
    frm_dt: '',
    to_dt: '',
    })
    this.sort = new sort();
    this.__rcvForms.get('is_all_rnt').setValue(false);
    this.__rcvForms.get('amc_name').setValue([],{emitEvent:false});
    this.__schemeMst.length = 0;
    this.__pageNumber.setValue('10');
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
  searchResultVisibilityForClient(display_mode) {
    this.__clientCode.nativeElement.style.display = display_mode;
  }
  searchResultVisibilityForTin(display_mode) {
    this.__searchTin.nativeElement.style.display = display_mode;
  }

  getItems(__items, __mode) {
    switch (__mode) {
      case 'C':
        this.__rcvForms.controls['client_name'].reset(__items.client_name, {
          emitEvent: false,
        });
        this.__rcvForms.controls['client_code'].reset(__items.id);
        this.searchResultVisibilityForClient('none');
        break;
      case 'T':
        this.__rcvForms.controls['tin_no'].reset(__items.tin_no, {
          emitEvent: false,
        });
        this.searchResultVisibilityForTin('none');
        break;
    }
  }
  tabChanged(event: MatTabChangeEvent): void {
    this.__rcvForms.patchValue({
      trans_id:(event.index + 1),
    });
    this.submit();
    this.setColumns(this.__rcvForms.controls['options'].value,this.__rcvForms.controls['trans_id'].value);
  }

  getBranchMst(){
    this.__dbIntr.api_call(0,'/branch',null).pipe(pluck("data")).subscribe(res =>{
      this.__branchMst = res;
    })
  }
  getSelectedColumns(columns){
       const clm = ['edit', 'app_frm_view'];
       this.__columns = columns.map(({ field, header }) => ({field, header}));
       this.__exportedClmns = this.__columns.filter((x: any) => !clm.includes(x.field)).map((x: any) => x.field);
      //  this.__columns.filter((x: any) => !clm.includes(x.field)).map((x: any) => x.field);
  }
  DocumentView(element){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.width = '80%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      title: 'Uploaded Scan Copy',
      data: element,
      copy_url:`${environment.app_formUrl + element.app_form_scan}`,
      src:this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.app_formUrl + element.app_form_scan}`)
    };
    const dialogref = this.__dialog.open(PreviewDocumentComponent, dialogConfig);
  }
  submitDaysheetReport(){

  }
  openMenu(event){
   if(event.flag == 'P'){
    this.divToPrint = document.getElementById('FinRPT');
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
   }
  }
  close(ev){
    this.__rcvForms.patchValue({
      frm_dt: this.__rcvForms.getRawValue().date_range ? dates.getDateAfterChoose(this.__rcvForms.getRawValue().date_range[0]) : '',
      to_dt: this.__rcvForms.getRawValue().date_range ? (global.getActualVal(this.__rcvForms.getRawValue().date_range[1]) ?  dates.getDateAfterChoose(this.__rcvForms.getRawValue().date_range[1]) : '') : ''
    });
}
  onItemClick(ev){
    if(ev.option.value == 'A'){
      this.__rcvForms.patchValue({
        brnc_cd:[],
        bu_type:[],
        rm_name:[],
        sub_brk_cd:[],
        euin_no:[]
      });
     this.getBranchMst();
    }
    else{
    this.reset();
    }
  }
  onselectItem(__itemsPerPage) {
    // this.__pageNumber.setValue(__itemsPerPage.option.value);
    this.submit();
  }
  customSort(ev){
    this.sort.field = ev.sortField;
    this.sort.order = ev.sortOrder;
    if(ev.sortField){
    this.submit();
    }
  }
}
