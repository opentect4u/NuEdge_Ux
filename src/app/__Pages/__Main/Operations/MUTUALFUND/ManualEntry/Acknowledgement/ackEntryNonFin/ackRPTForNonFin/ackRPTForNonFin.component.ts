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
import { rnt } from 'src/app/__Model/Rnt';
import { category } from 'src/app/__Model/__category';
import { responseDT } from 'src/app/__Model/__responseDT';
import { subcat } from 'src/app/__Model/__subcategory';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { global } from 'src/app/__Utility/globalFunc';

import { client } from 'src/app/__Model/__clientMst';
import { amc } from 'src/app/__Model/amc';
import { MfAckEntryComponent } from 'src/app/shared/core/Acknowledgement/MutualFundAcknowledgement/mf-ack-entry/mf-ack-entry.component';
import { scheme } from 'src/app/__Model/__schemeMst';
import loggedStatus from '../../../../../../../../../assets/json/loginstatus.json'
import { sort } from 'src/app/__Model/sort';
import { column } from 'src/app/__Model/tblClmns';
import { environment } from 'src/environments/environment';
import { PreviewDocumentComponent } from 'src/app/shared/core/preview-document/preview-document.component';
import { DomSanitizer } from '@angular/platform-browser';
import  ItemsPerPage from '../../../../../../../../../assets/json/itemsPerPage.json';
import { nonFinAckClms } from 'src/app/__Utility/MFColumns/ack';

type selectBtn ={
  label:string,
  value:string,
  icon:string
}
@Component({
  selector: 'app-ackRPTForNonFin',
  templateUrl: './ackRPTForNonFin.component.html',
  styleUrls: ['./ackRPTForNonFin.component.css'],
})
export class AckRPTForNonFinComponent implements OnInit {
  isOpenMegaMenu:boolean = false;
  itemsPerPage = ItemsPerPage;
  sort = new sort();
  transaction_id:number;
  selectBtn:selectBtn[] = [{ label: 'Advance Filter', value: 'A',icon:'pi pi-filter' }, { label: 'Reset', value: 'R',icon:'pi pi-refresh' }]
  displayMode_forTemp_Tin:string;
  displayMode_forClient:string;
  settingsforDropdown_foramc = this.__utility.settingsfroMultiselectDropdown('id','amc_name','Search AMC',1);
  settingsforDropdown_forscheme = this.__utility.settingsfroMultiselectDropdown('id','scheme_name','Search Scheme',1);
  settingsforDropdown_forbrnch = this.__utility.settingsfroMultiselectDropdown('id','brn_name','Search Branch',1);
  settingsforBuTypeDropdown = this.__utility.settingsfroMultiselectDropdown('bu_code','bu_type','Search Business Type',3);
 settingsforRMDropdown = this.__utility.settingsfroMultiselectDropdown('euin_no','emp_name','Search Relationship Manager',1);
 settingsforSubBrkDropdown = this.__utility.settingsfroMultiselectDropdown('code','bro_name','Search Sub Broker',1);
 settingsforEuinDropdown = this.__utility.settingsfroMultiselectDropdown('euin_no','euin_no','Search Employee',1);
  @ViewChild('searchTin') __searchTin: ElementRef;
  @ViewChild('clientCd') __clientCode: ElementRef;
  // @ViewChild('searchEUIN') __searchRlt: ElementRef;
  // @ViewChild('subBrkArn') __subBrkArn: ElementRef;
  // @ViewChild('searchAMC') __AmcSearch: ElementRef;

  __isTinspinner: boolean = false;
  __isClientPending: boolean = false;
  __isSubArnPending: boolean = false;
  __isEuinPending: boolean = false;
  __isAmcPending: boolean = false;

  amcMst: amc[] = [];
  tinMst: any = [];
  __clientMst: client[] = [];
  __subbrkArnMst: any = [];
  __euinMst: any = [];
  schemeMst:scheme[]= [];
  brnchMst: any=[];
  __RmMst;any=[];
  columns:column[]= [];
  SelectedClms:string[] = [];

  WindowObject: any;
  divToPrint: any;

