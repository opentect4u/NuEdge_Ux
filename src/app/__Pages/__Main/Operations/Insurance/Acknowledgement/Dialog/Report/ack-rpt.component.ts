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
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { insComp } from 'src/app/__Model/insComp';
import { insPrdType } from 'src/app/__Model/insPrdType';
import { insProduct } from 'src/app/__Model/insproduct';
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { global } from 'src/app/__Utility/globalFunc';
import { insTraxClm } from 'src/app/__Utility/InsuranceColumns/insTrax';
import modeOfPremium from '../../../../../../../../assets/json/Master/modeofPremium.json';
import filterOpt from '../../../../../../../../assets/json/filterOption.json';
import { sort } from 'src/app/__Model/sort';
import itemsPerPage from '../../../../../../../../assets/json/itemsPerPage.json';
import insuranceBuType from '../../../../../../../../assets/json/insuranceBuType.json';
import loggedStatus from '../../../../../../../../assets/json/loginstatus.json'
import { environment } from 'src/environments/environment';
import { PreviewDocumentComponent } from 'src/app/shared/core/preview-document/preview-document.component';
import { DomSanitizer } from '@angular/platform-browser';
type selectBtn ={
  label:string,
  value:string,
  icon:string
}
@Component({
  selector: 'app-ack-rpt',
  templateUrl: './ack-rpt.component.html',
  styleUrls: ['./ack-rpt.component.css'],
})
export class AckRPTComponent implements OnInit {
  isOpenMegaMenu:boolean = false;
  __insType_setting = this.__utility.settingsfroMultiselectDropdown('id','type','Search Type Of Insurance',2);
  __comp_type_setting = this.__utility.settingsfroMultiselectDropdown('id','comp_type','Search Company Type',2);
  __scm_setting = this.__utility.settingsfroMultiselectDropdown('id','scheme_name','Search Scheme',2);
  settingsForEUIN = this.__utility.settingsfroMultiselectDropdown('euin_no','euin_no','Search Employee',2);
  settingsForbrnch = this.__utility.settingsfroMultiselectDropdown('id','brn_name','Search Branch',2);
  settingsForbuType = this.__utility.settingsfroMultiselectDropdown('bu_code','bu_type','Search Business Type',3);
  settingsForRM = this.__utility.settingsfroMultiselectDropdown('euin_no','emp_name','Search Relationship Manager',2);
  settingsForsubCode = this.__utility.settingsfroMultiselectDropdown('code','bro_name','Search Sub Broker',1);
  __comp_setting = this.__utility.settingsfroMultiselectDropdown('id','comp_short_name','Search Company',2);
  __prod_type_setting = this.__utility.settingsfroMultiselectDropdown('id','product_type','Search Product Type',2);
  __prod_setting = this.__utility.settingsfroMultiselectDropdown('id','product_name','Search Product',2);
  sort = new sort();
  itemsPerPage:selectBtn[] = itemsPerPage;
  selectBtn:selectBtn[] = filterOpt;
  __isSubArnPending: boolean = false;
  __isEuinPending: boolean = false;
  __isClientPending: boolean = false;
  __istemporaryspinner:boolean = false;
  divToPrint: any;
  WindowObject: any;
  __mode_of_premium = modeOfPremium;
  __columns: any = [];
  ClmnList: any= insTraxClm.Columns.filter(item => item.field!= 'edit');
  SelectedClms:string[] =[];
  __euinMst: any = [];
  __subbrkArnMst: any = [];
  __clientMst: client[] = [];
  __compMst: insComp[] = [];
  __prodTypeMst: insPrdType[] = [];
  __prdMst: insProduct[] = [];
  __brnchMst: any =[];
  __tinMst:any=[];
  __compTypeMst:any=[]
  __RmMst: any=[];
  __insTrax = new MatTableDataSource<any>([]);
  __exportTrax = new MatTableDataSource<any>([]);
  __exportedClmns: string[];
  displayMode_forTemp_Tin:string;
  displayMode_forClient:string;

