import { Overlay } from '@angular/cdk/overlay';
import {
  Component,
  OnInit,
  Inject,
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
import { insTraxClm } from 'src/app/__Utility/InsuranceColumns/insTrax';
import buType from '../../../../../../../../assets/json/buisnessType.json';
import modeOfPremium from '../../../../../../../../assets/json/Master/modeofPremium.json';
import { TraxEntryComponent } from '../trax-entry/trax-entry.component';
import { responseDT } from 'src/app/__Model/__responseDT';
import { client } from 'src/app/__Model/__clientMst';
import { insComp } from 'src/app/__Model/insComp';
import { insPrdType } from 'src/app/__Model/insPrdType';
import { insProduct } from 'src/app/__Model/insproduct';
import filterOpt from '../../../../../../../../assets/json/filterOption.json';
import { sort } from 'src/app/__Model/sort';
import itemsPerPage from '../../../../../../../../assets/json/itemsPerPage.json';
import insuranceBuType from '../../../../../../../../assets/json/insuranceBuType.json';
import popupMenu from '../../../../../../../../assets/json/Master/daySheetOpt.json'
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { PreviewDocumentComponent } from 'src/app/shared/core/preview-document/preview-document.component';
type selectBtn ={
  label:string,
  value:string,
  icon:string
}

@Component({
  selector: 'app-ins-trax-rpt',
  templateUrl: './ins-trax-rpt.component.html',
  styleUrls: ['./ins-trax-rpt.component.css'],
})
export class InsTraxRPTComponent implements OnInit {
  reportDtForDaySheet:any;
  isOpenMegaMenu:boolean = false;
  printableClm:any=[];
  daysheetpopupMenu = popupMenu;
  __insType_setting = this.__utility.settingsfroMultiselectDropdown('id','type','Search Type Of Insurance',2);
  __comp_type_setting = this.__utility.settingsfroMultiselectDropdown('id','comp_type','Search Company Type',2);
  __scm_setting = this.__utility.settingsfroMultiselectDropdown('id','scheme_name','Search Scheme',2);
  settingsForEUIN = this.__utility.settingsfroMultiselectDropdown('euin_no','emp_name','Search Employee',2);
  settingsForbrnch = this.__utility.settingsfroMultiselectDropdown('id','brn_name','Search Branch',2);
  settingsForbuType = this.__utility.settingsfroMultiselectDropdown('id','bu_type','Search Business Type',2);
  settingsForRM = this.__utility.settingsfroMultiselectDropdown('id','manager_name','Search Relationship Manager',2);
  settingsForsubCode = this.__utility.settingsfroMultiselectDropdown('code','bro_name','Search Sub Broker',2);
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
  ClmnList: any= insTraxClm.Columns.filter(item => !['comp_login_cutt_off','comp_login_dt'].includes(item.field));
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
    is_all: new FormControl(false),
    options: new FormControl('2'),
    sub_brk_cd: new FormControl([]),
    tin_no: new FormControl(''),
    ins_type_id: new FormControl([],{updateOn:'blur'}),
    insured_bu_type: new FormArray([]),
    brn_cd: new FormControl([]),
    proposer_code: new FormControl(''),
    proposer_name: new FormControl(''),
    euin_no: new FormControl([]),
    bu_type: new FormControl([]),
    date_status: new FormControl('T'),
    start_date: new FormControl(this.getTodayDate()),
    end_date: new FormControl(this.getTodayDate()),
    login_status: new FormControl('N'),
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
    rm_id: new FormControl([])
  });
  constructor(
    private __Rpt: RPTService,
    private __dialog: MatDialog,
    private __utility: UtiliService,
    public dialogRef: MatDialogRef<InsTraxRPTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dbIntr: DbIntrService,
    private sanitizer: DomSanitizer
  ) {}

  setColumns(options) {
    const clmnToRemove = ['edit','ins_application_form'];
    this.__columns = this.ClmnList.filter(item => item.isVisible.includes(Number(options)))
    this.__exportedClmns = this.__columns.filter(item => !clmnToRemove.includes(item.field)).map(item => {return item['field']});
    this.SelectedClms = this.__columns.map(item => item.field);
    this.printableClm = this.ClmnList.filter(item => item.isVisible.includes(3))
    }

  get insured_bu_type(): FormArray{
     return this.__insTraxForm.get('insured_bu_type') as FormArray;
  }

  ngOnInit(): void {
    this.getInsuranceType();
    this.getInsMstRPT();
    this.setColumns(2);
    this.addInsuranceBuType();
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
    if(this.__insTraxForm.value.options != 3){
      __fd.append('from_date',global.getActualVal(this.__insTraxForm.getRawValue().frm_dt));
      __fd.append('to_date',global.getActualVal(this.__insTraxForm.getRawValue().to_dt));
      __fd.append('tin_no',global.getActualVal(this.__insTraxForm.value.tin_no));
      __fd.append('proposer_code',global.getActualVal(this.__insTraxForm.value.proposer_code));
      __fd.append('ins_type_id',JSON.stringify(this.__insTraxForm.value.ins_type_id.map(item => item.id)));
      __fd.append('insured_bu_type',JSON.stringify(this.__insTraxForm.value.insured_bu_type.filter(item => item.isChecked).map(item => item.id)));
      __fd.append('company_id', JSON.stringify(this.__insTraxForm.value.company_id.map(item => item.id)));
      __fd.append('product_type_id',JSON.stringify(this.__insTraxForm.value.product_type_id.map(item => item.id)));
      __fd.append('product_id', JSON.stringify(this.__insTraxForm.value.product_id.map(item => item.id)));
      if(this.__insTraxForm.value.btn_type == 'A'){
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
      .api_call(1, '/ins/insTraxDetailSearch', __fd)
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
      .api_call(1, '/ins/insTraxExport', formData)
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
            ('&trans_id=' + this.__insTraxForm.value.trans_id) +
            (this.__insTraxForm.get('options').value != '3'
              ?
                '&proposer_code=' +(this.__insTraxForm.value.proposer_code? this.__insTraxForm.value.proposer_code: '') +
                ('&product_id=' +  JSON.stringify(this.__insTraxForm.value.product_id.map(item => item.id))) +
                ('&product_type_id=' + JSON.stringify(this.__insTraxForm.value.product_type_id.map(item => item.id)))+
                ('&company_id=' + JSON.stringify(this.__insTraxForm.value.company_id.map(item => {return item['id']}))) +
                ('&tin_no=' +(this.__insTraxForm.value.tin_no? this.__insTraxForm.value.tin_no: '')) +
                ('&ins_type_id=' + JSON.stringify(this.__insTraxForm.value.ins_type_id.map(item => item.id))) +
                ('&insured_bu_type=' + JSON.stringify(this.__insTraxForm.value.insured_bu_type.filter(item => item.isChecked).map(item => item.id))) +
                (this.__insTraxForm.value.btnType == 'A' ?
                ('&sub_brk_cd=' + JSON.stringify(this.__insTraxForm.value.sub_brk_cd.map(item => {return item["id"]}))) +
                ('&rm_id='+JSON.stringify(this.__insTraxForm.value.rm_id.map(item => {return item["id"]})))
                +('&euin_no=' + JSON.stringify(this.__insTraxForm.value.euin_no.map(item => {return item["id"]}))) +
                ('&brn_cd=' +JSON.stringify(this.__insTraxForm.value.brn_cd.map(item => {return item["id"]}))) +
                ('&bu_type' +JSON.stringify(this.__insTraxForm.value.bu_type.map(item => {return item["id"]}))) : '') +
                ('&from_date=' +global.getActualVal(this.__insTraxForm.getRawValue().frm_dt)) +
                ('&to_date=' +global.getActualVal(this.__insTraxForm.getRawValue().to_dt))
              : '&login_status=' +
                this.__insTraxForm.value.login_status +
                ('&date_status=' + this.__insTraxForm.value.date_status) +
                ('&start_date=' + this.__insTraxForm.value.start_date) +
                ('&end_date=' + this.__insTraxForm.value.end_date))
        ).pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.__insTrax = new MatTableDataSource(res);
        });
      }
  }
  getModeOfPremium(premium) {
    return premium
      ? this.__mode_of_premium.filter((x: any) => (x.id = premium))[0].name
      : '';
  }
  populateDT(__el) {
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
        flag: 'INSTRAX_' + __el.tin_no,
        id: 0,
        title: 'Insurance Trax',
        right: global.randomIntFromInterval(1, 60),
        tin_no: __el.tin_no ? __el.tin_no : '',
        data: __el,
      };
      console.log(dialogConfig.data);
      const dialogref = this.__dialog.open(TraxEntryComponent, dialogConfig);
      dialogref.afterClosed().subscribe((dt) => {});
    } catch (ex) {
      console.log(ex);
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('80%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'INSTRAX_' + __el.tin_no,
      });
    }
  }
  exportPdf() {
      this.__Rpt.downloadReport(
        '#InsRPT',
        {
          title: 'Insurance Report',
        },
        'Insurance Report  '
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
    console.log(arr_ins_type_id);

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
    this.__insTraxForm.patchValue({
          dt_type:'',
          date_range:'',
          proposer_code: '',
          brn_cd:[],
          bu_type:[],
          rm_id:[],
          sub_brk_cd:[],
          euin_no:[]
    })
    this.__insTraxForm.controls['tin_no'].setValue('',{emitEvent:false});
    this.__insTraxForm.controls['ins_type_id'].reset([],{emitEvent:true})
    this.__insTraxForm.controls['proposer_name'].reset('',{emitEvent:false});
    this.__insTraxForm.controls['is_all'].setValue(false,{emitEvent:true});
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
  openMenu(event){
    if(event.flag == 'P'){
      this.__Rpt.printRPT('InsRPTForPRINT');
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
      copy_url:`${environment.ins_app_form_url + element.ins_application_form}`,
      src:this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.ins_app_form_url + element.ins_application_form}`)
    };
    const dialogref = this.__dialog.open(PreviewDocumentComponent, dialogConfig);
   }
}
