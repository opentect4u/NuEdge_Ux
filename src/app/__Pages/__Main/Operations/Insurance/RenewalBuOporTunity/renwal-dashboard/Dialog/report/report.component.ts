import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { insComp } from 'src/app/__Model/insComp';
import { insPrdType } from 'src/app/__Model/insPrdType';
import { insProduct } from 'src/app/__Model/insproduct';
import { RPTService } from 'src/app/__Services/RPT.service';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { global } from 'src/app/__Utility/globalFunc';
import month  from '../../../../../../../../../assets/json/Master/month.json';
import filterOpt from '../../../../../../../../../assets/json/filterOption.json';
import { sort } from 'src/app/__Model/sort';
import { buOpportunity } from 'src/app/__Model/buOpportunity';
import { MatTableDataSource } from '@angular/material/table';
import { column } from 'src/app/__Model/tblClmns';
import { insTraxClm } from 'src/app/__Utility/InsuranceColumns/insTrax';
import { environment } from 'src/environments/environment';
import itemsPerPage from '../../../../../../../../../assets/json/itemsPerPage.json';
import { PreviewDocumentComponent } from 'src/app/shared/core/preview-document/preview-document.component';
type selectBtn ={
  label:string,
  value:string,
  icon:string
}
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  ItemsPerPage = itemsPerPage
  __pageNumber= new FormControl('10');
  sort = new sort();
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
  __isVisible:boolean = true;
  __istemporaryspinner:boolean =false;
  __isClientPending: boolean =false;
  displayMode_forTemp_Tin:string;
  displayMode_forClient:string;
  __columns:column[]=insTraxClm.renewal_Columns;
  selectBtn:selectBtn[] = filterOpt;
  __insType: any = [];
  __compMst:insComp[] =[];
  __prodTypeMst:insPrdType[] =[];
  __prdMst:insProduct[] =[];
  __tinMst:any=[];
  __clientMst:client[] = [];
  __brnchMst:any=[];
  renewal_year = dates.getYears();
  renewal_month = month;
  __bu_type:any=[];
  __RmMst:any=[];
  __subbrkArnMst:any=[];
  __euinMst:any=[];
  __paginate:any=[];
  renewal_buMst = new MatTableDataSource<buOpportunity[]>([])
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private __dialog: MatDialog,
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<ReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) { }
 __bu_oportunity_frm = new FormGroup({
    btn_type: new FormControl('R'),
    dt_type: new FormControl(''),
    dt_range: new FormControl(''),
    from_date:new FormControl(''),
    to_date: new FormControl(''),
    temp_tin_no: new FormControl(''),
    proposer_code: new FormControl(''),
    proposer_name: new FormControl(''),
    ins_type_id: new FormControl([],{updateOn:'blur'}),
    company_id: new FormControl([],{updateOn:'blur'}),
    product_type_id: new FormControl([],{updateOn:'blur'}),
    product_id: new FormControl([]),
    renewal_month: new FormControl(''),
    renewal_year: new FormControl(''),
    brn_cd: new FormControl([]),
    bu_type: new FormControl([]),
    rm_id: new FormControl([]),
    sub_brk_cd: new FormControl([]),
    euin_no: new FormControl([])

 })
  ngOnInit(): void {
    this.getTransTypeMst();
    this.getRenewalBuOpportunity();
  }

  ngAfterViewInit(){

    this.__bu_oportunity_frm.controls['dt_type'].valueChanges.subscribe((res) => {
      this.__bu_oportunity_frm.controls['dt_range'].reset(
        res && res != 'R' ? ([new Date(dates.calculateDT(res)),new Date(dates.getTodayDate())]) : ''
      );
      this.__bu_oportunity_frm.controls['from_date'].reset(
        res && res != 'R' ? dates.calculateDT(res) : ''
      );
      this.__bu_oportunity_frm.controls['to_date'].reset(
        res && res != 'R' ? dates.getTodayDate() : ''
      );
      if (res && res != 'R') {
        this.__bu_oportunity_frm.controls['dt_range'].disable();
      } else {
        this.__bu_oportunity_frm.controls['dt_range'].enable();
      }
    });

     // Temporary Tin Number Search
     this.__bu_oportunity_frm.controls['temp_tin_no'].valueChanges
     .pipe(
       tap(() => (this.__istemporaryspinner = true)),
       debounceTime(200),
       distinctUntilChanged(),
       switchMap((dt) =>
         dt?.length > 1 ? this.__dbIntr.ReportTINSearch('/ins/businessOpportunity', dt) : []
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
       error: (err) => (this.__istemporaryspinner = false),
     });

      // Temporary Tin Number Search
      this.__bu_oportunity_frm.controls['proposer_name'].valueChanges
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
          this.__bu_oportunity_frm.controls['proposer_code'].reset('');
          this.__clientMst = value;
          this.searchResultVisibilityForClient('block');
          this.__isClientPending = false;
        },
        complete: () => console.log(''),
        error: (err) => (this.__isClientPending = false),
      });


    /** Changes in Insurance Type  */
      this.__bu_oportunity_frm.controls['ins_type_id'].valueChanges.subscribe(res =>{
        if(res.length > 0){
          this.getCompanyAgainstInsurancetype(res);
        }
        else{
           this.__bu_oportunity_frm.controls['company_id'].setValue([],{emitEvent:true});
           this.__compMst.length = 0;
        }
      })
      /** End */

    /** Changes in Company  */
      this.__bu_oportunity_frm.controls['company_id'].valueChanges.subscribe(res =>{
        if(res.length > 0){
          this.getProductTypeMst(res);
        }
        else{
           this.__bu_oportunity_frm.controls['product_type_id'].setValue([],{emitEvent:true});
           this.__prodTypeMst.length = 0;
        }
      })
      /** End */

    /** Changes in product Type  */
      this.__bu_oportunity_frm.controls['product_type_id'].valueChanges.subscribe(res =>{
        if(res.length > 0){
          this.getProductMst(res);
        }
        else{
           this.__bu_oportunity_frm.controls['product_id'].setValue([],{emitEvent:true});
           this.__prdMst.length = 0;
        }
      })
      /** End */
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
  getTransTypeMst(){
    this.__dbIntr.api_call(0,'/ins/type',null).pipe(pluck("data")).subscribe(res =>{
    this.__insType = res;
    })
  }
  getCompanyAgainstInsurancetype(ins_type_ids){
    this.__dbIntr
      .api_call(0, '/ins/company', 'arr_ins_type_id='+JSON.stringify(ins_type_ids.map(item => {return item['id']})))
      .pipe(pluck('data'))
      .subscribe((res: insComp[]) => {
        this.__compMst = res;
      });
  }
  getProductTypeMst(arr_company_id) {
    this.__dbIntr
      .api_call(0, '/ins/productType', 'arr_company_id='+ JSON.stringify(arr_company_id.map(item => {return item['id']})))
      .pipe(pluck('data'))
      .subscribe((res: insPrdType[]) => {
        this.__prodTypeMst = res;
      });
  }
  getProductMst(arr_product_type_id) {
       this.__dbIntr
        .api_call(0, '/ins/productDetails', 'arr_product_type_id=' + JSON.stringify(arr_product_type_id.map(item => {return item['id']})))
        .pipe(pluck('data'))
        .subscribe((res: insProduct[]) => {
          this.__prdMst = res;
        });
  }
  close(ev){
    this.__bu_oportunity_frm.patchValue({
      from_date: this.__bu_oportunity_frm.getRawValue().dt_range ? dates.getDateAfterChoose(this.__bu_oportunity_frm.getRawValue().dt_range[0]) : '',
      to_date: this.__bu_oportunity_frm.getRawValue().dt_range ? (global.getActualVal(this.__bu_oportunity_frm.getRawValue().dt_range[1]) ?  dates.getDateAfterChoose(this.__bu_oportunity_frm.getRawValue().dt_range[1]) : '') : ''
    });
  }
  getSelectedItemsFromParent(ev){
  this.getItems(ev.item,ev.flag);
  }
  getItems(__items,__mode){
    switch (__mode) {
      case 'C':
        this.__bu_oportunity_frm.controls['proposer_name'].reset(__items.client_name, {
          emitEvent: false,
        });
        this.__bu_oportunity_frm.controls['proposer_code'].reset(__items.id);
        this.searchResultVisibilityForClient('none');
        break;
      case 'T':
        this.__bu_oportunity_frm.controls['temp_tin_no'].reset(__items.temp_tin_no, {
          emitEvent: false,
        });
        this.searchResultVisibilityForTin('none');
        break;
    }
  }
  searchResultVisibilityForClient(display_mode){
     this.displayMode_forClient = display_mode
  }
  searchResultVisibilityForTin(display_mode){
    this.displayMode_forTemp_Tin = display_mode;
  }
  getBranchMst(){
    this.__dbIntr.api_call(0,'/branch',null).pipe(pluck("data")).subscribe(res =>{
       this.__brnchMst = res;
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
    this.__bu_oportunity_frm.patchValue({
      dt_range:'',
      dt_type:'',
      from_date:'',
      to_date:'',
      renewal_month:'',
      renewal_year:'',
      proposer_code:''
    });
    this.__bu_oportunity_frm.controls['temp_tin_no'].setValue('',{emitEvent:false});
    this.__bu_oportunity_frm.controls['proposer_name'].setValue('',{emitEvent:false});
    this.__bu_oportunity_frm.controls['ins_type_id'].reset([],{emitEvent:true});
    this.__pageNumber.setValue('10');
    this.sort= new sort();
    this.getRenewalBuOpportunity();

  }
  getRenewalBuOpportunity(){
        const __fd = new FormData();
        __fd.append('paginate', this.__pageNumber.value);
        __fd.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
        __fd.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
         __fd.append('from_date',global.getActualVal(this.__bu_oportunity_frm.getRawValue().from_date));
          __fd.append('to_date',global.getActualVal(this.__bu_oportunity_frm.getRawValue().to_date));
          __fd.append('temp_tin_no',global.getActualVal(this.__bu_oportunity_frm.value.temp_tin_no));
          __fd.append('proposer_code',global.getActualVal(this.__bu_oportunity_frm.value.proposer_code));
          __fd.append('ins_type_id',JSON.stringify(this.__bu_oportunity_frm.value.ins_type_id.map(item => item.id)));
          __fd.append('renewal_month',global.getActualVal(this.__bu_oportunity_frm.value.renewal_month));
          __fd.append('renewal_year',global.getActualVal(this.__bu_oportunity_frm.value.renewal_year));
          // __fd.append('insured_bu_type',JSON.stringify(this.__bu_oportunity_frm.value.insured_bu_type.filter(item => item.isChecked).map(item => item.id)));
          __fd.append('company_id', JSON.stringify(this.__bu_oportunity_frm.value.company_id.map(item => item.id)));
          __fd.append('product_type_id',JSON.stringify(this.__bu_oportunity_frm.value.product_type_id.map(item => item.id)));
          __fd.append('product_id', JSON.stringify(this.__bu_oportunity_frm.value.product_id.map(item => item.id)));
          if(this.__bu_oportunity_frm.value.btn_type == 'A'){
            __fd.append('brn_cd', JSON.stringify(this.__bu_oportunity_frm.value.brn_cd.map(item => {return item['id']})));
            __fd.append('bu_type', JSON.stringify(this.__bu_oportunity_frm.value.bu_type.map(item => {return item['id']})));
            __fd.append('rm_id', JSON.stringify(this.__bu_oportunity_frm.value.rm_id.map(item => {return item['id']})));
            __fd.append('sub_brk_cd', JSON.stringify(this.__bu_oportunity_frm.value.sub_brk_cd.map(item => {return item['id']})));
            __fd.append('euin_no', JSON.stringify(this.__bu_oportunity_frm.value.euin_no.map(item => {return item['id']})));
          }
          this.__dbIntr.api_call(1,'/ins/businessOpportunityDetailSearch',__fd).pipe(pluck("data"))
          .subscribe((res: any) =>{
            this.renewal_buMst = new MatTableDataSource(res.data);
            this.__paginate = res.links
          })
  }
  customSort(ev){
    this.sort.order = ev.sortOrder;
    this.sort.field = ev.sortField;
    if(ev.sortField){
      this.getRenewalBuOpportunity();
    }
  }
  populateDT(renewalItem){

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
      copy_url:`${environment.renwal_bu_frm_url + element.upload_file}`,
      src:this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.renwal_bu_frm_url + element.upload_file}`)
    };
    const dialogref = this.__dialog.open(PreviewDocumentComponent, dialogConfig);
  }
  onselectItem(ev){
   this.getRenewalBuOpportunity();
  }
  getPaginate(__paginate){
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&field=' + (global.getActualVal(this.sort.field) ? this.sort.field : '')) +
            ('&order=' + (global.getActualVal(this.sort.order) ? this.sort.order : '1')) +
              ('&proposer_code=' +(this.__bu_oportunity_frm.value.proposer_code? this.__bu_oportunity_frm.value.proposer_code: '')) +
                ('&product_id=' +  JSON.stringify(this.__bu_oportunity_frm.value.product_id.map(item => item.id))) +
                ('&product_type_id=' + JSON.stringify(this.__bu_oportunity_frm.value.product_type_id.map(item => item.id)))+
                ('&company_id=' + JSON.stringify(this.__bu_oportunity_frm.value.company_id.map(item => {return item['id']}))) +
                ('&temp_tin_no=' +(this.__bu_oportunity_frm.value.temp_tin_no? this.__bu_oportunity_frm.value.temp_tin_no: '')) +
                ('&ins_type_id=' + JSON.stringify(this.__bu_oportunity_frm.value.ins_type_id.map(item => item.id))) +
                ('&renewal_month=' + global.getActualVal(this.__bu_oportunity_frm.value.renewal_month)) +
                ('&renewal_year=' + global.getActualVal(this.__bu_oportunity_frm.value.renewal_year)) +
                (this.__bu_oportunity_frm.value.btn_type == 'A' ?
                ('&sub_brk_cd=' + JSON.stringify(this.__bu_oportunity_frm.value.sub_brk_cd.map(item => {return item["id"]}))) +
                ('&rm_id='+JSON.stringify(this.__bu_oportunity_frm.value.rm_id.map(item => {return item["id"]})))
                +('&euin_no=' + JSON.stringify(this.__bu_oportunity_frm.value.euin_no.map(item => {return item["id"]}))) +
                ('&brn_cd=' +JSON.stringify(this.__bu_oportunity_frm.value.brn_cd.map(item => {return item["id"]}))) +
                ('&bu_type' +JSON.stringify(this.__bu_oportunity_frm.value.bu_type.map(item => {return item["id"]}))) : '') +
                ('&from_date=' +global.getActualVal(this.__bu_oportunity_frm.getRawValue().from_date)) +
                ('&to_date=' +global.getActualVal(this.__bu_oportunity_frm.getRawValue().to_date))
        ).pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.renewal_buMst = new MatTableDataSource(res);
        });
      }
  }
  SubmitRenewal(){
     this.getRenewalBuOpportunity();
  }
}
