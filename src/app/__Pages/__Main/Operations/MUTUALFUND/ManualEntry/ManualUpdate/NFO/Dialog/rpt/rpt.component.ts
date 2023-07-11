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
import buType from '../../../../../../../../../../assets/json/buisnessType.json';
import { global } from 'src/app/__Utility/globalFunc';
import { ManualUpdateEntryForMFComponent } from 'src/app/shared/manual-update-entry-for-mf/manual-update-entry-for-mf.component';
import { client } from 'src/app/__Model/__clientMst';
import { amc } from 'src/app/__Model/amc';
import { scheme } from 'src/app/__Model/__schemeMst';

import updateStatus from '../../../../../../../../../../assets/json/updateStatus.json';
import { MfackClmns } from 'src/app/__Utility/MFColumns/ack';
import { column } from 'src/app/__Model/tblClmns';
import { sort } from 'src/app/__Model/sort';
import { environment } from 'src/environments/environment';
import { PreviewDocumentComponent } from 'src/app/shared/core/preview-document/preview-document.component';
import { DomSanitizer } from '@angular/platform-browser';
import ItemsPerPage from '../../../../../../../../../../assets/json/itemsPerPage.json';
type selectBtn ={
  label:string,
  value:string,
  icon:string
}
@Component({
  selector: 'app-rpt',
  templateUrl: './rpt.component.html',
  styleUrls: ['./rpt.component.css'],
})
export class RPTComponent implements OnInit {
  itemsPerPage = ItemsPerPage;
  sort = new sort()
  settingsforDropdown_foramc = this.__utility.settingsfroMultiselectDropdown('id','amc_name','Search AMC',1);
  settingsforDropdown_forscheme = this.__utility.settingsfroMultiselectDropdown('id','scheme_name','Search Scheme',1);
  settingsforDropdown_forbrnch = this.__utility.settingsfroMultiselectDropdown('id','brn_name','Search Branch',1);
  settingsforBuTypeDropdown = this.__utility.settingsfroMultiselectDropdown('bu_code','bu_type','Search Business Type',3);
 settingsforRMDropdown = this.__utility.settingsfroMultiselectDropdown('euin_no','emp_name','Search Relationship Manager',1);
 settingsforSubBrkDropdown = this.__utility.settingsfroMultiselectDropdown('code','bro_name','Search Sub Broker',1);
 settingsforEuinDropdown = this.__utility.settingsfroMultiselectDropdown('euin_no','euin_no','Search Employee',1);
  selectBtn:selectBtn[] = [{ label: 'Advance Filter', value: 'A',icon:'pi pi-filter' }, { label: 'Reset', value: 'R',icon:'pi pi-refresh' }]
  transaction_id:number;
  __ackForm = new FormGroup({
    is_all: new FormControl(false),
    is_all_status: new FormControl(false),
    update_status_id: new FormArray([]),
    tin_no: new FormControl(''),
    client_code: new FormControl(''),
    client_name: new FormControl(''),
    date_range: new FormControl(''),
    dt_type: new FormControl(''),
    frm_dt: new FormControl(''),
    to_dt: new FormControl(''),
    rnt_id: new FormArray([]),
    amc_id: new FormControl([],{updateOn:'blur'}),
    brn_cd: new FormControl([],{updateOn:'blur'}),
    rm_id: new FormControl([],{updateOn:'blur'}),
    bu_type: new FormControl([],{updateOn:'blur'}),
    sub_brk_cd: new FormControl([],{updateOn:'blur'}),
    euin_no: new FormControl([]),
    options: new FormControl('2'),
    btnType: new FormControl('R'),
    scheme_id:new FormControl([])
})

