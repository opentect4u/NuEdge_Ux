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
import { FormArray, FormControl, FormControlName, FormGroup } from '@angular/forms';
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

import { TrxEntryComponent } from '../trx-entry/trx-entry.component';
import { fdComp } from 'src/app/__Model/fdCmp';
import subOpt from '../../../../../../../../assets/json/subOption.json';
import tdsInfo from '../../../../../../../../assets/json/TDSInfo.json';
import filterOpt from '../../../../../../../../assets/json/filterOption.json';
import { sort } from 'src/app/__Model/sort';
import itemsPerPage from '../../../../../../../../assets/json/itemsPerPage.json';
import { environment } from 'src/environments/environment';
import { PreviewDocumentComponent } from 'src/app/shared/core/preview-document/preview-document.component';
import { DomSanitizer } from '@angular/platform-browser';
type selectBtn ={
  label:string,
  value:string,
  icon:string
}


@Component({
  selector: 'app-trax-rpt',
  templateUrl: './trax-rpt.component.html',
  styleUrls: ['./trax-rpt.component.css']
})
export class TraxRPTComponent implements OnInit {
  isOpenMegaMenu:boolean = false;
  sort = new sort();
  itemsPerPage:selectBtn[] = itemsPerPage;
  selectBtn:selectBtn[] = filterOpt
  __comp_setting = this.__utility.settingsfroMultiselectDropdown('id','comp_short_name','Search Company');
  __comp_type_setting = this.__utility.settingsfroMultiselectDropdown('id','comp_type','Search Company Type');
  __scm_setting = this.__utility.settingsfroMultiselectDropdown('id','scheme_name','Search Scheme');
  settingsForEUIN = this.__utility.settingsfroMultiselectDropdown('euin_no','emp_name','Search Employee',3);
  settingsForbrnch = this.__utility.settingsfroMultiselectDropdown('id','brn_name','Search Branch',3 );
  settingsForbuType = this.__utility.settingsfroMultiselectDropdown('id','bu_type','Search Business Type',3);
  settingsForRM = this.__utility.settingsfroMultiselectDropdown('id','manager_name','Search Relationship Manager',3);
  settingsForsubCode = this.__utility.settingsfroMultiselectDropdown('code','bro_name','Search Sub Broker',3);
  __insuredbu_type = [
    { id: 'F', insuredbu_type: 'Fresh' },
    { id: 'R', insuredbu_type: 'Renewal' },
  ];


  @ViewChildren('buTypeChecked')
  private __buTypeChecked: QueryList<ElementRef>;
  @ViewChild('searchEUIN') __searchRlt: ElementRef;
  @ViewChild('subBrkArn',{static:true}) __subBrkArn: ElementRef;
  @ViewChild('clientCd') __clientCode: ElementRef;
  displayMode_forTemp_Tin:string;
  displayMode_forClient:string;
  __isSubArnPending: boolean = false;
  __isEuinPending: boolean = false;
  __isClientPending: boolean = false;
  __istemporaryspinner:boolean = false;
  divToPrint: any;
  WindowObject: any;
  __mode_of_premium = modeOfPremium;
  __columns: any[] = [];
  clmList: any= fdTraxClm.Columns.filter(item => !['comp_login_cutt_off','comp_login_dt'].includes(item.field))
  __exportedClmns: string[] = [];
  SelectedClms: string[]=[];
  __euinMst: any = [];
  __subbrkArnMst: any = [];
  __clientMst: client[] = [];
  __compMst: fdComp[] = [];
  __compTypeMst: any = [];
  __scmMst: any = [];
  __tinMst:any=[];
  __brnchMst:any =[];
  __rmMst:any =[];
  __insTrax = new MatTableDataSource<any>([]);
  __exportTrax = new MatTableDataSource<any>([]);
  __sortAscOrDsc: any = { active: '', direction: 'asc' };
  __pageNumber = new FormControl('10');
  __paginate: any = [];
  __bu_type:any =[];
  __isVisible: boolean = false;
  __insTraxMst = new MatTableDataSource<any>([]);
  __insTraxForm = new FormGroup({
    btnType:new FormControl('R'),
    date_range: new FormControl(''),
    options: new FormControl('2'),
    sub_brk_cd: new FormControl([]),
    rm_id:new FormControl([]),
    tin_no: new FormControl(''),
    brn_cd: new FormControl([]),
    investor_code: new FormControl(''),
    investor_name: new FormControl(''),
    euin_no: new FormControl([]),
    bu_type: new FormControl([]),
    date_status: new FormControl('T'),
    start_date: new FormControl(this.getTodayDate()),
    end_date: new FormControl(this.getTodayDate()),
    login_status: new FormControl('N'),
    frm_dt: new FormControl(''),
    to_dt: new FormControl(''),
    dt_type: new FormControl(''),
    company_id: new FormControl([],{updateOn:'blur'}),
    comp_type_id: new FormControl([],{updateOn:'blur'}),
    scheme_id: new FormControl([]),
    filter_type: new FormControl(''),
    is_all_bu_type: new FormControl(false)
  });
  // toppings = new FormControl();
  // toppingList = fdTraxClm.COLUMN_SELECTOR;
  constructor(
    private __Rpt: RPTService,
    private __dialog: MatDialog,
    private __utility: UtiliService,
    public dialogRef: MatDialogRef<TraxRPTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dbIntr: DbIntrService,
    private sanitizer: DomSanitizer
  ) {}

