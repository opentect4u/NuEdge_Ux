import { Overlay } from '@angular/cdk/overlay';
import {
  Component,
  OnInit,
  Inject,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { rnt } from 'src/app/__Model/Rnt';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { client } from 'src/app/__Model/__clientMst';
import { amc } from 'src/app/__Model/amc';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  pluck,
  switchMap,
  tap,
} from 'rxjs/operators';
import { global } from 'src/app/__Utility/globalFunc';
import { NfomodificationComponent } from '../nfoModification/nfoModification.component';
import itemsPerPage from '../../../../../../../../../../../assets/json/itemsPerPage.json';
import popupMenu from '../../../../../../../../../../../assets/json/Master/daySheetOpt.json'

import { DomSanitizer } from '@angular/platform-browser';
import { sort } from 'src/app/__Model/sort';
import { scheme } from 'src/app/__Model/__schemeMst';
import { nfoClmns } from 'src/app/__Utility/MFColumns/nfoClmns';
import { column } from 'src/app/__Model/tblClmns';
import { environment } from 'src/environments/environment';
import { PreviewDocumentComponent } from 'src/app/shared/core/preview-document/preview-document.component';
import { responseDT } from 'src/app/__Model/__responseDT';
type selectBtn ={
  label:string,
  value:string,
  icon:string
}
@Component({
  selector: 'nfoRpt-component',
  templateUrl: './nfoRpt.component.html',
  styleUrls: ['./nfoRpt.component.css'],
})
export class NforptComponent implements OnInit {
  transaction:number;
  NFOMst: any=[];
  selectBtn:selectBtn[] = [{ label: 'Advance Filter', value: 'A',icon:'pi pi-filter' }, { label: 'Reset', value: 'R',icon:'pi pi-refresh' }]
  itemsPerPage:selectBtn[] = itemsPerPage;
  daysheetpopupMenu = popupMenu;

  __isVisible:boolean = true;
  isOpenMegaMenu:boolean = false;
  __pageNumber =new FormControl('10');
  sort = new sort();
  __paginate: any = [];
  __istemporaryspinner:boolean = false;
  __isClientPending:boolean = false;
  displayMode_forTemp_Tin: string;
  displayMode_forClient:string;
  settingsforDropdown_foramc = this.utility.settingsfroMultiselectDropdown('id','amc_name','Search AMC',1);
  settingsforDropdown_forscheme = this.utility.settingsfroMultiselectDropdown('id','scheme_name','Search Scheme',1);
  settingsforDropdown_forbrnch = this.utility.settingsfroMultiselectDropdown('id','brn_name','Search Branch',1);
  settingsforBuTypeDropdown = this.utility.settingsfroMultiselectDropdown('bu_code','bu_type','Search Business Type',3);
 settingsforRMDropdown = this.utility.settingsfroMultiselectDropdown('euin_no','emp_name','Search Relationship Manager',1);
 settingsforSubBrkDropdown = this.utility.settingsfroMultiselectDropdown('code','bro_name','Search Sub Broker',1);
 settingsforEuinDropdown = this.utility.settingsfroMultiselectDropdown('euin_no','euin_no','Search Employee',1);

 /** Filter Criteria */
transFrm = new FormGroup({
  date_status: new FormControl('T'),
  start_date: new FormControl(this.getTodayDate()),
  end_date: new FormControl(this.getTodayDate()),
  login_status: new FormControl('N'),
  btnType: new FormControl('R'),
  option: new FormControl('2'),
  date_periods_type: new FormControl(''),
  date_range: new FormControl(''),
  tin_no: new FormControl(''),
  client_dtls: new FormControl(''),
  client_code: new FormControl(''),
  amc_id: new FormControl([], { updateOn: 'blur' }),
  scheme_id: new FormControl([]),
  rnt_id: new FormArray([]),
  is_all_rnt: new FormControl(false),
  brn_cd: new FormControl([],{updateOn:'blur'}),
  bu_type: new FormControl([],{updateOn:'blur'}),
  rm_name: new FormControl([],{updateOn:'blur'}),
  sub_brk_cd: new FormControl([],{updateOn:'blur'}),
  euin_no: new FormControl([]),
  frm_dt: new FormControl(''),
  to_dt: new FormControl('')
});
/*** End */
brnchMst: any =[];
tempTinMst: any=[];
__clientMst:client[]=[];
AMCMst:amc[]=[];
schemeMst:scheme[]=[];
__RmMst: any=[];
__subbrkArnMst:any=[];
__euinMst:any=[];
columns:column[]=[]
__columns:column[]=[]
SelectedClms:string[] =[];
trnsMst:any=[];
__bu_type: any=[];
selectNFO: any=[];
printPdfClm: any = [];
__export = new MatTableDataSource<any>([]);
__exportedClmns: string[] = [];
  constructor(
    private overlay: Overlay,
    private utility: UtiliService,
    private __dbIntr: DbIntrService,
    private __dialog: MatDialog,
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<NforptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.getAMC();/****Get AMC Master Data from backend  */
    this.getRntMst(); /****Get R&T Master Data from backend  */
    this.getTransactionAgainstParticularTransactionType(this.data.product_id,this.data.trans_type_id);
  }


