import {
  Component,
  OnInit,
  Inject,
  ViewChildren,
  QueryList,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
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
import buType from '../../../../../../../../../../../assets/json/buisnessType.json';
import { client } from 'src/app/__Model/__clientMst';
import { amc } from 'src/app/__Model/amc';
import { global } from 'src/app/__Utility/globalFunc';
import { NonfinmodificationComponent } from '../nonFinModification/nonFInModification.component';
import popupMenu from '../../../../../../../../../../../assets/json/Master/daySheetOpt.json'
import  itemsPerPage from '../../../../../../../../../../../assets/json/itemsPerPage.json';
import { scheme } from 'src/app/__Model/__schemeMst';
import { nonFinClms } from 'src/app/__Utility/MFColumns/nonfinClmns';
import { column } from 'src/app/__Model/tblClmns';
import { sort } from 'src/app/__Model/sort';
import { environment } from 'src/environments/environment';
import { PreviewDocumentComponent } from 'src/app/shared/core/preview-document/preview-document.component';
import { DomSanitizer } from '@angular/platform-browser';
type selectBtn ={
  label:string,
  value:string,
  icon:string
}
@Component({
  selector: 'nonFinRPT-component',
  templateUrl: './nonFinRPT.component.html',
  styleUrls: ['./nonFinRPT.component.css'],
})
export class NonfinrptComponent implements OnInit {
  WindowObject: any;
  printPdf:any=[];
  divToPrint: any;
  daysheetpopupMenu = popupMenu;
  transaction_id;
  selectNonFin: any;
  __istemporaryspinner:boolean = false;
  __isClientPending:boolean = false;
  isOpenMegaMenu:boolean = false;
  __isVisible: boolean = true;
  __paginate: any=[];
  tempTinMst: any =[];
  brnchMst: any=[];
  itemsPerPage:selectBtn[] = itemsPerPage;
  __clientMst:client[] =[];
  AMCMst: amc[] = []; /**Holding AMC Master Data */
  schemeMst:scheme[] = [] /*** Holding R&T Master Data */
  __bu_type: any=[];
  __RmMst: any=[];
  __subbrkArnMst:any=[];
  __euinMst: any=[];
  columns:column[] = []
  __columns:column[] =[];
  __exportedClmns:string[]=[];
  SelectedClms:string[] = [];
  trnsMst: any=[];
  displayMode_forTemp_Tin:string;
  displayMode_forClient:string;
  nonFinDT:any=[];
  exportDT= new MatTableDataSource([]);
  __pageNumber = new FormControl('10');

  settingsforDropdown_foramc = this.utility.settingsfroMultiselectDropdown('id','amc_name','Search AMC',1);
  settingsforDropdown_forscheme = this.utility.settingsfroMultiselectDropdown('id','scheme_name','Search Scheme',1);
  settingsforDropdown_forbrnch = this.utility.settingsfroMultiselectDropdown('id','brn_name','Search Branch',1);
  settingsforBuTypeDropdown = this.utility.settingsfroMultiselectDropdown('bu_code','bu_type','Search Business Type',3);
 settingsforRMDropdown = this.utility.settingsfroMultiselectDropdown('euin_no','emp_name','Search Relationship Manager',1);
 settingsforSubBrkDropdown = this.utility.settingsfroMultiselectDropdown('code','bro_name','Search Sub Broker',1);
 settingsforEuinDropdown = this.utility.settingsfroMultiselectDropdown('euin_no','euin_no','Search Employee',1);
  // settingsforDropdown_foramc = this.utility.settingsfroMultiselectDropdown('id','amc_name','Search AMC',1);
  //  settingsforDropdown_forscheme = this.utility.settingsfroMultiselectDropdown('id','scheme_name','Search Scheme',1);
  //  settingsforDropdown_forbrnch = this.utility.settingsfroMultiselectDropdown('id','brn_name','Search Branch',1);
  //  settingsforBuTypeDropdown = this.utility.settingsfroMultiselectDropdown('id','bu_type','Search Business Type',1);
  // settingsforRMDropdown = this.utility.settingsfroMultiselectDropdown('id','rm_name','Search Relationship Manager',1);
  // settingsforSubBrkDropdown = this.utility.settingsfroMultiselectDropdown('id','sub_brk_cd','Search Sub Broker',1);
  // settingsforEuinDropdown = this.utility.settingsfroMultiselectDropdown('id','emp_name','Search Employee',1);
  sort = new sort();
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
    brn_cd: new FormControl([], { updateOn: 'blur' }),
    bu_type: new FormControl([], { updateOn: 'blur' }),
    rm_name: new FormControl([], { updateOn: 'blur' }),
    sub_brk_cd: new FormControl([], { updateOn: 'blur' }),
    euin_no: new FormControl([]),
    frm_dt: new FormControl(''),
    to_dt: new FormControl('')
  });
  /*** End */
  selectBtn:selectBtn[] = [{ label: 'Advance Filter', value: 'A',icon:'pi pi-filter' }, { label: 'Reset', value: 'R',icon:'pi pi-refresh' }]

  constructor(
    private overlay: Overlay,
    private utility: UtiliService,
    private __dbIntr: DbIntrService,
    private __dialog: MatDialog,
    private __Rpt: RPTService,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<NonfinrptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    this.getAMC();/****Get AMC Master Data from backend  */
    this.getRntMst(); /****Get R&T Master Data from backend  */
    this.getTransactionAgainstParticularTransactionType(this.data.product_id,this.data.trans_type_id);
  }
  getRntMst(){
    this.__dbIntr.api_call(0,'/rnt',null).pipe(pluck("data")).subscribe((res:  rnt[]) =>{
      res.map((el:rnt) => this.rnt_id.push(this.setRntForm(el)));
  })
  }
  getminDate() {
    return dates.getminDate();
  }
  getTodayDate() {
    return dates.getTodayDate();
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
  /*** End */
  /** Rnt Form Array */
  get rnt_id(): FormArray{
    return this.transFrm.get('rnt_id') as FormArray;
   }
  /** End */

  minimize() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.updateSize('40%', '45px');
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

/** End */
submitNonFinReport(){
  const finFrmDT = new FormData();
  finFrmDT.append('paginate',this.__pageNumber.value);
  finFrmDT.append('option', this.transFrm.value.option);
  finFrmDT.append('trans_id', this.transaction_id.toString());
  finFrmDT.append('trans_type_id' ,this.data.trans_type_id.toString());
  finFrmDT.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
  finFrmDT.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));

  if(this.transFrm.value.option != 3){
    finFrmDT.append('from_date',global.getActualVal(this.transFrm.getRawValue().frm_dt));
   finFrmDT.append(
      'to_date',global.getActualVal(this.transFrm.getRawValue().to_dt));
    finFrmDT.append(
      'client_code',
      this.transFrm.value.client_code
        ? this.transFrm.value.client_code
        : ''
    );
    finFrmDT.append('rnt_name',
    JSON.stringify(this.rnt_id.value.filter(x=> x.isChecked).map(item => {return item['id']}))
    );

    finFrmDT.append(
      'tin_no',
      this.transFrm.value.tin_no ? this.transFrm.value.tin_no : ''
    );
    finFrmDT.append(
      'amc_name',
      this.transFrm.value.amc_id ? JSON.stringify(this.transFrm.value.amc_id.map(item => {return item["id"]})) : '[]'
    );
    finFrmDT.append(
      'scheme_name',
      this.transFrm.value.scheme_id ? JSON.stringify(this.transFrm.value.scheme_id.map(item => {return item["id"]})) : '[]'
    );
    if(this.transFrm.value.btnType == 'A'){
     finFrmDT.append(
       'sub_brk_cd',
       this.transFrm.value.sub_brk_cd ? JSON.stringify(this.transFrm.value.sub_brk_cd.map(item => {return item['code']})) : ''
     );
    finFrmDT.append(
      'euin_no',
      this.transFrm.value.euin_no ? JSON.stringify(this.transFrm.value.euin_no.map(item => {return item['euin_no']})) : '[]'
    );
    finFrmDT.append(
      'brn_cd',
      this.transFrm.value.brn_cd ? JSON.stringify(this.transFrm.value.brn_cd.map(item => {return item['id']})) : '[]'
    );
    finFrmDT.append(
     'rm_id',
    JSON.stringify(this.transFrm.value.rm_name.map(item => {return item['euin_no']}))
    )

    finFrmDT.append(
      'bu_type',
      this.transFrm.value.bu_type ?
      JSON.stringify(this.transFrm.value.bu_type.map(item => {return item['bu_code']})): '[]'
    );
   }}
   else{
    finFrmDT.append('login_status', this.transFrm.value.login_status);
    finFrmDT.append('date_status', this.transFrm.value.date_status);
    finFrmDT.append('start_date', this.transFrm.value.start_date);
    finFrmDT.append('end_date', this.transFrm.value.end_date);
   }
   this.__dbIntr.api_call(1,'/mfTraxDetailSearch',finFrmDT).pipe(pluck("data")).subscribe((res: any) =>{
    this.nonFinDT = res.data;
    this.__paginate = res.links;
    this.getExportDT(finFrmDT);
   })
}
 getExportDT(nonFinfrmDT){
  this.__dbIntr.api_call(1,'/mfTraxExport',nonFinfrmDT).pipe(pluck("data")).subscribe((res: any) =>{
    this.exportDT = new MatTableDataSource(res.data);
   })
 }

  onItemClick(ev){
    if(ev.option.value == 'A'){
      this.getBranchMst();
     }
     else{
       this.reset();
     }
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
    this.submitNonFinReport();
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
    this.getItems(ev.item,ev.flag)
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
   searchResultVisibilityForTempTin(display_mode){
    this.displayMode_forTemp_Tin = display_mode;
  }
  searchResultVisibilityForClient(display_mode){
    this.displayMode_forClient = display_mode;
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
       dt?.length > 1 ? this.__dbIntr.ReportTINSearch('/mfTraxShow', dt+'&trans_type_id='+this.data.trans_type_id+'&trans_id='+this.transaction_id) : []
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
      this.setColumns(res,this.data.trans_type_id,this.transaction_id);
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
    this.setEuinDropdown(res,this.transFrm.value.rm_name);
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
  setColumns(option,trans_type_id,trns_id){
    const clm = ['edit','app_frm_view'];

    var columnsMst;
    switch(trns_id){

      case 32:columnsMst =global.getColumnsAfterMerge(nonFinClms.COLUMN_SELECTOR,nonFinClms.CMOH);
              break;
      case 22:columnsMst =global.getColumnsAfterMerge(nonFinClms.COLUMN_SELECTOR,nonFinClms.AC);
              break;
      case 18:columnsMst  =global.getColumnsAfterMerge(nonFinClms.COLUMN_SELECTOR,nonFinClms.COCD);
              break;
      case 23:columnsMst  =global.getColumnsAfterMerge(nonFinClms.COLUMN_SELECTOR,nonFinClms.CON);
      break;
      case 16:columnsMst  =global.getColumnsAfterMerge(nonFinClms.COLUMN_SELECTOR,nonFinClms.CBU);
      break;
      case 15:columnsMst  =global.getColumnsAfterMerge(nonFinClms.COLUMN_SELECTOR,nonFinClms.COBK);
      break;
      case 33:columnsMst  =global.getColumnsAfterMerge(nonFinClms.COLUMN_SELECTOR,nonFinClms.FCM);
      break;
      case 14:columnsMst  =global.getColumnsAfterMerge(nonFinClms.COLUMN_SELECTOR,nonFinClms.COB);
      break;
      case 11:
      case 21:columnsMst  =global.getColumnsAfterMerge(nonFinClms.COLUMN_SELECTOR,nonFinClms.NA_OR_NC);break;
      case 30: columnsMst  =global.getColumnsAfterMerge(nonFinClms.COLUMN_SELECTOR,nonFinClms.SWPR);break;
      case 31:columnsMst  =global.getColumnsAfterMerge(nonFinClms.COLUMN_SELECTOR,nonFinClms.STP_REGISTRATION);break;
      case 19:columnsMst =global.getColumnsAfterMerge(nonFinClms.COLUMN_SELECTOR,nonFinClms.TRANSMISSION);break
      case 29:columnsMst =global.getColumnsAfterMerge(nonFinClms.COLUMN_SELECTOR,nonFinClms.REDEMPTION);break
      case 36:
      case 37:
      case 38:columnsMst = global.getColumnsAfterMerge(nonFinClms.COLUMN_SELECTOR,nonFinClms.PAUSE)
              break;
      case 7:
      case 8:
      case 9:columnsMst = global.getColumnsAfterMerge(nonFinClms.COLUMN_SELECTOR,nonFinClms.CANCELATION)
              break;
      default:columnsMst = nonFinClms.COLUMN_SELECTOR
              break;
    }
    this.columns = columnsMst
     if(option ==2){
       this.__columns =  nonFinClms.SUMMARY_COPY;
     }
     else if(option == 3){
      this.__columns =   nonFinClms.SUMMARY_COPY.filter(x => !clm.includes(x.field));
      this.printPdf =  this.__columns;
    }
     else{
      this.__columns = this.columns;
     }
     this.SelectedClms = this.__columns.map((x) => x.field);
     this.__exportedClmns =  this.__columns.map(item => {return item['field']}).filter(x => !clm.includes(x));
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
  TabDetails(ev){
    this.transaction_id = ev.tabDtls.id;
    this.submitNonFinReport();
    this.setColumns(this.transFrm.value.option,this.data.trans_type_id,this.transaction_id);
  }
  customSort(ev){
    this.sort.field =ev.sortField;
    this.sort.order =ev.sortOrder;
    if(ev.sortField){
      this.submitNonFinReport();
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
    this.submitNonFinReport();
  }
  SelectedColumns(column){
    const clm = ['edit','app_frm_view'];
    this.__columns = column.map(({ field, header }) => ({field, header}))
    this.__exportedClmns =  column.map(item => {return item['field']}).filter(x => !clm.includes(x));
  }
  getAMC(){
    this.__dbIntr.api_call(0,'/amc',null).pipe(pluck("data")).subscribe((res: amc[]) =>{
           this.AMCMst = res;
    })
  }
  getPaginate(__paginate){

    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&option=' + this.transFrm.value.option) +
            ('&trans_type_id=' + this.data.trans_type_id) +
            ('&trans_id=' + this.transaction_id) +
             (this.transFrm.value.option != 3 ?
              ('&client_code=' +
                (this.transFrm.value.client_code
                  ? this.transFrm.value.client_code
                  : '') +
                  ('&rnt_name=' +
                  (this.transFrm.value.rnt_id.length > 0
                    ? JSON.stringify(this.rnt_id.value.filter(x=> x.isChecked).map(item => {return item['id']}))
                    : '')) +
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
                    : '')) +
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
          this.nonFinDT = res.data;
          this.__paginate = res.links;
        });
    }
  }
  exportPdf(){
    this.__Rpt.downloadReport(
      '#__nonfinRPT',
      {
        title: 'Non Financial Report - ' + new Date().toLocaleDateString(),
      },
      'Non Financial Report',
      'l',
      this.transFrm.value.options == 1 ? [1000,792] : [],
      this.__exportedClmns.length
    );
  }
  openMenu(ev){
    if(ev.flag == 'P'){
      this.divToPrint = document.getElementById('printNonFinRPT');
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
  populateDT(__element) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '60%';
    dialogConfig.hasBackdrop = false;
    dialogConfig.disableClose = true;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.id = 'NonFin_' + __element.temp_tin_no;
    dialogConfig.data = {
      id: __element.temp_tin_no,
      title: 'Non Financial Entry',
      data: __element,
      trans_type: 'N',
      parent_id: this.data.product_id,
      trans_type_id:this.data.trans_type_id,
      flag:'NonFin_'+ __element.temp_tin_no
    };
    dialogConfig.autoFocus = false;
    try{
      const dialogref = this.__dialog.open(NonfinmodificationComponent, dialogConfig);
    }
    catch(ex){
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('60%');
      this.utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag:'NonFin_'+ __element.temp_tin_no
      });
    }

  }

}
