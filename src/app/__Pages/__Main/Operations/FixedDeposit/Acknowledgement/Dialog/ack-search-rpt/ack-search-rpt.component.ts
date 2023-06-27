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
import loggedStatus from '../../../../../../../../assets/json/loginstatus.json'

import { fdComp } from 'src/app/__Model/fdCmp';
import subOpt from '../../../../../../../../assets/json/subOption.json';
import tdsInfo from '../../../../../../../../assets/json/TDSInfo.json'
import { AckEntryComponent } from '../ack-entry/ack-entry.component';
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
  selector: 'app-ack-search-rpt',
  templateUrl: './ack-search-rpt.component.html',
  styleUrls: ['./ack-search-rpt.component.css']
})
export class AckSearchRPTComponent implements OnInit {
  isOpenMegaMenu:boolean = false;
  sort = new sort();
  itemsPerPage:selectBtn[] = itemsPerPage;
  selectBtn:selectBtn[] = filterOpt
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
  settingsForEUIN = this.__utility.settingsfroMultiselectDropdown('euin_no','emp_name','Search Employee',3);
  settingsForbrnch = this.__utility.settingsfroMultiselectDropdown('id','brn_name','Search Branch',3 );
  settingsForbuType = this.__utility.settingsfroMultiselectDropdown('id','bu_type','Search Business Type',3);
  settingsForRM = this.__utility.settingsfroMultiselectDropdown('id','manager_name','Search Relationship Manager',3);
  settingsForsubCode = this.__utility.settingsfroMultiselectDropdown('code','bro_name','Search Sub Broker',3);
  __insuredbu_type = [
    { id: 'F', insuredbu_type: 'Fresh' },
    { id: 'R', insuredbu_type: 'Renewal' },
  ];
  __isClientPending: boolean = false;
  divToPrint: any;
  WindowObject: any;
  __mode_of_premium = modeOfPremium;
  __columns: column[] = [];
  __exportedClmns: string[];
  clmList: any= fdTraxClm.Columns.filter(item => !['edit'].includes(item.field));
   SelectedClms:string[]= [];
  __euinMst: any = [];
  __subbrkArnMst: any = [];
  __clientMst: client[] = [];
  __compMst: fdComp[] = [];
  __compTypeMst: any = [];
  __scmMst: any = [];
  __tinMst: any =[];
  __brnchMst:any = [];
  displayMode_forTemp_Tin:string;
  displayMode_forClient:string;
  __istemporaryspinner:boolean = false;
  __insTrax = new MatTableDataSource<any>([]);
  __exportTrax = new MatTableDataSource<any>([]);


  __sortAscOrDsc: any = { active: '', direction: 'asc' };
  __pageNumber = new FormControl('10');
  __paginate: any = [];
  __bu_type: any=[];
  __rmMst: any=[];
  __isVisible: boolean = false;
  __insTraxMst = new MatTableDataSource<any>([]);
  __insTraxForm = new FormGroup({
    btn_type:new FormControl('R'),
    options: new FormControl('2'),
    sub_brk_cd: new FormControl([]),
    tin_no: new FormControl(''),
    insured_bu_type: new FormArray([]),
    brn_cd: new FormControl([]),
    investor_code: new FormControl(''),
    investor_name: new FormControl(''),
    euin_no: new FormControl([]),
    bu_type: new FormControl([]),
    rm_id: new FormControl([]),
    frm_dt: new FormControl(''),
    to_dt: new FormControl(''),
    dt_type: new FormControl(''),
    date_range: new FormControl(''),
    company_id: new FormControl([],{updateOn:'blur'}),
    comp_type_id: new FormControl([],{updateOn:'blur'}),
    scheme_id: new FormControl([]),
    filter_type: new FormControl(''),
    login_status_id: new FormArray([]),
    is_all: new FormControl(false)
  });
  constructor(
    private __Rpt: RPTService,
    private __dialog: MatDialog,
    private __utility: UtiliService,
    public dialogRef: MatDialogRef<AckSearchRPTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dbIntr: DbIntrService,
    private sanitizer: DomSanitizer
  ) {}