  setColumns(options) {

    const clmToRemove = ['edit','app_form_scan'];
    this.__columns = fdTraxClm.Columns.filter(item => item.isVisible.includes(Number(options))).filter(item => !['comp_login_cutt_off','comp_login_dt'].includes(item.field))
    console.log(this.__columns)
    this.__exportedClmns = this.__columns.filter(x => !clmToRemove.includes(x.field)).map(item => {return item['field']})
    this.SelectedClms = this.__columns.map(item => {return item['field']});
  }

  ngOnInit(): void {
    this.getFDMstRPT();
    this.setColumns(2);
    this.getCompanyTypeMst();
  }
  getFDMstRPT() {
    const __fd = new FormData();
      __fd.append('paginate', this.__pageNumber.value);
      if(this.__insTraxForm.value.options == 2 || this.__insTraxForm.value.options == 1){
        __fd.append('from_date',global.getActualVal(this.__insTraxForm.getRawValue().frm_dt));
        __fd.append('to_date',global.getActualVal(this.__insTraxForm.getRawValue().to_dt));
        __fd.append('tin_no',global.getActualVal(this.__insTraxForm.value.tin_no));
        __fd.append('investor_code',global.getActualVal(this.__insTraxForm.value.investor_code));
        __fd.append('company_id', JSON.stringify(this.__insTraxForm.value.company_id.map(item => {return item['id']})));
        __fd.append('comp_type_id',JSON.stringify(this.__insTraxForm.value.comp_type_id.map(item => {return item['id']})));
        __fd.append('scheme_id', JSON.stringify(this.__insTraxForm.value.scheme_id.map(item => {return item['id']})));
        if(this.__insTraxForm.value.btnType == 'A'){
        __fd.append('brn_cd', JSON.stringify(this.__insTraxForm.value.brn_cd.map(item => {return item['id']})));
        __fd.append('bu_type', JSON.stringify(this.__insTraxForm.value.bu_type.map(item => {return item['id']})));
        __fd.append('rm_id', JSON.stringify(this.__insTraxForm.value.rm_id.map(item => {return item['id']})));
        __fd.append('sub_brk_cd', JSON.stringify(this.__insTraxForm.value.sub_brk_cd.map(item => {return item['id']})));
        __fd.append('euin_no', JSON.stringify(this.__insTraxForm.value.euin_no.map(item => {return item['id']})));
        }
      }
      else{
        __fd.append('login_status', this.__insTraxForm.value.login_status);
      __fd.append('date_status', this.__insTraxForm.value.date_status);
      __fd.append('start_date', this.__insTraxForm.value.start_date);
      __fd.append('end_date', this.__insTraxForm.value.end_date);
      }
    this.__dbIntr
      .api_call(1, '/fd/fdTraxDetailSearch', __fd)
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
      .api_call(1, '/fd/fdTraxExport', formData)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__exportTrax = new MatTableDataSource(res);
      });
  }

  ngAfterViewInit() {
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

    this.__insTraxForm.controls['tin_no'].valueChanges
    .pipe(
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
        this.searchResultVisibilityForTin('block');
        this.__istemporaryspinner = false;
      },
      complete: () => console.log(''),
      error: (err) => {
        this.__istemporaryspinner = false;
      },
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
      this.setColumns(res);
    });


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

    /*** Comapny Change */
    this.__insTraxForm.controls['company_id'].valueChanges.subscribe((res) => {
      this.getSchemeMst(res);
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
  searchResultVisibilityForTin(display_mode) {
    this.displayMode_forTemp_Tin = display_mode;
  }
  searchFD() {
    this.getFDMstRPT();
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
    this.searchFD();
  }
  getPaginate(__paginate: any | null = null) {
    if(__paginate.url){
       this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&option=' + this.__insTraxForm.value.options) +
            (
              this.__insTraxForm.value.options != 3 ?
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
              this.__insTraxForm.value.btnType == 'A' ?
              (
                ('&brn_cd=' + (JSON.stringify(this.__insTraxForm.value.brn_cd.map(item => {return item['id']})))) +
                ('&rm_id=' + (JSON.stringify(this.__insTraxForm.value.rm_id.map(item => {return item['id']})))) +
                ('&sub_brk_cd=' + (JSON.stringify(this.__insTraxForm.value.sub_brk_cd.map(item => {return item['id']})))) +
                ('&euin_no=' + (JSON.stringify(this.__insTraxForm.value.euin_no.map(item => {return item['id']}))))
              )
              :
              ''
            ))
            :
            (
            ('&login_status=' + (this.__insTraxForm.value.login_status)) +
            ('&date_status=' + (this.__insTraxForm.value.date_status)) +
            ('&start_date=' + (this.__insTraxForm.value.start_date)) +
            ('&end_date=' + (this.__insTraxForm.value.end_date))
            )
        ))
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.__insTrax = new MatTableDataSource(res.data);
          this.__paginate = res.links;
        });
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
    this.searchFD();
  }
  getModeOfPremium(premium) {
    return premium
      ? this.__mode_of_premium.filter((x: any) => (x.id = premium))[0].name
      : '';
  }
  populateDT(__el) {
    console.log(__el);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = '80%';
    dialogConfig.id = __el.tin_no;
    console.log(dialogConfig.id);
    dialogConfig.hasBackdrop = false;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    try {
      dialogConfig.data = {
        flag: 'FDTRAX_' + __el.tin_no,
        id: 0,
        title: 'FD Trax',
        right: global.randomIntFromInterval(1, 60),
        tin_no: __el.tin_no ? __el.tin_no : '',
        data: __el,
      };
      console.log(dialogConfig.data);
      const dialogref = this.__dialog.open(TrxEntryComponent, dialogConfig);
      dialogref.afterClosed().subscribe((dt) => {});
    } catch (ex) {
      console.log(ex);
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('80%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'FDTRAX_' + __el.tin_no,
      });
    }
  }
  exportPdf() {
    if (this.__insTraxForm.get('options').value == '3') {
      this.__Rpt.printRPT('FDRPT');
    } else {
      this.__Rpt.downloadReport(
        '#FDRPT',
        {
          title: 'FD Report',
        },
        'FD Report'
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
    this.searchFD();
  }

  getItems(__items, __mode) {
    switch (__mode) {
      case 'C':
        this.__insTraxForm.controls['investor_name'].reset(__items.client_name,{ emitEvent: false });
        this.__insTraxForm.controls['investor_code'].reset(__items.id,{ emitEvent: false });
        this.searchResultVisibilityForClient('none');
        break;
      // case 'E':
      //   this.__insTraxForm.controls['euin_no'].reset(__items.emp_name, {

      //     emitEvent: false,
      //   });
      //   this.searchResultVisibility('none');
      //   break;
      case 'T':
        this.__insTraxForm.controls['tin_no'].reset(__items.tin_no,{ onlySelf: true, emitEvent: false });
        this.searchResultVisibilityForTin('none');
        break;
      // case 'S':
      //   this.__insTraxForm.controls['sub_brk_cd'].reset(__items.code, {
      //     emitEvent: false,
      //   });
      //   this.searchResultVisibilityForSubBrk('none');
      //   break;
    }
  }
  outsideClickforClient(__ev) {
    if (__ev) {
      this.searchResultVisibilityForClient('none');
    }
  }
  searchResultVisibilityForClient(display_mode) {
    this.displayMode_forClient = display_mode;
  }
  AdvanceFilter() {
  }
  getCompanyMst(arr_cmp_type_ids) {
    if(arr_cmp_type_ids.length > 0){
      this.__dbIntr
      .api_call(0, '/fd/company', 'arr_cmp_type_id='+JSON.stringify(arr_cmp_type_ids.map(item => {return item['id']})))
      .pipe(pluck('data'))
      .subscribe((res: fdComp[]) => {
        this.__compMst = res;
      });
    }
    else{
      this.__insTraxForm.controls['company_id'].setValue([], {emitEvent: true});
      this.__compMst.length = 0;
    }

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
  onItemClick(ev){
    if(ev.option.value == 'A'){
      this.getBranchMst();
    }
    else{
      //Report
    }
  }
  getBranchMst(){
    this.__dbIntr.api_call(0,'/branch',null).pipe(pluck("data")).subscribe(res =>{
      this.__brnchMst = res;
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