  __category: category[];
  __subCat: subcat[];
  __bu_type: any=[];
  __rcvForms = new FormGroup({
    btnType: new FormControl('R'),
    date_range:new FormControl(''),
    is_all_rnt: new FormControl(false),
    is_all_status: new FormControl(false),
    options: new FormControl('2'),
    sub_brk_cd: new FormControl([],{updateOn:'blur'}),
    tin_no: new FormControl(''),
    trans_type: new FormArray([]),
    client_code: new FormControl(''),
    client_name: new FormControl(''),
    logged_status: new FormArray([]),
    amc_name: new FormControl([]),
    scheme_id: new FormControl([]),
    inv_type: new FormControl(''),
    euin_no: new FormControl([]),
    brn_cd: new FormControl([],{updateOn:'blur'}),
    bu_type: new FormControl([],{updateOn:'blur'}),
    rnt_name: new FormArray([]),
    cat_id: new FormControl(''),
    subcat_id: new FormControl(''),
    date_status: new FormControl('T'),
    start_date: new FormControl(this.getTodayDate()),
    end_date: new FormControl(this.getTodayDate()),
    login_status: new FormControl('N'),
    dt_type: new FormControl(''),
    frm_dt: new FormControl(''),
    to_dt: new FormControl(''),
    rm_id:new FormControl([],{updateOn:'blur'})
  });
  __isAdd: boolean = false;
  __isVisible: boolean = true;
  __paginate: any = [];
  __pageNumber = new FormControl('10');
  __export = new MatTableDataSource<any>([]);
  __exportedClmns: string[] = [];
  __financMst = new MatTableDataSource<any>([]);
  __columns:column[] = [];
  __trans_types: any;
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private __dialog: MatDialog,
    private __Rpt: RPTService,
    private sanitizer:DomSanitizer,
    public dialogRef: MatDialogRef<AckRPTForNonFinComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(this.data);
  }

  get logged_status(): FormArray{
    return this.__rcvForms.get('logged_status') as FormArray
   }
  getLoggedinStatus(){
    loggedStatus.forEach(el =>{
    this.logged_status.push(this.addLoggedStatusForm(el));
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
  ngAfterViewInit() {
        /** Change event occur when all rnt checkbox has been changed  */
        this.__rcvForms.controls['is_all_status'].valueChanges.subscribe(res =>{
          this.logged_status.controls.map(item => {return item.get('isChecked').setValue(res,{emitEvent:false})});
        })
        /** End */

        /** Change event inside the formArray */
        this.logged_status.valueChanges.subscribe(res =>{
        this.__rcvForms.controls['is_all_status'].setValue(res.every(item => item.isChecked),{emitEvent:false});
        })
        /*** End */

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

   this.__rcvForms.controls['dt_type'].valueChanges.subscribe((res) => {
     this.__rcvForms.controls['date_range'].reset(
        res && res != 'R' ? ([new Date(dates.calculateDT(res)),new Date(dates.getTodayDate())]) : ''
      );
      this.__rcvForms.controls['frm_dt'].reset(
        res && res != 'R' ? ((dates.calculateDT(res))) : ''
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

    // AMC SEARCH
    this.__rcvForms.controls['amc_name'].valueChanges.subscribe(res =>{
   this.getAMCwiseScheme(res);
    })
    // End

    // EUIN NUMBER SEARCH
    this.__rcvForms.controls['euin_no'].valueChanges.subscribe(res =>{})
    // End

    /**change Event of sub Broker Arn Number */
    this.__rcvForms.controls['sub_brk_cd'].valueChanges.subscribe(res =>{console.log(res)})

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

    this.__rcvForms.controls['date_status'].valueChanges.subscribe((res) => {
      if (res == 'T') {
        this.__rcvForms.controls['start_date'].setValue('');
        this.__rcvForms.controls['end_date'].setValue('');
      }
    });
     /*** Change Option i.e Details/ Summary*/
     this.__rcvForms.controls['options'].valueChanges.subscribe((res) => {
      this.setColumns(res,this.data.trans_type_id,this.transaction_id);
   })
   /*** End */

   this.__rcvForms.controls['brn_cd'].valueChanges.subscribe(res =>{
    this.getBusinessTypeMst(res)
  })
  this.__rcvForms.controls['bu_type'].valueChanges.subscribe(res =>{
    this.disabledSubBroker(res);
     this.getRelationShipManagerMst(res,this.__rcvForms.value.brn_cd);
  })
  this.__rcvForms.controls['rm_id'].valueChanges.subscribe(res =>{
    if(this.__rcvForms.value.bu_type.findIndex(item => item.bu_code == 'B') != -1){
             this.getSubBrokerMst(res);
    }
    else{
    this.__euinMst.length = 0;
      this.__euinMst = res;
    }
 })
 this.__rcvForms.controls['sub_brk_cd'].valueChanges.subscribe(res =>{
  // if(res.length > 0){
    this.setEuinDropdown(res,this.__rcvForms.value.rm_id);
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
      this.__rcvForms.controls['sub_brk_cd'].enable();
    }
    else{
      this.__rcvForms.controls['sub_brk_cd'].disable();
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
    this.__rcvForms.controls['sub_brk_cd'].setValue([]);
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
    this.__rcvForms.controls['bu_type'].reset([],{emitEvent:true});
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
    this.__rcvForms.controls['rm_id'].reset([]);
  }
  }
  getRntMst(){
    this.__dbIntr.api_call(0,'/rnt',null).pipe(pluck("data")).subscribe((res:rnt[]) =>{
      res.forEach(el =>{
           this.rnt_name.push(this.addRntForm(el));
      })
    })
  }
  addRntForm(rnt:rnt){
    return new FormGroup({
      id:new FormControl(rnt ? rnt?.id : 0),
      name:new FormControl(rnt ? rnt.rnt_name : ''),
      isChecked: new FormControl(false)
    })
  }
  get rnt_name():FormArray{
    return this.__rcvForms.get('rnt_name') as FormArray;
   }
  private getAMCwiseScheme(amc_ids){
    this.__dbIntr.api_call(0,'/scheme','arr_amc_id='+JSON.stringify(amc_ids.map(item => {return item['id']}))).pipe(pluck("data")).subscribe((res:scheme[]) =>{
      this.schemeMst = res;
    })
   }
  __transType: any = [];
  ngOnInit() {
    // this.__columns = this.__columnsForSummary;
    // this.toppings.setValue(this.__columns);
    this.getTransactionTypeDtls();
    this.getCategory();
    this.getSubCategory();
    this.getRntMst();
    this.getTransactionType();
    this.getLoggedinStatus();
    this.getAmcMst();
  }
  getAmcMst(){
    this.__dbIntr.api_call(0,'/amc',null).pipe(pluck("data")).subscribe((res:amc[]) =>{
       this.amcMst = res;
    })
  }
  getCategory() {
    this.__dbIntr
      .api_call(0, '/category', null)
      .pipe(pluck('data'))
      .subscribe((res: category[]) => {
        this.__category = res;
      });
  }
  getSubCategory() {
    this.__dbIntr
      .api_call(0, '/subcategory', null)
      .pipe(pluck('data'))
      .subscribe((res: subcat[]) => {
        this.__subCat = res;
      });
  }

  getTransactionType() {
    this.__dbIntr
      .api_call(0, '/showTrans', 'trans_type_id=' + this.data.trans_type_id)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__transType =  res.map(({id,trns_name}) => ({
          id,
          tab_name:trns_name,
          img_src:id == 1 ? '../../../../../assets/images/pip.png'
          : (id == 2 ? '../../../../../assets/images/sip.png'
          : '../../../../../assets/images/switch.png')}));
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
      .api_call(1, '/ackExport', __mfTrax)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__export = new MatTableDataSource(res);
      });
  }

  getFianancMaster(__paginate: string | null = '10') {
    this.__dbIntr
      .api_call(
        0,
        '/mfTraxShow',
        'trans_type_id=' +
          this.data.trans_type_id +
          '&paginate=' +
          __paginate +
          (this.data.trans_id ? '&trans_id=' + this.data.trans_id : '')
      )
      .pipe(map((x: responseDT) => x.data))
      .subscribe((res: any) => {
        this.setPaginator(res);
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
            ('&trans_id=' + this.transaction_id) +
              ('&client_code=' +
                (this.__rcvForms.value.client_code
                  ? this.__rcvForms.value.client_code
                  : '') +
                  ((('&ack_status=' + (JSON.stringify(this.logged_status.value.filter(item => item.isChecked).map(res => {return res['id']}))))))
                  + ('&rnt_name=' +
                  (this.__rcvForms.value.rnt_name.length > 0
                    ? JSON.stringify(this.rnt_name.value.filter(x=> x.isChecked).map(item => {return item['id']}))
                    : '')) +
                ('&tin_no=' +
                  (this.__rcvForms.value.tin_no
                    ? this.__rcvForms.value.tin_no
                    : '')) +
                ('&amc_name=' +
                  (this.__rcvForms.value.amc_name
                    ? JSON.stringify(this.__rcvForms.value.amc_name.map(item => {return item['id']}))
                    : '[]')) +
                ('&scheme_name=' +
                  (this.__rcvForms.value.scheme_id
                    ? JSON.stringify(this.__rcvForms.value.scheme_id.map(item => {return item['id']}))
                    : '')) +
                ('&from_date=' + global.getActualVal(this.__rcvForms.getRawValue().frm_dt)) +
                ('&to_date=' + global.getActualVal(this.__rcvForms.getRawValue().to_dt))
                + (this.__rcvForms.value.btnType == 'A' ? (('&euin_no=' +
                  (this.__rcvForms.value.euin_no
                    ? JSON.stringify(this.__rcvForms.value.euin_no.map(item => {return item['euin_no']}))
                    : '[]')) +
                ('&sub_brk_cd=' +
                  (this.__rcvForms.value.sub_brk_cd
                    ? JSON.stringify(this.__rcvForms.value.sub_brk_cd.map(item => {return item['code']}))
                    : '[]')) +
                ('&brn_cd=' +
                  (this.__rcvForms.value.brn_cd
                    ? JSON.stringify(this.__rcvForms.value.brn_cd.map(item => {return item['id']}))
                    : '[]')) +
                    ('&rm_id='+
                    JSON.stringify(this.__rcvForms.value.rm_id.map(item => {return item['euin_no']}))
                  )+
                ('&bu_type=' +
                  (this.__rcvForms.value.bu_type
                    ? JSON.stringify(this.__rcvForms.value.bu_type.map(item => {return item['bu_code']}))
                    : '[]')))  : ''))
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res);
        });
    } else {
      this.__dbIntr
        .api_call(0, '/mfTraxShow', 'paginate=' + this.__pageNumber)
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
      const dialogref = this.__dialog.open(
        MfAckEntryComponent,
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
        flag:
          'ACKUPLNOFIN_' + (__items.tin_no ? __items.tin_no.toString() : '0'),
      });
    }
  }
  updateRow(row_obj) {
    this.__financMst.data = this.__financMst.data.filter((value: any, key) => {
      if (value.tin_no == row_obj.tin_no) {
        (value.rnt_login_cutt_off = row_obj.rnt_login_cutt_off),
          (value.rnt_login_dt = row_obj.rnt_login_dt),
          (value.rnt_login_time = row_obj.rnt_login_dt?.split(' ')[1]),
          (value.ack_copy_scan = `${row_obj.ack_copy_scan}`),
          (value.form_status = row_obj.form_status),
          (value.ack_remarks = row_obj.ack_remarks);
      }
      return true;
    });
    this.__export.data = this.__export.data.filter((value: any, key) => {
      if (value.tin_no == row_obj.tin_no) {
        (value.rnt_login_cutt_off = row_obj.rnt_login_cutt_off),
          (value.rnt_login_dt = row_obj.rnt_login_dt),
          (value.rnt_login_time = row_obj.rnt_login_dt?.split(' ')[1]),
          (value.ack_copy_scan = `${row_obj.ack_copy_scan}`),
          (value.form_status = row_obj.form_status),
          (value.ack_remarks = row_obj.ack_remarks);
      }
      return true;
    });
  }

  getAckRPT(
    column_name: string | null = '',
    sort_by: string | null | '' = 'asc'
  ) {
    const __mfTrax = new FormData();
    __mfTrax.append('paginate', this.__pageNumber.value);
    __mfTrax.append('option', this.__rcvForms.value.options);
    __mfTrax.append('trans_id',this.transaction_id.toString());
    __mfTrax.append('trans_type_id' ,this.data.trans_type_id);
    __mfTrax.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
    __mfTrax.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
    __mfTrax.append('ack_status',JSON.stringify(this.logged_status.value.filter(item => item.isChecked).map(res => {return res['id']})));
    __mfTrax.append('from_date',this.__rcvForms.getRawValue().frm_dt? this.__rcvForms.getRawValue().frm_dt: '');
    __mfTrax.append('to_date',this.__rcvForms.getRawValue().to_dt? this.__rcvForms.getRawValue().to_dt: '');
    __mfTrax.append('client_code',this.__rcvForms.value.client_code? this.__rcvForms.value.client_code: '');
    __mfTrax.append('tin_no',this.__rcvForms.value.tin_no ? this.__rcvForms.value.tin_no : '');
    __mfTrax.append('amc_name',this.__rcvForms.value.amc_name ? JSON.stringify(this.__rcvForms.value.amc_name.map(item => {return item["id"]})) : '[]');
    __mfTrax.append('scheme_name',this.__rcvForms.value.scheme_id ? JSON.stringify(this.__rcvForms.value.scheme_id.map(item => {return item["id"]})) : '[]');
   __mfTrax.append('rnt_name',JSON.stringify(this.rnt_name.value.filter(x=> x.isChecked).map(item => {return item['id']})));
      if(this.__rcvForms.value.btnType == 'A'){
      __mfTrax.append('sub_brk_cd',this.__rcvForms.value.sub_brk_cd ? JSON.stringify(this.__rcvForms.value.sub_brk_cd.map(item => {return item["code"]})) : '[]');
      __mfTrax.append('euin_no',this.__rcvForms.value.euin_no ? JSON.stringify(this.__rcvForms.value.euin_no.map(item => {return item["euin_no"]})) : '[]');
      __mfTrax.append('brn_cd',this.__rcvForms.value.brn_cd ? JSON.stringify(this.__rcvForms.value.brn_cd.map(item => {return item["id"]})) : '[]');
       __mfTrax.append('rm_id',this.__rcvForms.value.rm_id ? JSON.stringify(this.__rcvForms.value.rm_id.map(item => {return item["euin_no"]})) : '[]')
      __mfTrax.append('bu_type',this.__rcvForms.value.bu_type? JSON.stringify(this.__rcvForms.value.bu_type.map(item => {return item["bu_code"]})): '[]');
    }
    this.__dbIntr
      .api_call(1, '/ackDetailSearch', __mfTrax)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        // this.__paginate = res.links;
        this.setPaginator(res);
        this.tableExport(__mfTrax);
      });
  }

  submit() {
    this.getAckRPT();
  }
  exportPdf() {
      this.__Rpt.downloadReport(
        '#AckRPT',
        {
          title: 'Acknowledgement Report For NonFinancial - ' + new Date().toLocaleDateString(),
        },
        'NonFinancialAcknowledgementReport',
        'l',
        this.__rcvForms.value.options == 1 ?  [1500,792] : [950,792],
        this.__exportedClmns.length
      );
  }

  getminDate() {
    return dates.getminDate();
  }
  getTodayDate() {
    return dates.getTodayDate();
  }

  reset() {
    this.__RmMst.length = 0;
    this.__subbrkArnMst.length = 0;
    this.__euinMst.length = 0;
    this.__bu_type.length = 0;
    this.__rcvForms.patchValue({
      date_range:'',
      option:'2',
      client_code:'',
      scheme_id:[],
      frm_dt:'',
      to_dt:'',
      rm_id:[]
    });
    this.__rcvForms.get('amc_name').setValue([],{emitEvent:false});
    this.schemeMst.length = 0;
    this.__rcvForms.get('dt_type').setValue('',{emitEvent:false});
    this.__rcvForms.get('client_name').setValue('',{emitEvent:false});
    this.__rcvForms.get('tin_no').setValue('',{emitEvent:false});
    this.__rcvForms.get('is_all_rnt').setValue(false);
    this.__rcvForms.get('is_all_status').setValue(false);
    this.__rcvForms.get('brn_cd').reset([],{emitEvent:false});
    this.__rcvForms.get('bu_type').reset([],{emitEvent:false});
    this.__rcvForms.get('rm_id').reset([],{emitEvent:false});
    this.__rcvForms.get('sub_brk_cd').reset([],{emitEvent:false});
    this.__rcvForms.get('euin_no').reset([],{emitEvent:false});
    this.sort = new sort();
    this.__pageNumber.setValue('10');
    this.submit();
  }

  // outsideClickforClient(__ev) {
  //   if (__ev) {
  //     this.searchResultVisibilityForClient('none');
  //   }
  // }
  // outsideClickforSubBrkArn(__ev) {
  //   if (__ev) {
  //     this.searchResultVisibilityForSubBrk('none');
  //   }
  // }
  // outsideClick(__ev) {
  //   if (__ev) {
  //     this.searchResultVisibility('none');
  //   }
  // }
  // outsideClickForAMC(__ev) {
  //   if (__ev) {
  //     this.searchResultVisibilityForAMC('none');
  //   }
  // }
  // searchResultVisibility(display_mode) {
  //   this.__searchRlt.nativeElement.style.display = display_mode;
  // }
  /** Search Result Off against Sub Broker */
  // searchResultVisibilityForSubBrk(display_mode) {
  //   this.__subBrkArn.nativeElement.style.display = display_mode;
  // }
  searchResultVisibilityForClient(display_mode) {
    this.displayMode_forClient = display_mode;
  }
  searchResultVisibilityForTin(display_mode) {
    this.displayMode_forTemp_Tin = display_mode;
  }
  // searchResultVisibilityForAMC(display_mode) {
  //   this.__AmcSearch.nativeElement.style.display = display_mode;
  // }

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

  TabDetails(ev){
   this.transaction_id = ev.tabDtls.id;
   this.submit();
   this.setColumns(this.__rcvForms.value.options,this.data.trans_type_id,this.transaction_id);
  }
  onItemClick(ev){
    if(ev.option.value == 'A'){
      this.getBranchMst();
   }
   else{
      this.reset()
   }
  }
  getBranchMst(){
    this.__dbIntr.api_call(0,'/branch',null).pipe(pluck("data")).subscribe(res =>{
      this.brnchMst = res
  })
  }
  close(ev){
    this.__rcvForms.patchValue({
     frm_dt: this.__rcvForms.getRawValue().date_range ? dates.getDateAfterChoose(this.__rcvForms.getRawValue().date_range[0]) : '',
     to_dt: this.__rcvForms.getRawValue().date_range ? (global.getActualVal(this.__rcvForms.getRawValue().date_range[1]) ?  dates.getDateAfterChoose(this.__rcvForms.getRawValue().date_range[1]) : '') : ''
    });
  }
  getSelectedItemsFromParent(res){
    this.getItems(res.item,res.flag)
  }
  setColumns(option,trans_type_id,trns_id){
    const clm = ['edit','app_frm_view'];
    var columnsMst;
    switch(trns_id){
      case 32:columnsMst =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.CMOH);
              break;
      case 22:columnsMst =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.AC);
              break;
      case 18:columnsMst  =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.COCD);
              break;
      case 23:columnsMst  =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.CON);
      break;
      case 16:columnsMst  =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.CBU);
      break;
      case 15:columnsMst  =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.COBK);
      break;
      case 33:columnsMst  =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.FCM);
      break;
      case 14:columnsMst  =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.COB);
      break;
      case 11:
      case 21:columnsMst  =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.NA_OR_NC);break;
      case 30: columnsMst  =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.SWPR);break;
      case 31:columnsMst  =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.STP_REGISTRATION);break;
      case 19:columnsMst =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.TRANSMISSION);break
      case 29:columnsMst =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.REDEMPTION);break
      case 36:
      case 37:
      case 38:columnsMst = global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.PAUSE)
              break;
      case 7:
      case 8:
      case 9:columnsMst = global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.CANCELATION)
              break;
      default:columnsMst = nonFinAckClms.COLUMN_SELECTOR
              break;
    }
    this.columns = columnsMst;
     if(option == 2){
       this.__columns =  nonFinAckClms.SUMMARY_COPY;
     }
     else{
      this.__columns = this.columns;
     }
     this.SelectedClms = this.__columns.map((x) => x.field);
     this.__exportedClmns =  this.__columns.map(item => {return item['field']}).filter(x => !clm.includes(x));
  }
  customSort(ev){
    this.sort.order = ev.sortOrder;
    this.sort.field = ev.sortField;
    if(ev.sortField){
     this.getAckRPT();
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
    this.submit();
  }
  SelectedColumns(column){
    const clm = ['edit','app_frm_view'];
    this.__columns = column.map(({ field, header }) => ({field, header}))
    this.__exportedClmns =  column.map(item => {return item['field']}).filter(x => !clm.includes(x));
  }
}