  __sortAscOrDsc: any = { active: '', direction: 'asc' };
  __pageNumber = new FormControl('10');
  __paginate: any = [];
  __insType: any = [];
  __bu_type: any=[];
  __isVisible: boolean = false;
  __insTraxMst = new MatTableDataSource<any>([]);
  __insTraxForm = new FormGroup({
    is_all_status: new FormControl(false),
    is_all: new FormControl(false),
    options: new FormControl('2'),
    sub_brk_cd: new FormControl([],{updateOn:'blur'}),
    tin_no: new FormControl(''),
    ins_type_id: new FormControl([],{updateOn:'blur'}),
    insured_bu_type: new FormArray([]),
    brn_cd: new FormControl([],{updateOn:'blur'}),
    proposer_code: new FormControl(''),
    proposer_name: new FormControl(''),
    logged_status_id: new FormArray([]),
    euin_no: new FormControl([]),
    bu_type: new FormControl([],{updateOn:'blur'}),
    frm_dt: new FormControl(''),
    to_dt: new FormControl(''),
    dt_type: new FormControl(''),
    is_all_ins_bu_type: new FormControl(false),
    company_id: new FormControl([],{updateOn:'blur'}),
    product_type_id: new FormControl([],{updateOn:'blur'}),
    product_id: new FormControl([]),
    filter_type: new FormControl(''),
    is_all_bu_type: new FormControl(false),
    btn_type: new FormControl('R'),
    date_range: new FormControl(''),
    rm_id: new FormControl([],{updateOn:'blur'})
  });
  constructor(
    private __Rpt: RPTService,
    private __dialog: MatDialog,
    private __utility: UtiliService,
    public dialogRef: MatDialogRef<AckRPTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dbIntr: DbIntrService,
    private sanitizer: DomSanitizer
  ) {}

  setColumns(options) {
    const clmnToRemove = ['edit','ins_application_form'];
    this.__columns =this.ClmnList.filter(item => item.isVisible.includes(Number(options)))
    this.__exportedClmns = this.__columns.filter(item => !clmnToRemove.includes(item.field)).map(item => {return item['field']});
    this.SelectedClms = this.__columns.map(item => item.field);
    }

  get insured_bu_type(): FormArray{
     return this.__insTraxForm.get('insured_bu_type') as FormArray;
  }
  get logged_status_id(): FormArray{
    return this.__insTraxForm.get('logged_status_id') as FormArray;
  }
  ngOnInit(): void {
    this.getInsuranceType();
    this.getInsMstRPT();
    this.setColumns(2);
    this.addInsuranceBuType();
    this.getLoggedinStatus();
  }