  ngAfterViewInit(){
    this.transFrm.controls['date_status'].valueChanges.subscribe((res) => {
      if (res == 'T') {
        this.transFrm.controls['start_date'].setValue('');
        this.transFrm.controls['end_date'].setValue('');
      } else {
        this.transFrm.controls['start_date'].setValue(this.getTodayDate());
        this.transFrm.controls['end_date'].setValue(this.getTodayDate());
      }
    });
    this.transFrm.controls['date_periods_type'].valueChanges.subscribe((res) => {
      this.transFrm.controls['date_range'].reset(
        res && res != 'R' ? ([new Date(dates.calculateDT(res)),new Date(dates.getTodayDate())]) : ''
      );
      this.transFrm.controls['frm_dt'].reset(
        res && res != 'R' ? ((dates.calculateDT(res))) : ''
      );
      this.transFrm.controls['to_dt'].reset(
        res && res != 'R' ? dates.getTodayDate() : ''
      );

      if (res && res != 'R') {
        this.transFrm.controls['date_range'].disable();
      } else {
        this.transFrm.controls['date_range'].enable();
      }
    });

    /** Change event occur when all rnt checkbox has been changed  */
    this.transFrm.controls['is_all_rnt'].valueChanges.subscribe(res =>{
            this.rnt_id.controls.map(item => {return item.get('isChecked').setValue(res,{emitEvent:false})});
    })
    /** End */

    /** Change event inside the formArray */
    this.rnt_id.valueChanges.subscribe(res =>{
      this.transFrm.controls['is_all_rnt'].setValue(res.every(item => item.isChecked),{emitEvent:false});
    })
    /*** End */

    this.transFrm.controls['amc_id'].valueChanges.subscribe((res) => {
      this.getSchemeagainstAMC(
        res
      ); /***** Function call for getting scheme against */
    });
    /*** Temporary Tin Number */
   this.transFrm.controls['tin_no'].valueChanges
   .pipe(
     tap(() => (this.__istemporaryspinner = true)),
     debounceTime(200),
     distinctUntilChanged(),
     switchMap((dt) =>
       dt?.length > 1 ? this.__dbIntr.ReportTINSearch('/mfTraxShow', dt+'&trans_type_id='+this.data.trans_type_id+'&trans_id='+this.transaction) : []
     ),
     map((x: responseDT) => x.data)
   )
   .subscribe({
     next: (value) => {
       this.tempTinMst = value;
       this.searchResultVisibilityForTempTin('block');
       this.__istemporaryspinner = false;
     },
     complete: () => console.log(''),
     error: (err) => (this.__istemporaryspinner = false),
   });

    /*** End */

     /*** Client Details Change*/
   this.transFrm.controls['client_dtls'].valueChanges
   .pipe(
     tap(() => (this.__isClientPending = true)),
     debounceTime(200),
     distinctUntilChanged(),
     switchMap((dt) =>
       dt?.length > 1 ? this.__dbIntr.ReportTINSearch('/client', dt) : []
     ),
     map((x: responseDT) => x.data)
   )
   .subscribe({
     next: (value) => {
       this.__clientMst = value;
       this.searchResultVisibilityForClient('block');
       this.__isClientPending = false;
     },
     complete: () => console.log(''),
     error: (err) => (this.__isClientPending = false),
   });

    /*** End */

     /*** Change Option i.e Details/ Summary*/
     this.transFrm.controls['option'].valueChanges.subscribe((res) => {
      this.setColumns(res,this.data.trans_type_id,this.transaction);
   })
   /*** End */

   this.transFrm.controls['brn_cd'].valueChanges.subscribe(res =>{
    this.getBusinessTypeMst(res)
  })
  this.transFrm.controls['bu_type'].valueChanges.subscribe(res =>{
    this.disabledSubBroker(res);
     this.getRelationShipManagerMst(res,this.transFrm.value.brn_cd);
  })
  this.transFrm.controls['rm_name'].valueChanges.subscribe(res =>{
    if(this.transFrm.value.bu_type.findIndex(item => item.bu_code == 'B') != -1){
             this.getSubBrokerMst(res);
    }
    else{
    this.__euinMst.length = 0;
      this.__euinMst = res;
    }
 })
 this.transFrm.controls['sub_brk_cd'].valueChanges.subscribe(res =>{
  // if(res.length > 0){
    this.setEuinDropdown(res,this.transFrm.value.rm_name);
  // }
 })
  }
  setEuinDropdown(sub_brk_cd,rm){
    // this.__euinMst.length = 0;
    console.log(sub_brk_cd);

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
      this.transFrm.controls['sub_brk_cd'].enable();
    }
    else{
      this.transFrm.controls['sub_brk_cd'].disable();
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
    this.transFrm.controls['sub_brk_cd'].setValue([]);
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
    this.transFrm.controls['bu_type'].reset([],{emitEvent:true});
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
         this.__RmMst = res;
    })
  }
  else{
    this.__RmMst.length =0;
    this.transFrm.controls['rm_name'].reset([]);
  }
  }
  /** Function to call api for getting Scheme Master Data  against selected amc*/
  getSchemeagainstAMC(amc_id) {
    this.__dbIntr
      .api_call(
        0,
        '/scheme',
        'arr_amc_id=' +
          JSON.stringify(
            amc_id.map((item) => {
              return item['id'];
            })
          )
      )
      .pipe(pluck('data'))
      .subscribe((res: scheme[]) => {
        this.schemeMst = res;
      });
  }
  /**** End */
  /** Function for get transaction against transaction type */
  getTransactionAgainstParticularTransactionType(product_id,trans_type_id){
    this.__dbIntr
      .api_call(
        0,
        '/transction',
        'product_id=' +
         product_id +
          '&trans_type_id=' +
          trans_type_id
      )
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.trnsMst = res.map(({id,trns_name}) => ({
          id,
          tab_name:trns_name,
          img_src:id == 1 ? '../../../../../assets/images/pip.png'
          : (id == 2 ? '../../../../../assets/images/sip.png'
          : '../../../../../assets/images/switch.png')}));
      });
  }
  getminDate() {
    return dates.getminDate();
  }
  getTodayDate() {
    return dates.getTodayDate();
  }
  getRntMst(){
    this.__dbIntr.api_call(0,'/rnt',null).pipe(pluck("data")).subscribe((res:  rnt[]) =>{
      res.map((el:rnt) => this.rnt_id.push(this.setRntForm(el)));
  })
  }
  TabDetails(ev){
    this.transaction = ev.tabDtls.id;
    this.submitNFOReport();
    this.setColumns(this.transFrm.value.option,this.data.trans_type_id,this.transaction);
  }
  /*** End */
  get rnt_id(): FormArray {
    return this.transFrm.get('rnt_id') as FormArray;
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

  setColumns(option,trans_type_id,trns_id){
    const clm = ['edit','app_frm_view'];
    var columnsMst;
    switch(trns_id){
      case 4: columnsMst = global.getColumnsAfterMerge(nfoClmns.COLUMN_SELECTOR,nfoClmns.DETAILS_PIP);break;
      case 5: columnsMst = global.getColumnsAfterMerge(nfoClmns.COLUMN_SELECTOR,nfoClmns.DETAILS_SIP);break;
      case 6: columnsMst = global.getColumnsAfterMerge(nfoClmns.COLUMN_SELECTOR,nfoClmns.DETAILS_SWITCH);break;
      case 35: columnsMst = global.getColumnsAfterMerge(nfoClmns.COLUMN_SELECTOR,nfoClmns.DETAILS_NFOCOMBO);break;
    }
    this.columns = columnsMst;
    if(option == 2){
      this.__columns = trns_id == 5 ? nfoClmns.SUMMARY_COPY_SIP : nfoClmns.SUMMARY_COPY;
    }
    else if(option == 3){
      this.__columns = trns_id == 5 ?
      nfoClmns.SUMMARY_COPY_SIP.filter(res => !clm.includes(res.field))
      : nfoClmns.SUMMARY_COPY.filter(res => !clm.includes(res.field));
      this.printPdfClm = this.__columns;
    }
    else{
      this.__columns =columnsMst;
    }
    this.SelectedClms = this.__columns.map((x) => x.field);
    this.__exportedClmns = this.__columns.map(item => {return item['field']}).filter(res => !clm.includes(res));

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
  submitNFOReport(){
    const NFODT = new FormData();
       NFODT.append('paginate',this.__pageNumber.value);
       NFODT.append('option', this.transFrm.value.option);
       NFODT.append('trans_id', this.transaction.toString());
       NFODT.append('trans_type_id' ,this.data.trans_type_id.toString());
       NFODT.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
       NFODT.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));


       if(this.transFrm.value.option != 3){
         NFODT.append('from_date',global.getActualVal(this.transFrm.getRawValue().frm_dt));
         NFODT.append(
           'to_date',global.getActualVal(this.transFrm.getRawValue().to_dt));

         NFODT.append(
           'client_code',
           this.transFrm.value.client_code
             ? this.transFrm.value.client_code
             : ''
         );
         NFODT.append('rnt_name',
         JSON.stringify(this.rnt_id.value.filter(x=> x.isChecked).map(item => {return item['id']}))
         );

         NFODT.append(
           'tin_no',
           this.transFrm.value.tin_no ? this.transFrm.value.tin_no : ''
         );
         NFODT.append(
           'amc_name',
           this.transFrm.value.amc_id ? JSON.stringify(this.transFrm.value.amc_id.map(item => {return item["id"]})) : '[]'
         );
         NFODT.append(
           'scheme_name',
           this.transFrm.value.scheme_id ? JSON.stringify(this.transFrm.value.scheme_id.map(item => {return item["id"]})) : '[]'
         );
         if(this.transFrm.value.btnType == 'A'){
          NFODT.append(
            'sub_brk_cd',
            this.transFrm.value.sub_brk_cd ? JSON.stringify(this.transFrm.value.sub_brk_cd.map(item => {return item['code']})) : ''
          );
         NFODT.append(
           'euin_no',
           this.transFrm.value.euin_no ? JSON.stringify(this.transFrm.value.euin_no.map(item => {return item['euin_no']})) : '[]'
         );
         NFODT.append(
           'brn_cd',
           this.transFrm.value.brn_cd ? JSON.stringify(this.transFrm.value.brn_cd.map(item => {return item['id']})) : '[]'
         );
         NFODT.append(
          'rm_id',
         JSON.stringify(this.transFrm.value.rm_name.map(item => {return item['euin_no']}))
         )

         NFODT.append(
           'bu_type',
           this.transFrm.value.bu_type ?
           JSON.stringify(this.transFrm.value.bu_type.map(item => {return item['bu_code']})): '[]'
         );
        }
       }
       else{
        NFODT.append('login_status', this.transFrm.value.login_status);
        NFODT.append('date_status', this.transFrm.value.date_status);
        NFODT.append('start_date', this.transFrm.value.start_date);
        NFODT.append('end_date', this.transFrm.value.end_date);
       }
        this.__dbIntr.api_call(1,'/mfTraxDetailSearch',NFODT).pipe(pluck("data")).subscribe((res: any) =>{
          this.NFOMst = res.data;
          this.__paginate = res.links;
          this.NFOTableExport(NFODT)
         })
  }

  NFOTableExport(__mfTrax:FormData){
    __mfTrax.delete('paginate');
    this.__dbIntr
      .api_call(1, '/mfTraxExport', __mfTrax)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__export = new MatTableDataSource(res);
      });

  }
  onItemClick(ev){
    if(ev.option.value == 'A'){
     this.getBranchMst();
    }
    else{
      this.reset();
    }
 }
 getBranchMst(){
  this.__dbIntr.api_call(0,'/branch',null).pipe(pluck("data")).subscribe(res =>{
   this.brnchMst = res;
  })
}