  __isTinspinner: boolean = false;
  __isClientPending: boolean = false;
  // __isSubArnPending: boolean = false;
  // __isEuinPending: boolean = false;
  // __isAmcPending: boolean = false;
  displayMode_forTemp_Tin:string;
  displayMode_forClient:string;
  tinMst: any = [];
  __clientMst: client[] = [];
  __subbrkArnMst: any = [];
  __euinMst: any = [];
  __RmMst: any =[];
  amcMst: amc[] = [];
  schemeMst:scheme[] =[];
  brnchMst: any =[];
  // __bu_type = buType;
  __bu_type: any =[]
  clmList:column[] =[]
  __columns:column[] =[];
  SelectedClms:string[] =[];
  __isVisible: boolean = true;
  __paginate: any = [];
  __pageNumber = new FormControl('10');
  __export = new MatTableDataSource<any>([]);
  __exportedClmns: string[] = [];
  __financMst = new MatTableDataSource<any>([]);
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private __dialog: MatDialog,
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<RPTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) {}

  ngAfterViewInit() {
    this.__ackForm.controls['dt_type'].valueChanges.subscribe((res) => {
      this.__ackForm.controls['date_range'].reset(
         res && res != 'R' ? ([new Date(dates.calculateDT(res)),new Date(dates.getTodayDate())]) : ''
       );
       this.__ackForm.controls['frm_dt'].reset(
         res && res != 'R' ? ((dates.calculateDT(res))) : ''
       );
       this.__ackForm.controls['to_dt'].reset(
         res && res != 'R' ? dates.getTodayDate() : ''
       );

       if (res && res != 'R') {
         this.__ackForm.controls['date_range'].disable();
       } else {
         this.__ackForm.controls['date_range'].enable();
       }
     });
       /** Change event occur when all rnt checkbox has been changed  */
       this.__ackForm.controls['is_all'].valueChanges.subscribe(res =>{
         this.rnt_id.controls.map(item => {return item.get('isChecked').setValue(res,{emitEvent:false})});
       })
       /** End */

       /** Change event inside the formArray */
       this.rnt_id.valueChanges.subscribe(res =>{
       this.__ackForm.controls['is_all'].setValue(res.every(item => item.isChecked),{emitEvent:false});
       })
       /*** End */


       /** Change event occur when all rnt checkbox has been changed  */
       this.__ackForm.controls['is_all_status'].valueChanges.subscribe(res =>{
         this.update_status_id.controls.map(item => {return item.get('isChecked').setValue(res,{emitEvent:false})});
       })
       /** End */

       /** Change event inside the formArray */
       this.update_status_id.valueChanges.subscribe(res =>{
       this.__ackForm.controls['is_all_status'].setValue(res.every(item => item.isChecked),{emitEvent:false});
       })
       /*** End */

     this.__ackForm.controls['amc_id'].valueChanges.subscribe((res) => {
        this.getAMCwiseScheme(res);
     })

  //   /** Client Code Change */
    this.__ackForm.controls['client_name'].valueChanges
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

  //   /** End */

  //   // Tin Number Search
    this.__ackForm.controls['tin_no'].valueChanges
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
      this.__ackForm.controls['options'].valueChanges.subscribe((res) => {
        this.setColumns(this.transaction_id,res);
    });

    this.__ackForm.controls['brn_cd'].valueChanges.subscribe(res =>{
      this.getBusinessTypeMst(res)
    })
    this.__ackForm.controls['bu_type'].valueChanges.subscribe(res =>{
      this.disabledSubBroker(res);
       this.getRelationShipManagerMst(res,this.__ackForm.value.brn_cd);
    })
    this.__ackForm.controls['rm_id'].valueChanges.subscribe(res =>{
      if(this.__ackForm.value.bu_type.findIndex(item => item.bu_code == 'B') != -1){
               this.getSubBrokerMst(res);
      }
      else{
      this.__euinMst.length = 0;
        this.__euinMst = res;
      }
   })
   this.__ackForm.controls['sub_brk_cd'].valueChanges.subscribe(res =>{
    // if(res.length > 0){
      this.setEuinDropdown(res,this.__ackForm.value.rm_id);
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
      this.__ackForm.controls['sub_brk_cd'].enable();
    }
    else{
      this.__ackForm.controls['sub_brk_cd'].disable();
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
    this.__ackForm.controls['sub_brk_cd'].setValue([]);
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
    this.__ackForm.controls['bu_type'].reset([],{emitEvent:true});
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
    this.__ackForm.controls['rm_id'].reset([]);
  }
  }
  __transType: any = [];
  ngOnInit() {
  this.getTransactionType();
  this.getAmcMst();
  this.getRntMst();
  this.getupdateStatus();
  }
  getBranchMst(){
    this.__dbIntr.api_call(0,'/branch',null).pipe(pluck("data")).subscribe(res =>{
        this.brnchMst = res
    })
  }
  private getAMCwiseScheme(amc_ids){
    this.__dbIntr.api_call(0,'/scheme','arr_amc_id='+JSON.stringify(amc_ids.map(item => {return item['id']}))).pipe(pluck("data")).subscribe((res:scheme[]) =>{
      this.schemeMst = res;
    })
   }
  get rnt_id():FormArray{
    return this.__ackForm.get('rnt_id') as FormArray;
   }
   get update_status_id(): FormArray{
    return this.__ackForm.get('update_status_id') as FormArray
   }
  getupdateStatus(){
    updateStatus.forEach(el =>{
    this.update_status_id.push(this.addUpdateStatusForm(el));
    })
  }
  getRntMst(){
    this.__dbIntr.api_call(0,'/rnt',null).pipe(pluck("data")).subscribe((res:rnt[]) =>{
      res.forEach(el =>{
           this.rnt_id.push(this.addRntForm(el));
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
  addUpdateStatusForm(loggedStatus){
    return new FormGroup({
      id:new FormControl(loggedStatus ? loggedStatus?.id : 0),
      name:new FormControl(loggedStatus ? loggedStatus?.name : 0),
      value:new FormControl(loggedStatus ? loggedStatus.value : ''),
      isChecked:new FormControl(false),
    })
  }
  getAmcMst(){
    this.__dbIntr.api_call(0,'/amc',null).pipe(pluck("data")).subscribe((res: amc[]) =>{
      this.amcMst = res;
    })
  }
  // uncheckAll_buType() {
  //   this.__buTypeChecked.forEach((element: any) => {
  //     element.checked = false;
  //   });
  // }
  // checkAll_buType() {
  //   this.__buTypeChecked.forEach((element: any) => {
  //     element.checked = true;
  //   });
  // }

  // uncheckAll_trnsType() {
  //   this.__trnsTypeChecked.forEach((element: any) => {
  //     element.checked = false;
  //   });
  // }
  // checkAll_trnsType() {
  //   this.__trnsTypeChecked.forEach((element: any) => {
  //     element.checked = true;
  //   });
  // }

  // uncheckAll_rnt() {
  //   this.__rntChecked.forEach((element: any) => {
  //     element.checked = false;
  //   });
  // }
  // checkAll_rnt() {
  //   this.__rntChecked.forEach((element: any) => {
  //     element.checked = true;
  //   });
  // }

  getManualUpdateRPT(column_name: string | null = '', sort_by: string | null | '' = '') {
    const __mfTrax = new FormData();
    __mfTrax.append('paginate', this.__pageNumber.value);
    __mfTrax.append('option', this.__ackForm.value.options);
    __mfTrax.append('trans_id',this.transaction_id.toString());
    __mfTrax.append('trans_type_id' ,this.data.trans_type_id);
    __mfTrax.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
    __mfTrax.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
    __mfTrax.append('update_status_id',JSON.stringify(this.update_status_id.value.filter(item => item.isChecked).map(res => {return res['id']})));
    __mfTrax.append('from_date',this.__ackForm.getRawValue().frm_dt? this.__ackForm.getRawValue().frm_dt: '');
    __mfTrax.append('to_date',this.__ackForm.getRawValue().to_dt? this.__ackForm.getRawValue().to_dt: '');
    __mfTrax.append('client_code',this.__ackForm.value.client_code? this.__ackForm.value.client_code: '');
    __mfTrax.append('tin_no',this.__ackForm.value.tin_no ? this.__ackForm.value.tin_no : '');
    __mfTrax.append('amc_name',this.__ackForm.value.amc_id ? JSON.stringify(this.__ackForm.value.amc_id.map(item => {return item["id"]})) : '[]');
    __mfTrax.append('scheme_name',this.__ackForm.value.scheme_id ? JSON.stringify(this.__ackForm.value.scheme_id.map(item => {return item["id"]})) : '[]');
   __mfTrax.append('rnt_name',JSON.stringify(this.rnt_id.value.filter(x=> x.isChecked).map(item => {return item['id']})));
      if(this.__ackForm.value.btnType == 'A'){
      __mfTrax.append('sub_brk_cd',this.__ackForm.value.sub_brk_cd ? JSON.stringify(this.__ackForm.value.sub_brk_cd.map(item => {return item["code"]})) : '[]');
      __mfTrax.append('euin_no',this.__ackForm.value.euin_no ? JSON.stringify(this.__ackForm.value.euin_no.map(item => {return item["euin_no"]})) : '[]');
      __mfTrax.append('brn_cd',this.__ackForm.value.brn_cd ? JSON.stringify(this.__ackForm.value.brn_cd.map(item => {return item["id"]})) : '[]');
       __mfTrax.append('rm_id',this.__ackForm.value.rm_id ? JSON.stringify(this.__ackForm.value.rm_id.map(item => {return item["euin_no"]})) : '[]')
      __mfTrax.append('bu_type',this.__ackForm.value.bu_type? JSON.stringify(this.__ackForm.value.bu_type.map(item => {return item["bu_code"]})): '[]');
    }
    this.__dbIntr
      .api_call(1, '/manualUpdateDetailSearch', __mfTrax)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        // this.__paginate = res.links;
        this.setPaginator(res);
        this.tableExport(__mfTrax);
      });
  }

  // getRnt() {
  //   this.__dbIntr
  //     .api_call(0, '/rnt', null)
  //     .pipe(pluck('data'))
  //     .subscribe((res: rnt[]) => {
  //       this.__rnt = res;
  //     });
  // }
  // getCategory() {
  //   this.__dbIntr
  //     .api_call(0, '/category', null)
  //     .pipe(pluck('data'))
  //     .subscribe((res: category[]) => {
  //       this.__category = res;
  //     });
  // }
  // getSubCategory() {
  //   this.__dbIntr
  //     .api_call(0, '/subcategory', null)
  //     .pipe(pluck('data'))
  //     .subscribe((res: subcat[]) => {
  //       this.__subCat = res;
  //     });
  // }

  getTransactionType() {
    this.__dbIntr
      .api_call(0, '/transction', ('product_id=' +this.data.product_id +'&trans_type_id=' + this.data.trans_type_id))
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__transType = res.map(({id,trns_name}) => ({
          id,
          tab_name:trns_name,
          img_src:id == 1 ? '../../../../../assets/images/pip.png'
          : (id == 2 ? '../../../../../assets/images/sip.png'
          : '../../../../../assets/images/switch.png')}));
      });
  }
  // getTransactionTypeDtls() {
  //   this.__dbIntr
  //     .api_call(
  //       0,
  //       '/mfTraxCreateShow',
  //       'product_id=' +
  //         this.data.product_id +
  //         '&trans_type_id=' +
  //         this.data.trans_type_id
  //     )
  //     .pipe(pluck('data'))
  //     .subscribe((res) => {
  //       this.__trans_types = res.map(({id,trns_name}) => ({
  //         id,
  //         tab_name:trns_name,
  //         img_src:id == 1 ? '../../../../../assets/images/pip.png'
  //         : (id == 2 ? '../../../../../assets/images/sip.png'
  //         : '../../../../../assets/images/switch.png')}));
  //     });
  // }
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

  // getval(__paginate) {
  //   this.__pageNumber.setValue(__paginate.toString());
  //   this.submit();
  // }
  getPaginate(__paginate: any | null = null) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            (this.transaction_id ? '&trans_id=' + this.transaction_id : '') +
            ('&option=' + this.__ackForm.value.options) +
            ('&trans_type_id=' + this.data.trans_type_id) +
            ('&trans_id=' + this.transaction_id.toString()) +
            ('&field=' + (global.getActualVal(this.sort.field) ? this.sort.field : '')) +
            ('&order=' + (global.getActualVal(this.sort.order) ? this.sort.order : '1')) +
            ('&client_code=' + (this.__ackForm.value.client_code ? this.__ackForm.value.client_code : '')) +
            ('&tin_no=' + (this.__ackForm.value.tin_no? this.__ackForm.value.tin_no : '')) +
            ('&amc_name=' + (this.__ackForm.value.amc_id ? JSON.stringify(this.__ackForm.value.amc_id.map(item => {return item["id"]})) : '[]')) +
            ('&rnt_name=' + (this.__ackForm.value.rnt_id ? JSON.stringify(this.__ackForm.value.rnt_id.filter(x=> x.isChecked).map(item => {return item["id"]})) : '[]'))
             +('&update_status_id='+JSON.stringify(this.update_status_id.value.filter(item => item.isChecked).map(res => {return res['id']})))
             +('&scheme_name='+JSON.stringify(this.__ackForm.value.scheme_id.map(item => {return item["id"]})))
             +('&from_date=' +global.getActualVal(this.__ackForm.getRawValue().frm_dt))
             +('&to_date=' + global.getActualVal(this.__ackForm.getRawValue().to_dt))
             + (this.__ackForm.value.btnType == 'A' ?
            (('&sub_brk_cd=' + (JSON.stringify(this.__ackForm.value.sub_brk_cd.map(item => {return item["code"]}))))
              +('&euin_no=' +(JSON.stringify(this.__ackForm.value.euin_no.map(item => {return item["euin_no"]}))))
              +('&brn_cd=' + (JSON.stringify(this.__ackForm.value.brn_cd.map(item => {return item["id"]}))))
              +('&bu_type=' + (JSON.stringify(this.__ackForm.value.bu_type.map(item => {return item["bu_code"]}))))
              +('&rm_id=' + (JSON.stringify(this.__ackForm.value.rm_id.map(item => {return item["euin_no"]}))))
            )
            : '')
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.__financMst = new MatTableDataSource(res.data);
          this.__paginate = res.links;
        });
    }
  }
    //  __mfTrax.append('scheme_name',this.__ackForm.value.scheme_id ? JSON.stringify(this.__ackForm.value.scheme_id.map(item => {return item["id"]})) : '[]');

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
      flag: 'MUNFO_' + (__items.tin_no ? __items.tin_no.toString() : '0'),
      isViewMode: __items.form_status == 'A' ? false : true,
      tin: __items.tin_no,
      tin_no: __items.tin_no,
      title: 'Manual Update For NFO',
      right: global.randomIntFromInterval(1, 60),
      data: __items,
    };
    dialogConfig.id =
      'FDMUNFO_' + (__items.tin_no ? __items.tin_no.toString() : '0');
    try {
      const dialogref = this.__dialog.open(
        ManualUpdateEntryForMFComponent,
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
        flag: 'MUNFO_' + (__items.tin_no ? __items.tin_no.toString() : '0'),
      });
    }
  }
  submit() {
    this.getManualUpdateRPT();
  }
  exportPdf() {
    // if (this.__rcvForms.get('options').value == '3') {
    //   this.divToPrint = document.getElementById('FinRPT');
    //   console.log(this.divToPrint.innerHTML);
    //   this.WindowObject = window.open('', 'Print-Window');
    //   this.WindowObject.document.open();
    //   this.WindowObject.document.writeln('<!DOCTYPE html>');
    //   this.WindowObject.document.writeln(
    //     '<html><head><title></title><style type="text/css">'
    //   );
    //   this.WindowObject.document.writeln(
    //     '@media print { .center { text-align: center;}' +
    //       '                                         .inline { display: inline; }' +
    //       '                                         .underline { text-decoration: underline; }' +
    //       '                                         .left { margin-left: 315px;} ' +
    //       '                                         .right { margin-right: 375px; display: inline; }' +
    //       '                                          table { border-collapse: collapse; font-size: 10px;}' +
    //       '                                          th, td { border: 1px solid black; border-collapse: collapse; padding: 6px;}' +
    //       '                                           th, td { }' +
    //       '                                         .border { border: 1px solid black; } ' +
    //       '                                         .bottom { bottom: 5px; width: 100%; position: fixed; } ' +
    //       '                                           footer { position: fixed; bottom: 0;text-align: center; }' +
    //       '                                         td.dashed-line { border-top: 1px dashed gray; } } </style>'
    //   );
    //   this.WindowObject.document.writeln(
    //     '</head><body onload="window.print()">'
    //   );
    //   this.WindowObject.document.writeln(
    //     '<center><img src="/assets/images/logo.jpg" alt="">' +
    //       '<h3>NuEdge Corporate Pvt. Ltd</h3>' +
    //       '<h5> Day Sheet Report</h5></center>'
    //   );
    //   this.WindowObject.document.writeln(this.divToPrint.innerHTML);
    //   console.log(this.WindowObject);

    //   this.WindowObject.document.writeln(
    //     '<footer><small>This is an electronically generated report, hence does not require any signature</small></footer>'
    //   );
    //   this.WindowObject.document.writeln('</body></html>');
    //   this.WindowObject.document.close();
    //   setTimeout(() => {
    //     console.log('CLose');
    //     this.WindowObject.close();
    //   }, 100);
    // } else {
      this.__Rpt.downloadReport(
        '#__finRPT',
        {
          title: 'Financial Report',
        },
        'Financial Report  '
      );
    // }
  }
  // onbuTypeChange(e: any) {
  //   const bu_type: FormArray = this.__rcvForms.get('bu_type') as FormArray;
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
  //   this.__rcvForms
  //     .get('is_all_bu_type')
  //     .setValue(bu_type.controls.length == 3 ? true : false, {
  //       emitEvent: false,
  //     });
  // }
  // onrntTypeChange(e: any) {
  //   const rnt_name: FormArray = this.__rcvForms.get('rnt_name') as FormArray;
  //   if (e.checked) {
  //     rnt_name.push(new FormControl(e.source.value));
  //   } else {
  //     let i: number = 0;
  //     rnt_name.controls.forEach((item: any) => {
  //       if (item.value == e.source.value) {
  //         rnt_name.removeAt(i);
  //         return;
  //       }
  //       i++;
  //     });
  //   }
  //   this.__rcvForms
  //     .get('is_all_rnt')
  //     .setValue(rnt_name.controls.length == 3 ? true : false, {
  //       emitEvent: false,
  //     });
  // }

  // ontrnsTypeChange(e: any) {
  //   const trans_type: FormArray = this.__rcvForms.get(
  //     'trans_type'
  //   ) as FormArray;
  //   if (e.checked) {
  //     trans_type.push(new FormControl(e.source.value));
  //   } else {
  //     let i: number = 0;
  //     trans_type.controls.forEach((item: any) => {
  //       if (item.value == e.source.value) {
  //         trans_type.removeAt(i);
  //         return;
  //       }
  //       i++;
  //     });
  //   }
  //   this.__rcvForms
  //     .get('is_all_trns_type')
  //     .setValue(trans_type.controls.length == 3 ? true : false, {
  //       emitEvent: false,
  //     });
  // }
  // getminDate() {
  //   return dates.getminDate();
  // }
  // getTodayDate() {
  //   return dates.getTodayDate();
  // }
  // sortData(sort) {
  //   this.__sortAscOrDsc = sort;
  //   this.submit();
  // }
  // reset() {
  //   this.__rcvForms.reset();
  //   this.__isAdd = false;
  //   this.__rcvForms.get('options').setValue('2');
  //   this.__sortAscOrDsc = { active: '', direction: 'asc' };
  //   this.submit();
  // }

  updateRow(row_obj) {
    this.__financMst.data = this.__financMst.data.filter((value: any, key) => {
      if (value.tin_no == row_obj.tin_no) {
        value.manual_update_remarks = row_obj.manual_update_remarks;
        value.pending_reason = row_obj.pending_reason;
        value.reject_reason_id = row_obj.reject_reason_id;
        value.contact_per_email = row_obj.contact_per_email;
        value.contact_per_phone = row_obj.contact_per_phone;
        value.contact_per_name = row_obj.contact_per_name;
        value.contact_via = row_obj.contact_via;
        value.contact_to_comp = row_obj.contact_to_comp;
        value.folio_no = row_obj.folio_no;
        value.process_date = row_obj.process_date;
        value.manual_trans_status = row_obj.manual_trans_status;
        value.reject_memo = row_obj.reject_memo;
        value.upload_soa = row_obj.upload_soa;
        value.form_status = row_obj.form_status;
      }
      return true;
    });
    this.__export.data = this.__export.data.filter((value: any, key) => {
      if (value.tin_no == row_obj.tin_no) {
        value.manual_update_remarks = row_obj.manual_update_remarks;
        value.pending_reason = row_obj.pending_reason;
        value.reject_reason_id = row_obj.reject_reason_id;
        value.contact_per_email = row_obj.contact_per_email;
        value.contact_per_phone = row_obj.contact_per_phone;
        value.contact_per_name = row_obj.contact_per_name;
        value.contact_via = row_obj.contact_via;
        value.contact_to_comp = row_obj.contact_to_comp;
        value.folio_no = row_obj.folio_no;
        value.process_date = row_obj.process_date;
        value.manual_trans_status = row_obj.manual_trans_status;
        value.reject_memo = row_obj.reject_memo;
        value.upload_soa = row_obj.upload_soa;
        value.form_status = row_obj.form_status;
      }
      return true;
    });
  }

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
  // /** Search Result Off against Sub Broker */
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
      // case 'A':
      //   this.__rcvForms.controls['amc_name'].reset(__items.amc_name, {
      //     emitEvent: false,
      //   });
      //   this.searchResultVisibilityForAMC('none');
      //   break;
      case 'C':
        this.__ackForm.controls['client_name'].reset(__items.client_name, {
          emitEvent: false,
        });
        this.__ackForm.controls['client_code'].reset(__items.id, {
          emitEvent: false,
        });
        this.searchResultVisibilityForClient('none');
        break;
      // case 'E':
      //   this.__rcvForms.controls['euin_no'].reset(__items.emp_name, {
      //     emitEvent: false,
      //   });
      //   this.searchResultVisibility('none');
      //   break;
      case 'T':
        this.__ackForm.controls['tin_no'].reset(__items.tin_no, {
          emitEvent: false,
        });
        this.searchResultVisibilityForTin('none');
        break;
      // case 'S':
      //   this.__rcvForms.controls['sub_brk_cd'].reset(__items.code, {
      //     emitEvent: false,
      //   });
      //   this.searchResultVisibilityForSubBrk('none');
      //   break;
    }
  }
  setColumns(trans_id,option){
    var clmn;
    const clmnToRmv = ['edit','app_frm_view']
    switch(trans_id.toString()){
      case '4' : clmn =  global.getColumnsAfterMerge(MfackClmns.Deatils,MfackClmns.Columns_for_Pip); break;
      case '5' : clmn =  global.getColumnsAfterMerge(MfackClmns.Deatils,MfackClmns.Columns_for_Sip); break;
      case '6' : clmn =  global.getColumnsAfterMerge(MfackClmns.Deatils,MfackClmns.Columns_for_Switch); break;
      case '35' : clmn =  global.getColumnsAfterMerge(MfackClmns.Deatils,MfackClmns.Columns_for_nfoCombo); break;
    }
  this.clmList = clmn.filter(item => item.field!='edit')
  if(option == 2){
       this.__columns = (trans_id == 5) ? global.getColumnsAfterMerge(MfackClmns.Summary_common.filter(item => item.field!='edit') ,MfackClmns.Summary_Sip)
       : global.getColumnsAfterMerge(MfackClmns.Summary_common.filter(item => item.field!='edit') ,MfackClmns.Summary_Pip_Switch)
  }
  else{
   this.__columns = this.clmList;
  }
  this.SelectedClms = this.__columns.map(x => x.field);
  this.__exportedClmns = this.__columns.filter(x => !clmnToRmv.includes(x.field)).map(item => {return item['field']});
}
  TabDetails(ev){
    this.transaction_id = ev.tabDtls.id;
    this.getManualUpdateRPT();
    this.setColumns(this.transaction_id,this.__ackForm.value.options);
   }
   onItemClick(item){
    if(item.option.value == 'A'){
      //Advance Filter
      this.getBranchMst();
    }
    else{
      //Reset
      this.reset();
    }
   }
   reset(){
    this.__RmMst.length = 0;
    this.__subbrkArnMst.length = 0;
    this.__euinMst.length = 0;
    this.__bu_type.length = 0;
    this.__ackForm.patchValue({
      client_code:'',
      date_range:'',
      dt_type:'',
      frm_dt:'',
      to_dt:'',
      scheme_id:[],
      options:'2'
    });
    this.__ackForm.get('brn_cd').setValue([],{emitEvent:false});
    this.__ackForm.get('rm_id').setValue([],{emitEvent:false});
    this.__ackForm.get('bu_type').setValue([],{emitEvent:false});
    this.__ackForm.get('sub_brk_cd').setValue([],{emitEvent:false});
    this.__ackForm.get('euin_no').setValue([],{emitEvent:false});
    this.__ackForm.get('amc_id').setValue([],{emitEvent:false});
    this.__ackForm.get('is_all').setValue(false,{emitEvent:true});
    this.__ackForm.get('is_all_status').setValue(false,{emitEvent:true});
    this.__ackForm.get('tin_no').reset('',{emitEvent:false});
    this.__ackForm.get('client_name').reset('',{emitEvent:false});
    this.schemeMst.length = 0;
    this.sort = new sort();
    this.__pageNumber.setValue('10');
    this.submit();
   }
   close(ev){
    this.__ackForm.patchValue({
      frm_dt: this.__ackForm.getRawValue().date_range ? dates.getDateAfterChoose(this.__ackForm.getRawValue().date_range[0]) : '',
      to_dt: this.__ackForm.getRawValue().date_range ? (global.getActualVal(this.__ackForm.getRawValue().date_range[1]) ?  dates.getDateAfterChoose(this.__ackForm.getRawValue().date_range[1]) : '') : ''
     });
   }
   getSelectedItemsFromParent(res){
    this.getItems(res.item,res.flag)
   }
   customSort(ev){
    this.sort.order = ev.sortOrder;
    this.sort.field = ev.sortField;
    if(ev.sortField){
     this.getManualUpdateRPT();
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
  onselectItem(__itemsPerPage) {
    this.getManualUpdateRPT();
  }}