  setColumns() {
    this.__columns = fdTraxClm.Columns.filter(item => item.isVisible.includes(2))
  }
   get login_status_id(): FormArray{
      return this.__insTraxForm.get('login_status_id') as FormArray;
   }
  ngOnInit(): void {
    this.getFDMstRPT();
    this.setColumns();
    this.getCompanyTypeMst();
    this.getLoggedinStatus();
  }

  getLoggedinStatus(){
    loggedStatus.forEach(el =>{
    this.login_status_id.push(this.addLoggedStatusForm(el));
    })
  }
  addLoggedStatusForm(loggedStatus){
    return new FormGroup({
      id:new FormControl(loggedStatus ? loggedStatus?.id : 0),
      name:new FormControl(loggedStatus ? loggedStatus?.name : 0),
      value:new FormControl(loggedStatus ? loggedStatus.value : ''),
      isChecked:new FormControl(false),
    })
  }
  getFDMstRPT() {
    const __fd = new FormData();
    __fd.append('paginate', this.__pageNumber.value);
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
      __fd.append('login_status_id', JSON.stringify(this.login_status_id.value.filter(item => item.isChecked).map(res => {return res['id']})));
      if(this.__insTraxForm.value.btnType == 'A'){
      __fd.append('brn_cd', JSON.stringify(this.__insTraxForm.value.brn_cd.map(item => {return item['id']})));
      __fd.append('bu_type', JSON.stringify(this.__insTraxForm.value.bu_type.map(item => {return item['id']})));
      __fd.append('rm_id', JSON.stringify(this.__insTraxForm.value.rm_id.map(item => {return item['id']})));
      __fd.append('sub_brk_cd', JSON.stringify(this.__insTraxForm.value.sub_brk_cd.map(item => {return item['id']})));
      __fd.append('euin_no', JSON.stringify(this.__insTraxForm.value.euin_no.map(item => {return item['id']})));
      }
    }
    this.__dbIntr
      .api_call(1, '/fd/ackDetailSearch', __fd)
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
      .api_call(1, '/fd/ackExport', formData)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__exportTrax = new MatTableDataSource(res);
      });
  }

  ngAfterViewInit() {
     /** Change event occur when all rnt checkbox has been changed  */
     this.__insTraxForm.controls['is_all'].valueChanges.subscribe(res =>{
      this.login_status_id.controls.map(item => {return item.get('isChecked').setValue(res,{emitEvent:false})});
    })
    /** End */

    /** Change event inside the formArray */
    this.login_status_id.valueChanges.subscribe(res =>{
    this.__insTraxForm.controls['is_all'].setValue(res.every(item => item.isChecked),{emitEvent:false});
    })
    /*** End */
    this.__insTraxForm.controls['tin_no'].valueChanges.pipe(
      tap(() => (this.__istemporaryspinner = true)),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((dt) =>
        dt?.length > 1 ? this.__dbIntr.searchItems('/fd/fdTraxShow', dt) : []
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
        // this.getSchemeMst(this.__insTraxForm.get('company_id').value, res);
        this.getCompanyMst(res);
      }
    );
    /*** END */

    // /*** Comapny Change */
    this.__insTraxForm.controls['company_id'].valueChanges.subscribe((res) => {
      this.getSchemeMst(res);
    });
    // /*** END */
  }
  searchInsurance() {
    this.getFDMstRPT();
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
  getPaginate(__paginate: any | null = null) {
    if(__paginate.url){
      this.__dbIntr
       .getpaginationData(
         __paginate.url +
           ('&paginate=' + this.__pageNumber.value) +
           ('&option=' + this.__insTraxForm.value.options) +
          (
          ('&login_status_id=' + (JSON.stringify(this.login_status_id.value.filter(item => item.isChecked).map(res => {return res['id']})))) +
           ('&from_date=' + global.getActualVal(this.__insTraxForm.getRawValue().frm_dt)) +
           ('&to_date=' + global.getActualVal(this.__insTraxForm.getRawValue().to_dt)) +
           ('&tin_no=' + global.getActualVal(this.__insTraxForm.value.tin_no)) +
           ('&investor_code=' + global.getActualVal(this.__insTraxForm.value.investor_code)) +
           ('&company_id=' + (JSON.stringify(this.__insTraxForm.value.company_id.map(item => {return item['id']})))) +
           ('&comp_type_id=' + (JSON.stringify(this.__insTraxForm.value.comp_type_id.map(item => {return item['id']})))) +
           ('&scheme_id=' + (JSON.stringify(this.__insTraxForm.value.scheme_id.map(item => {return item['id']}))))
            +
            (
             this.__insTraxForm.value.btnType == 'A' ?
             (
               ('&brn_cd=' + (JSON.stringify(this.__insTraxForm.value.brn_cd.map(item => {return item['id']})))) +
               ('&rm_id=' + (JSON.stringify(this.__insTraxForm.value.rm_id.map(item => {return item['id']})))) +
               ('&sub_brk_cd=' + (JSON.stringify(this.__insTraxForm.value.sub_brk_cd.map(item => {return item['id']})))) +
               ('&euin_no=' + (JSON.stringify(this.__insTraxForm.value.euin_no.map(item => {return item['id']}))))
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
  getModeOfPremium(premium) {
    return premium
      ? this.__mode_of_premium.filter((x: any) => (x.id = premium))[0].name
      : '';
  }
  populateDT(__items){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '50%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'ACKUPLFD_' + (__items.tin_no ? __items.tin_no.toString() : '0'),
      isViewMode: __items.form_status == 'P' ? false : true,
      tin: __items.tin_no,
      tin_no: __items.tin_no,
      title: 'Upload Acknowledgement',
      right: global.randomIntFromInterval(1, 60),
      data:__items
    };
    dialogConfig.id = 'ACKUPLFD_' + (__items.tin_no ? __items.tin_no.toString() : '0');
    try {
      const dialogref = this.__dialog.open(
        AckEntryComponent,
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
        flag: 'ACKUPLFD_' + (__items.tin_no ? __items.tin_no.toString() : '0'),
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
    this.__sortAscOrDsc = { active: '', direction: 'asc' };
    this.searchInsurance();
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
  getSchemeMst(__comp_id) {
    if (__comp_id.length > 0) {
      this.__dbIntr
        .api_call(0, '/fd/schemeDetails', 'arr_company_id='+ JSON.stringify(__comp_id.map(item => {return item['id']})))
        .pipe(pluck('data'))
        .subscribe(res => {
          this.__scmMst = res;
        });
    } else {
      this.__insTraxForm.controls['scheme_id'].setValue([], {emitEvent: false,});
      this.__scmMst.length = 0;
    }
  }
  getSub_option(__subOpt){
    return subOpt.filter(x => x.id == __subOpt)[0]?.value;
  }
  getTDSInfo(__id){
    return tdsInfo.filter(x => x.id == __id)[0]?.name
  }

  updateRow(row_obj){
    this.__insTrax.data = this.__insTrax.data.filter((value: any, key) => {
      if (value.tin_no == row_obj.tin_no) {
       value.comp_login_cutt_off = row_obj.comp_login_cutt_off,
       value.comp_login_dt = row_obj.comp_login_dt,
       value.comp_login_time = row_obj.comp_login_dt?.split(' ')[1],
       value.ack_copy_scan = `${row_obj.ack_copy_scan}`,
       value.form_status = row_obj.form_status,
       value.ack_remarks = row_obj.ack_remarks
      }
      return true;
    });
   }
   onItemClick(ev){
     if(ev.option.value == 'A'){
      //Advance
      this.getBranchMst()
     }
     else{
      //Reset
     }
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
  DocumentView(element){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.width = '80%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      title: 'Uploaded Scan Copy',
      data: element,
      copy_url:`${environment.app_formUrl_fd + element.app_form_scan}`,
      src:this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.app_formUrl + element.app_form_scan}`)
    };
    const dialogref = this.__dialog.open(PreviewDocumentComponent, dialogConfig);
  }
  onselectItem(ev){
    this.getFDMstRPT();
  }
  getSelectedColumns(columns){
    const clm = ['edit', 'app_form_scan'];
    this.__columns = columns.map(({ field, header }) => ({field, header}));
    this.__exportedClmns = this.__columns.filter((x: any) => !clm.includes(x.field)).map((x: any) => x.field);
  }
}
