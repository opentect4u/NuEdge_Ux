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
import updateStatus from '../../../../../../../../assets/json/updateStatus.json';

import { fdComp } from 'src/app/__Model/fdCmp';
import subOpt from '../../../../../../../../assets/json/subOption.json';
import tdsInfo from '../../../../../../../../assets/json/TDSInfo.json'
import { sort } from 'src/app/__Model/sort';
import itemsPerPage from '../../../../../../../../assets/json/itemsPerPage.json';
import filterOpt from '../../../../../../../../assets/json/filterOption.json';
import { column } from 'src/app/__Model/tblClmns';
import { environment } from 'src/environments/environment';
import { PreviewDocumentComponent } from 'src/app/shared/core/preview-document/preview-document.component';
import { DomSanitizer } from '@angular/platform-browser';
import { EntryComponent } from '../entry/entry.component';
type selectBtn ={
  label:string,
  value:string,
  icon:string
}
@Component({
  selector: 'app-rpt',
  templateUrl: './rpt.component.html',
  styleUrls: ['./rpt.component.css']
})
export class RPTComponent implements OnInit {
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
  settingsForEUIN = this.__utility.settingsfroMultiselectDropdown('euin_no','euin_no','Search Employee',3);
  settingsForbrnch = this.__utility.settingsfroMultiselectDropdown('id','brn_name','Search Branch',3 );
  settingsForbuType = this.__utility.settingsfroMultiselectDropdown('bu_code','bu_type','Search Business Type',3);
  settingsForRM = this.__utility.settingsfroMultiselectDropdown('euin_no','emp_name','Search Relationship Manager',3);
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
  clmList: any= fdTraxClm.Columns.filter(item => !['edit','comp_login_cutt_off','comp_login_dt'].includes(item.field));
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
    filter_type: new FormControl(''),
    update_status_id: new FormArray([]),
    is_all: new FormControl(false)
  });
  constructor(
    private __Rpt: RPTService,
    private __dialog: MatDialog,
    private __utility: UtiliService,
    public dialogRef: MatDialogRef<RPTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dbIntr: DbIntrService,
    private sanitizer: DomSanitizer
  ) {}

  setColumns(options) {
    const clmToRemove = ['edit','app_form_scan'];
    this.__columns = fdTraxClm.Columns.filter(item => item.isVisible.includes(Number(options))).filter(item => !['edit','comp_login_cutt_off','comp_login_dt'].includes(item.field))
    this.__exportedClmns = this.__columns.filter(x => !clmToRemove.includes(x.field)).map(item => {return item['field']})
    this.SelectedClms = this.__columns.map(item => {return item['field']});
  }
   get update_status_id(): FormArray{
      return this.__insTraxForm.get('update_status_id') as FormArray;
   }
  ngOnInit(): void {
    this.getFDMstRPT();
    this.setColumns(this.__insTraxForm.value.options);
    this.getCompanyTypeMst();
    this.getLoggedinStatus();
  }

  getLoggedinStatus(){
    updateStatus.forEach(el =>{
    this.update_status_id.push(this.addLoggedStatusForm(el));
    })
  }
  addLoggedStatusForm(updateSt){
    return new FormGroup({
      id:new FormControl(updateSt ? updateSt?.id : 0),
      name:new FormControl(updateSt ? updateSt?.name : 0),
      value:new FormControl(updateSt ? updateSt.value : ''),
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
      __fd.append('update_status_id', JSON.stringify(this.update_status_id.value.filter(item => item.isChecked).map(res => {return res['id']})));
      if(this.__insTraxForm.value.btn_type == 'A'){
      __fd.append('brn_cd', JSON.stringify(this.__insTraxForm.value.brn_cd.map(item => {return item['id']})));
      __fd.append('bu_type', JSON.stringify(this.__insTraxForm.value.bu_type.map(item => {return item['bu_code']})));
      __fd.append('rm_id', JSON.stringify(this.__insTraxForm.value.rm_id.map(item => {return item['euin_no']})));
      __fd.append('sub_brk_cd', JSON.stringify(this.__insTraxForm.value.sub_brk_cd.map(item => {return item['code']})));
      __fd.append('euin_no', JSON.stringify(this.__insTraxForm.value.euin_no.map(item => {return item['euin_no']})));
      }
    }
    this.__dbIntr
      .api_call(1, '/fd/manualUpdateDetailSearch', __fd)
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
      .api_call(1, '/fd/manualUpdateExport', formData)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__exportTrax = new MatTableDataSource(res);
      });
  }

  ngAfterViewInit() {
     /** Change event occur when all rnt checkbox has been changed  */
     this.__insTraxForm.controls['is_all'].valueChanges.subscribe(res =>{
      this.update_status_id.controls.map(item => {return item.get('isChecked').setValue(res,{emitEvent:false})});
    })
    /** End */

    /** Change event inside the formArray */
    this.update_status_id.valueChanges.subscribe(res =>{
    this.__insTraxForm.controls['is_all'].setValue(res.every(item => item.isChecked),{emitEvent:false});
    })
    /*** End */
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
          ('&update_status_id=' + (JSON.stringify(this.update_status_id.value.filter(item => item.isChecked).map(res => {return res['id']})))) +
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
  getModeOfPremium(premium) {
    return premium
      ? this.__mode_of_premium.filter((x: any) => (x.id = premium))[0].name
      : '';
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
    if(arr_comp_type_id.length > 0){
    this.__dbIntr
      .api_call(0, '/fd/company', 'arr_cmp_type_id='+JSON.stringify(arr_comp_type_id.map(item => {return item['id']})))
      .pipe(pluck('data'))
      .subscribe((res: fdComp[]) => {
        this.__compMst = res;
      });
    }
    else{
      this.__insTraxForm.controls['company_id'].setValue([], {emitEvent: true});
      this.__compMst.length =0;
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
  getSub_option(__subOpt){
    return subOpt.filter(x => x.id == __subOpt)[0]?.value;
  }
  getTDSInfo(__id){
    return tdsInfo.filter(x => x.id == __id)[0]?.name
  }
   onItemClick(ev){
     if(ev.option.value == 'A'){
      //Advance
      this.getBranchMst()
     }
     else{
      //Reset
      this.reset();
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
      this.__insTraxForm.get('is_all').reset(false,{emitEvent:true});
      this.__pageNumber.setValue('10');
      this.sort =new sort();
      this.searchInsurance();
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
