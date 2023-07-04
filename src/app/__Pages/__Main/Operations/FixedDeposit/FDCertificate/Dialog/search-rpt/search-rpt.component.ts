import { Overlay } from '@angular/cdk/overlay';
import {
  Component,
  OnInit,
  Inject
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
import { responseDT } from 'src/app/__Model/__responseDT';
import { client } from 'src/app/__Model/__clientMst';
// import { TrxEntryComponent } from '../trx-entry/trx-entry.component';
import { fdComp } from 'src/app/__Model/fdCmp';
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
  selector: 'app-search-rpt',
  templateUrl: './search-rpt.component.html',
  styleUrls: ['./search-rpt.component.css']
})
export class SearchRPTComponent implements OnInit {
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
  clmList: any= fdCertificateClm.Columns;
  settingsForEUIN = this.__utility.settingsfroMultiselectDropdown('euin_no','emp_name','Search Employee',3);
  settingsForbrnch = this.__utility.settingsfroMultiselectDropdown('id','brn_name','Search Branch',3 );
  settingsForbuType = this.__utility.settingsfroMultiselectDropdown('id','bu_type','Search Business Type',3);
  settingsForRM = this.__utility.settingsfroMultiselectDropdown('id','manager_name','Search Relationship Manager',3);
  settingsForsubCode = this.__utility.settingsfroMultiselectDropdown('code','bro_name','Search Sub Broker',3);
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
    filter_type: new FormControl('')
  });
  __insTrax = new MatTableDataSource<any>([]);
  __exportTrax = new MatTableDataSource<any>([]);

  constructor(
    private __Rpt: RPTService,
    private __dialog: MatDialog,
    private __utility: UtiliService,
    public dialogRef: MatDialogRef<SearchRPTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private sanitizer:DomSanitizer,
    private __dbIntr: DbIntrService
  ) {}


  ngOnInit(): void {
      this.getCompanyTypeMst();
    this.getFDMstRPT();
    this.setColumns(this.__insTraxForm.value.options);
  }
  populateDT(__el) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = '50%';
    dialogConfig.id = __el.tin_no;
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
       }
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
      if(this.__insTraxForm.value.btnType == 'A'){
      __fd.append('brn_cd', JSON.stringify(this.__insTraxForm.value.brn_cd.map(item => {return item['id']})));
      __fd.append('bu_type', JSON.stringify(this.__insTraxForm.value.bu_type.map(item => {return item['id']})));
      __fd.append('rm_id', JSON.stringify(this.__insTraxForm.value.rm_id.map(item => {return item['id']})));
      __fd.append('sub_brk_cd', JSON.stringify(this.__insTraxForm.value.sub_brk_cd.map(item => {return item['id']})));
      __fd.append('euin_no', JSON.stringify(this.__insTraxForm.value.euin_no.map(item => {return item['id']})));
      }
    }
    this.__dbIntr
      .api_call(1, '/fd/deliveryUpdateDetailSearch', __fd)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__insTrax = new MatTableDataSource(res.data);
        this.__paginate = res.links;
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
    this.__columns = this.clmList.filter(item => item.isVisible.includes(Number(2)));
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

}