  getLoggedinStatus(){
    loggedStatus.forEach(el =>{
    this.logged_status_id.push(this.addLoggedStatusForm(el));
    })
  }
  addLoggedStatusForm(loggedStatus){
    return new FormGroup({
      id:new FormControl(loggedStatus ? loggedStatus?.id : 0),
      name:new FormControl(loggedStatus ? loggedStatus?.name : ''),
      value:new FormControl(loggedStatus ? loggedStatus.value : ''),
      isChecked:new FormControl(false),
    })
  }
  addInsuranceBuType(){
      insuranceBuType.forEach(el =>{
        this.insured_bu_type.push(this.setInsuranceBuType(el));
      })
  }
  setInsuranceBuType(ins_bu_type){
    return new FormGroup({
      id:new FormControl(ins_bu_type ? ins_bu_type?.id : ''),
      name: new FormControl(ins_bu_type ? ins_bu_type?.bu_type : ''),
      isChecked:new FormControl(false)
    })
  }
  getInsMstRPT() {
    const __fd = new FormData();
    __fd.append('paginate', this.__pageNumber.value);
    __fd.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
    __fd.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
      __fd.append('from_date',global.getActualVal(this.__insTraxForm.getRawValue().frm_dt));
      __fd.append('to_date',global.getActualVal(this.__insTraxForm.getRawValue().to_dt));
      __fd.append('tin_no',global.getActualVal(this.__insTraxForm.value.tin_no));
      __fd.append('proposer_code',global.getActualVal(this.__insTraxForm.value.proposer_code));
      __fd.append('ins_type_id',JSON.stringify(this.__insTraxForm.value.ins_type_id.map(item => item.id)));
      __fd.append('insured_bu_type',JSON.stringify(this.__insTraxForm.value.insured_bu_type.filter(item => item.isChecked).map(item => item.id)));
      __fd.append('company_id', JSON.stringify(this.__insTraxForm.value.company_id.map(item => item.id)));
      __fd.append('product_type_id',JSON.stringify(this.__insTraxForm.value.product_type_id.map(item => item.id)));
      __fd.append('product_id', JSON.stringify(this.__insTraxForm.value.product_id.map(item => item.id)));
      __fd.append('login_status_id', JSON.stringify(this.logged_status_id.value.filter(item => item.isChecked).map(res => {return res['id']})));

      if(this.__insTraxForm.value.btn_type == 'A'){
        __fd.append('brn_cd', JSON.stringify(this.__insTraxForm.value.brn_cd.map(item => {return item['id']})));
        __fd.append('bu_type', JSON.stringify(this.__insTraxForm.value.bu_type.map(item => {return item['bu_code']})));
        __fd.append('rm_id', JSON.stringify(this.__insTraxForm.value.rm_id.map(item => {return item['euin_no']})));
        __fd.append('sub_brk_cd', JSON.stringify(this.__insTraxForm.value.sub_brk_cd.map(item => {return item['code']})));
        __fd.append('euin_no', JSON.stringify(this.__insTraxForm.value.euin_no.map(item => {return item['euin_no']})));
      }
    this.__dbIntr
      .api_call(1, '/ins/ackDetailSearch', __fd)
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
      .api_call(1, '/ins/ackExport', formData)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__exportTrax = new MatTableDataSource(res);
      });
  }
  getInsuranceType() {
    this.__dbIntr
      .api_call(0, '/ins/type', null)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.__insType = res;
      });
  }
  ngAfterViewInit() {

    /** Change event occur when all rnt checkbox has been changed  */
    this.__insTraxForm.controls['is_all_status'].valueChanges.subscribe(res =>{
    this.logged_status_id.controls.map(item => {return item.get('isChecked').setValue(res,{emitEvent:false})});
    })
    /** End */

    /** Change event inside the formArray */
    this.logged_status_id.valueChanges.subscribe(res =>{
    this.__insTraxForm.controls['is_all_status'].setValue(res.every(item => item.isChecked),{emitEvent:false});
    })
    /*** End */


     /** Change event occur when all rnt checkbox has been changed  */
     this.__insTraxForm.controls['is_all'].valueChanges.subscribe(res =>{
      this.insured_bu_type.controls.map(item => {return item.get('isChecked').setValue(res,{emitEvent:false})});
    })
    /** End */

    /** Change event inside the formArray */
    this.insured_bu_type.valueChanges.subscribe(res =>{
    this.__insTraxForm.controls['is_all'].setValue(res.every(item => item.isChecked),{emitEvent:false});
    })
    /*** End */

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
    this.__insTraxForm.controls['ins_type_id'].valueChanges.subscribe(res =>{
      this.getCompanyMst(res);
      this.getProductTypeMst(res);
      this.getProductMst(
       res,
       this.__insTraxForm.value.company_id,
       this.__insTraxForm.value.product_type_id
      )
    })


    this.__insTraxForm.controls['tin_no'].valueChanges
      .pipe(
        tap(() => (this.__istemporaryspinner = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.ReportTINSearch('/ins/insTraxShow', dt) : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__tinMst = value;
          this.searchResultVisibility('block');
          this.__istemporaryspinner = false;
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__istemporaryspinner = false;
        },
      });

    this.__insTraxForm.controls['proposer_name'].valueChanges
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
          this.__insTraxForm.controls['proposer_code'].reset('',{ emitEvent: false });
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isClientPending = false;
        },
      });

      /*** Product Type Change */
      this.__insTraxForm.controls['product_type_id'].valueChanges.subscribe((res) => {
        this.getProductMst(
          this.__insTraxForm.value.ins_type_id,
          this.__insTraxForm.value.company_id,
          res
          );
      });
    /*** END */

    /*** Comapny Change */
    this.__insTraxForm.controls['company_id'].valueChanges.subscribe((res) => {
      this.getProductMst(
        this.__insTraxForm.value.ins_type_id,
        res,
        this.__insTraxForm.value.product_type_id
      );
    });
    /*** END */
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
          this.__RmMst = res;
          console.log(this.__RmMst);

     })
   }
   else{
     this.__RmMst.length =0;
     this.__insTraxForm.controls['rm_id'].reset([]);
   }
   }

  searchResultVisibility(display_mode) {
    this.displayMode_forTemp_Tin = display_mode;
  }
  searchInsurance() {
    this.getInsMstRPT();
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
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&option=' + this.__insTraxForm.value.options) +
            ('&field=' + (global.getActualVal(this.sort.field) ? this.sort.field : '')) +
            ('&order=' + (global.getActualVal(this.sort.order) ? this.sort.order : '1')) +
            ('&login_status_id='+ JSON.stringify(this.logged_status_id.value.filter(item => item.isChecked).map(res => {return res['id']})))+
            ('&trans_id=' + this.__insTraxForm.value.trans_id) +
            ('&proposer_code=' +(this.__insTraxForm.value.proposer_code? this.__insTraxForm.value.proposer_code: '')) +
            ('&product_id=' +  JSON.stringify(this.__insTraxForm.value.product_id.map(item => item.id))) +
            ('&product_type_id=' + JSON.stringify(this.__insTraxForm.value.product_type_id.map(item => item.id)))+
            ('&company_id=' + JSON.stringify(this.__insTraxForm.value.company_id.map(item => {return item['id']}))) +
            ('&tin_no=' +(this.__insTraxForm.value.tin_no? this.__insTraxForm.value.tin_no: '')) +
            ('&ins_type_id=' + JSON.stringify(this.__insTraxForm.value.ins_type_id.map(item => item.id))) +
            ('&insured_bu_type=' + JSON.stringify(this.__insTraxForm.value.insured_bu_type.filter(item => item.isChecked).map(item => item.id))) +
            (this.__insTraxForm.value.btnType == 'A' ?
            ('&sub_brk_cd=' + JSON.stringify(this.__insTraxForm.value.sub_brk_cd.map(item => {return item["code"]}))) +
            ('&rm_id='+JSON.stringify(this.__insTraxForm.value.rm_id.map(item => {return item["euin_no"]})))
            +('&euin_no=' + JSON.stringify(this.__insTraxForm.value.euin_no.map(item => {return item["euin_no"]}))) +
            ('&brn_cd=' +JSON.stringify(this.__insTraxForm.value.brn_cd.map(item => {return item["id"]}))) +
            ('&bu_type' +JSON.stringify(this.__insTraxForm.value.bu_type.map(item => {return item["bu_code"]}))) : '') +
            ('&from_date=' +global.getActualVal(this.__insTraxForm.getRawValue().frm_dt)) +
            ('&to_date=' +global.getActualVal(this.__insTraxForm.getRawValue().to_dt))
        ).pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.__insTrax = new MatTableDataSource(res);
        });
      }
  }
  exportPdf() {
      this.__Rpt.downloadReport(
        '#InsAckRPT',
        {
          title: 'Insurance Acknowledgement Report',
        },
        'Insurance Acknowledgement Report  '
      );
  }
  getItems(__items, __mode) {
    switch (__mode) {
      case 'C':
        this.__insTraxForm.controls['proposer_code'].reset(__items.id,{ emitEvent: false });
        this.__insTraxForm.controls['proposer_name'].reset(__items.client_name,{ emitEvent: false });
        this.searchResultVisibilityForClient('none');
        break;
      case 'T':
        this.__insTraxForm.controls['tin_no'].reset(__items.tin_no,{ onlySelf: true, emitEvent: false });
        this.searchResultVisibility('none');
        break;
    }
  }
  searchResultVisibilityForClient(display_mode) {
    this.displayMode_forClient = display_mode;
  }
  getCompanyMst(arr_ins_type_id) {
    if(arr_ins_type_id.length > 0){
    this.__dbIntr
      .api_call(0, '/ins/company', 'arr_ins_type_id='+JSON.stringify(arr_ins_type_id.map(item => {return item['id']})))
      .pipe(pluck('data'))
      .subscribe((res: insComp[]) => {
        this.__compMst = res;
      });}
      else{
        this.__compMst.length =0;
        this.__insTraxForm.controls['company_id'].reset([],{emitEvent:false})
      }
  }
  getProductTypeMst(arr_ins_type_id) {
    if(arr_ins_type_id.length > 0){
    this.__dbIntr
      .api_call(0, '/ins/productType', 'arr_ins_type_id='+ JSON.stringify(arr_ins_type_id.map(item => {return item['id']})))
      .pipe(pluck('data'))
      .subscribe((res: insPrdType[]) => {
        this.__prodTypeMst = res;
      });
    }
    else{
      this.__prodTypeMst.length = 0;
        this.__insTraxForm.controls['product_type_id'].reset([],{emitEvent:true})
    }
  }
  getProductMst(arr_ins_type_id,arr_comp_id,arr_prod_type_id) {
    if(arr_prod_type_id.length > 0){
       this.__dbIntr
        .api_call(0, '/ins/product',
        'arr_ins_type_id=' + JSON.stringify(arr_ins_type_id.map(item => {return item['id']}))
        +'&arr_comp_id=' + JSON.stringify(arr_comp_id.map(item => {return item['id']}))
        +'&arr_prod_type_id=' + JSON.stringify(arr_prod_type_id.map(item => {return item['id']}))
        )
        .pipe(pluck('data'))
        .subscribe((res: insProduct[]) => {
          this.__prdMst = res;
        });
      }
      else{
        this.__prdMst.length = 0;
        this.__insTraxForm.controls['product_id'].setValue([]);
      }
  }
  onItemClick(ev){
    if(ev.option.value == 'A'){
      this.getBranchMst();
    }
    else{
      //Report
      this.reset();
    }
  }
  reset(){
    this.__RmMst.length = 0;
    this.__subbrkArnMst.length = 0;
    this.__euinMst.length = 0;
    this.__bu_type.length = 0;
    this.__insTraxForm.patchValue({
          dt_type:'',
          date_range:'',
          proposer_code: '',
          options:'2',
          frm_dt:'',
          to_dt:''
    })
    this.__insTraxForm.controls['brn_cd'].setValue([],{emitEvent:false});
    this.__insTraxForm.controls['bu_type'].setValue([],{emitEvent:false});
    this.__insTraxForm.controls['rm_id'].setValue([],{emitEvent:false});
    this.__insTraxForm.controls['sub_brk_cd'].setValue([],{emitEvent:false});
    this.__insTraxForm.controls['euin_no'].setValue([],{emitEvent:false});
    this.__insTraxForm.controls['tin_no'].setValue('',{emitEvent:false});
    this.__insTraxForm.controls['ins_type_id'].reset([],{emitEvent:true})
    this.__insTraxForm.controls['proposer_name'].reset('',{emitEvent:false});
    this.__insTraxForm.controls['is_all'].setValue(false,{emitEvent:true});
    this.__insTraxForm.controls['is_all_status'].setValue(false,{emitEvent:true});
    this.__pageNumber.setValue('10');
    this.sort =new sort();
    this.searchInsurance();
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
  getCompanyTypeMst(arr_ins_type_id) {
    this.__dbIntr
      .api_call(0, '/ins/companyType', '&arr_ins_type_id='+JSON.stringify(arr_ins_type_id.map(item => {return item['id']})))
      .pipe(pluck('data'))
      .subscribe(res => {
        this.__compTypeMst = res;
      });
  }
  customSort(ev){
    this.sort.field = ev.sortField;
    this.sort.order = ev.sortOrder;
    if(ev.sortField){
    this.getInsMstRPT();
    }
  }
  onselectItem(ev){
    this.getInsMstRPT();
  }
  getSelectedColumns(columns){
    const clm =  ['edit','ins_application_form'];
    this.__columns = columns.map(({ field, header }) => ({field, header}));
    this.__exportedClmns = this.__columns.filter((x: any) => !clm.includes(x.field)).map((x: any) => x.field);
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
      copy_url:`${environment.ins_app_form_url + element.ins_application_form}`,
      src:this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.ins_app_form_url + element.app_form_scan}`)
    };
    const dialogref = this.__dialog.open(PreviewDocumentComponent, dialogConfig);
   }
}