close(ev){
  this.transFrm.patchValue({
   frm_dt: this.transFrm.getRawValue().date_range ? dates.getDateAfterChoose(this.transFrm.getRawValue().date_range[0]) : '',
   to_dt: this.transFrm.getRawValue().date_range ? (global.getActualVal(this.transFrm.getRawValue().date_range[1]) ?  dates.getDateAfterChoose(this.transFrm.getRawValue().date_range[1]) : '') : ''
  });
}
getSelectedItemsFromParent(ev){
  this.getItems(ev.item, ev.flag);
}
getItems(__items, __mode) {
  switch (__mode) {
    case 'C':
      this.transFrm.controls['client_dtls'].reset(__items.client_name, {
        emitEvent: false,
      });
      this.transFrm.controls['client_code'].reset(__items.id);
      this.searchResultVisibilityForClient('none');
      break;
    case 'T':
      this.transFrm.controls['tin_no'].reset(__items.tin_no, {
        emitEvent: false,
      });
      this.searchResultVisibilityForTempTin('none');
      break;
  }
}
searchResultVisibilityForTempTin(display_mode) {
  this.displayMode_forTemp_Tin = display_mode;
}
searchResultVisibilityForClient(display_mode) {
  this.displayMode_forClient = display_mode;
}
customSort(ev){
  this.sort.field = ev.sortField;
  this.sort.order = ev.sortOrder;
  if(ev.sortField){
    this.submitNFOReport();
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
    copy_url:`${environment.app_formUrl + element.app_form_scan}`,
    src:this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.app_formUrl + element.app_form_scan}`)
  };
  const dialogref = this.__dialog.open(PreviewDocumentComponent, dialogConfig);
}
onselectItem(ev){
  // this.__pageNumber = ev.option.value;
  this.submitNFOReport();
}
getPaginate(__paginate){
  if (__paginate.url) {
    this.__dbIntr
      .getpaginationData(
        __paginate.url +
          ('&paginate=' + this.__pageNumber.value) +
          ('&option=' + this.transFrm.value.option) +
          ('&trans_type_id=' + this.data.trans_type_id) +
          ('&trans_id=' + this.transaction) +
           (this.transFrm.value.option == 3 ?
            ('&client_code=' +
              (this.transFrm.value.client_code
                ? this.transFrm.value.client_code
                : '') +
                ('&rnt_name=' +
                (this.transFrm.value.rnt_id.length > 0
                  ? JSON.stringify(this.rnt_id.value.filter(x=> x.isChecked).map(item => {return item['id']}))
                  : '[]')) +
              ('&tin_no=' +
                (this.transFrm.value.tin_no
                  ? this.transFrm.value.tin_no
                  : '')) +
              ('&amc_name=' +
                (this.transFrm.value.amc_id
                  ? JSON.stringify(this.transFrm.value.amc_id.map(item => {return item['id']}))
                  : '[]')) +
              ('&scheme_name=' +
                (this.transFrm.value.scheme_id
                  ? JSON.stringify(this.transFrm.value.scheme_id.map(item => {return item['id']}))
                  : '[]')) +
              ('&from_date=' +
                global.getActualVal(this.transFrm.getRawValue().frm_dt)) +
              ('&to_date=' + global.getActualVal(this.transFrm.getRawValue().to_dt))
              + (this.transFrm.value.btnType == 'A' ? (('&euin_no=' +
                (this.transFrm.value.euin_no
                  ? JSON.stringify(this.transFrm.value.euin_no.map(item => {return item['euin_no']}))
                  : '[]')) +
              ('&sub_brk_cd=' +
                (this.transFrm.value.sub_brk_cd
                  ? JSON.stringify(this.transFrm.value.sub_brk_cd.map(item => {return item['code']}))
                  : '[]')) +
              ('&brn_cd=' +
                (this.transFrm.value.brn_cd
                  ? JSON.stringify(this.transFrm.value.brn_cd.map(item => {return item['id']}))
                  : '[]')) +

                  ('&rm_id='+
                  JSON.stringify(this.transFrm.value.rm_name.map(item => {return item['euin_no']}))
                )+
              ('&bu_type=' +
                (this.transFrm.value.bu_type
                  ? JSON.stringify(this.transFrm.value.bu_type.map(item => {return item['bu_code']}))
                  : '[]')))  : '')) :
                  (
                     ('&login_status='+ this.transFrm.value.login_status)
                     + ('&date_status='+ this.transFrm.value.date_status)
                     + ('&start_date='+ this.transFrm.value.start_date)
                     + ('&end_date='+ this.transFrm.value.end_date)
                  ))
      )
      .pipe(map((x: any) => x.data))
      .subscribe((res: any) => {
        this.NFOMst = res.data;
        this.__paginate = res.links;
      });
  }
  }
  SelectedColumns(column){
    const clm = ['edit','app_frm_view'];
     this.__columns = column.map(({ field, header }) => ({field, header}));
     this.__exportedClmns = column.map(item => {return item['field']}).filter(res => (res!='edit' && res!='app_frm_view'))
  }
  reset(){
    this.__RmMst.length = 0;
    this.__subbrkArnMst.length = 0;
    this.__euinMst.length = 0;
    this.__bu_type.length = 0;
    this.transFrm.patchValue({
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
    });
    this.transFrm.get('amc_id').setValue([],{emitEvent:false});
    this.schemeMst.length = 0;
    this.transFrm.get('date_periods_type').setValue('',{emitEvent:false});
    this.transFrm.get('client_dtls').setValue('',{emitEvent:false});
    this.transFrm.get('tin_no').setValue('',{emitEvent:false});
    this.transFrm.get('is_all_rnt').setValue(false);
    this.transFrm.get('brn_cd').reset([],{emitEvent:false});
    this.transFrm.get('bu_type').reset([],{emitEvent:false});
    this.transFrm.get('rm_name').reset([],{emitEvent:false});
    this.transFrm.get('sub_brk_cd').reset([],{emitEvent:false});
    this.transFrm.get('euin_no').reset([],{emitEvent:false});
    this.sort = new sort();
    this.__pageNumber.setValue('10');
    this.submitNFOReport();
  }
  getAMC(){
    this.__dbIntr.api_call(0,'/amc',null).pipe(pluck("data")).subscribe((res: amc[]) =>{
           this.AMCMst = res;
    })
  }
  exportPdf(){
    this.__Rpt.downloadReport(
      '#__NFORPT__',
      {
        title: 'NFO Report',
      },
      'NFO Report'
    );
  }

  openMenu(event){
    if(event.flag == 'P'){
     const divToPrint = document.getElementById('__NFORPT');
     var WindowObject = window.open('', 'Print-Window');
      WindowObject.document.open();
      WindowObject.document.writeln('<!DOCTYPE html>');
       WindowObject.document.writeln(
         '<html><head><title></title><style type="text/css">'
       );
       WindowObject.document.writeln(
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
      WindowObject.document.writeln(
         '</head><body onload="window.print()">'
       );
      WindowObject.document.writeln(
         '<center><img src="/assets/images/logo.jpg" alt="">' +
           '<h3>NuEdge Corporate Pvt. Ltd</h3>' +
           '<h5> Day Sheet Report</h5></center>'
       );
      WindowObject.document.writeln(divToPrint.innerHTML);
      WindowObject.document.writeln(
         '<footer><small>This is an electronically generated report, hence does not require any signature</small></footer>'
       );
      WindowObject.document.writeln('</body></html>');
      WindowObject.document.close();
       setTimeout(() => {
        WindowObject.close();
       }, 100);
    }
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
      flag: 'NFO',
      product_id: this.data.trans_id ,
      trans_type_id:this.data.trans_type_id,
      id: __element.temp_tin_no ? __element.temp_tin_no : '0',
      title: 'NFO Entry',
      nfoData:__element
    };
    dialogConfig.id =__element.temp_tin_no ? __element.temp_tin_no : '0';
    try {
      const dialogref = this.__dialog.open(
        NfomodificationComponent,
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
      this.utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'NFO',
      });
    }
  }
}
