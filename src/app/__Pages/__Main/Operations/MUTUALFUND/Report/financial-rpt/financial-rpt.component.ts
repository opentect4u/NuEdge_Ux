import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { rnt } from 'src/app/__Model/Rnt';
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { scheme } from 'src/app/__Model/__schemeMst';
import { amc } from 'src/app/__Model/amc';
import { sort } from 'src/app/__Model/sort';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { mfFinClmns } from 'src/app/__Utility/MFColumns/finClmns';
import { dates } from 'src/app/__Utility/disabledt';
import { global } from 'src/app/__Utility/globalFunc';
@Component({
  selector: 'report-financial-rpt',
  templateUrl: './financial-rpt.component.html',
  styleUrls: ['./financial-rpt.component.css'],
})
export class FinancialRPTComponent implements OnInit {
  isOpenMegaMenu:boolean = false;
  sort = new sort();
  __paginate: any = [];
  __istemporaryspinner:boolean = false;
  __isClientPending:boolean = false;
  displayMode_forTemp_Tin: string;
  displayMode_forClient:string;
  /** Filter Criteria */
  transFrm = new FormGroup({
    btnType: new FormControl(''),
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
    brn_cd: new FormControl([]),
    bu_type: new FormControl([]),
    rm_name: new FormControl([]),
    sub_brk_cd: new FormControl([]),
    euin_no: new FormControl([]),
    frm_dt: new FormControl(''),
    to_dt: new FormControl('')
  });
  /*** End */

  schemeMst: scheme[] = []; /** Holding Scheme Master Data */
  tempTinMst:any = [];/** Holding TIN Numbers After Search*/
  __clientMst:client[] = []/**** Holding Client Details After Search*/
  brnchMst: any = []; /**** Holding Branch Master*/
  __bu_type: any= [];/**** Holding Business Type Master*/
  __RmMst: any= [];/**** Holding Relationship Master*/
  __subbrkArnMst: any = [];/***Holding Sub Broker Master */
  __euinMst: any = [];/*** Holding EUIN MASTER */
  @Input() set RntMst(value: rnt[]) {
    value.forEach((el: rnt) => {
      this.rnt_id.push(this.setRntForm(el));
    });
  }
  // paginate:number = 10;
  private _trns_id: number;
  @Input() Title:string;
  @Input() __pageNumber;
  @Input() AMCMst: amc[] = [];
  @Input() settingsforDropdown_foramc;
  @Input() settingsforDropdown_forscheme;
  @Input() settingsforDropdown_forbrnch;
  @Input() settingsforBuTypeDropdown;
  @Input() settingsforRMDropdown;
  @Input() settingsforSubBrkDropdown;
  @Input() settingsforEuinDropdown;
  @Input() selectBtn;
  @Input() itemsPerPage;
  finMst: any = [];
  @Input() set financialMst(value){
    this.finMst = value.data;
    this.__paginate = value.links;
  }
  @Output() sendFinancialFilteredDt =new EventEmitter();
  @Output() viewDocument = new EventEmitter();
  columns:column[] = []
  __columns:column[] =[];
  SelectedClms:string[] = [];
  @Input() set transaction(trans_id: number){
    console.log(trans_id);

    this._trns_id = trans_id;
    this.setColumns(this.transFrm.value.option,this.trnsTypeId,trans_id);
    if(trans_id){
      this.submitFinReport();
    }
  }
  get transaction(): number{
    return this._trns_id;
  }
  @Input() trnsTypeId:number;



  constructor(private dbIntr: DbIntrService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
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
       dt?.length > 1 ? this.dbIntr.ReportTINSearch('/mfTraxShow', dt+'&trans_type_id='+this.trnsTypeId+'&trans_id='+this.transaction) : []
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

         /** Event Trigger after change Client*/
   this.transFrm.controls['client_dtls'].valueChanges
   .pipe(
     tap(() => (this.__isClientPending = true)),
     debounceTime(200),
     distinctUntilChanged(),
     switchMap((dt) =>
       dt?.length > 1 ? this.dbIntr.ReportTINSearch('/client', dt) : []
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
       this.setColumns(res,this.trnsTypeId,this.transaction);
    })
    /*** End */
  }

  setColumns(option,trans_type_id,trns_id){
    const clmToRemoveForPIP = ['sip_type_name','scheme_name_to','sip_frequency','sip_date','sip_start_date','sip_end_date','sip_amount','edit']
    const clmToRemoveForSIP = ['scheme_name_to','edit'];
    const clmToRemoveForSwitch = ['sip_type_name','sip_frequency','sip_date','sip_start_date','sip_end_date','sip_amount','edit'];
     this.columns = trns_id == 3 ?
      mfFinClmns.COLUMN_SELECTOR.filter(x => !clmToRemoveForSwitch.includes(x.field))
     : (trns_id == 2 ?
      mfFinClmns.COLUMN_SELECTOR.filter(x => !clmToRemoveForSIP.includes(x.field))
    : mfFinClmns.COLUMN_SELECTOR.filter(x => !clmToRemoveForPIP.includes(x.field)))

    if(option == 2){

      this.__columns = trns_id == 2 ? mfFinClmns.SUMMARY_COPY_SIP.filter(x => x.field != 'edit')
      : mfFinClmns.SUMMARY_COPY.filter(x => x.field != 'edit');
    }
    else{
      this.__columns =  trns_id == 3
           ? mfFinClmns.DETAILS_FOR_SWITCH_COLUMNS_COPY.filter(x => x.field != 'edit')
           :  (trns_id == 1 ? mfFinClmns.DETAILS_FOR_PIP_COLUMNS_COPY.filter(x => x.field != 'edit')
            : mfFinClmns.DETAILS_FOR_SIP_COLUMNS_COPY.filter(x => x.field != 'edit'))
    }
    this.SelectedClms = this.__columns.map((x) => x.field);
  }

  /** Function to call api for getting Scheme Master Data  against selected amc*/
  getSchemeagainstAMC(amc_id) {
    this.dbIntr
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

  /**/
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
  submitFinReport(){
    const finFrmDT = new FormData();
    finFrmDT.append('paginate',this.__pageNumber);
    finFrmDT.append('option', this.transFrm.value.option);
    finFrmDT.append('trans_id', this.transaction.toString());
    finFrmDT.append('trans_type_id' ,this.trnsTypeId.toString());
    finFrmDT.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
    finFrmDT.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
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
         this.transFrm.value.sub_brk_cd ? JSON.stringify(this.transFrm.value.sub_brk_cd.map(item => {return item['id']})) : ''
       );
      finFrmDT.append(
        'euin_no',
        this.transFrm.value.euin_no ? JSON.stringify(this.transFrm.value.euin_no.map(item => {return item['id']})) : '[]'
      );
      finFrmDT.append(
        'brn_cd',
        this.transFrm.value.brn_cd ? JSON.stringify(this.transFrm.value.brn_cd.map(item => {return item['id']})) : '[]'
      );
      finFrmDT.append(
       'rm_id',
      JSON.stringify(this.transFrm.value.rm_name.map(item => {return item['id']}))
      )

      finFrmDT.append(
        'bu_type',
        this.transFrm.value.bu_type ?
        JSON.stringify(this.transFrm.value.bu_type.map(item => {return item['id']})): '[]'
      );
     }
    this.sendFinancialFilteredDt.emit(finFrmDT);
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
    this.transFrm.patchValue({
      date_range:'',
      sub_brk_cd:[],
      option:'2',
      client_code:'',
      amc_name:[],
      scheme_name:[],
      euin_no:[],
      brn_cd:[],
      bu_type:[],
      frm_dt:'',
      to_dt:''
    });
    this.transFrm.get('date_periods_type').setValue('',{emitEvent:false});
    this.transFrm.get('client_dtls').setValue('',{emitEvent:false});
    this.transFrm.get('tin_no').setValue('',{emitEvent:false});
    this.transFrm.get('is_all_rnt').setValue(false);
    this.sort = new sort();
    this.__pageNumber = 10;
    this.submitFinReport();
  }

  getBranchMst(){
    this.dbIntr.api_call(0,'/branch',null).pipe(pluck("data")).subscribe(res =>{
     this.brnchMst = res;
    })
  }

  getSelectedItemsFromParent(ev){
    this.getItems(ev.item, ev.flag);
  }
  searchResultVisibilityForTempTin(display_mode) {
    this.displayMode_forTemp_Tin = display_mode;
  }
  searchResultVisibilityForClient(display_mode) {
    this.displayMode_forClient = display_mode;
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
  DocumentView(ev){
    this.viewDocument.emit(ev);
  }
  onselectItem(ev){
    this.__pageNumber = ev.option.value;
    this.submitFinReport();
  }
  getPaginate(__paginate){
    if (__paginate.url) {
      this.dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber) +
            ('&option=' + this.transFrm.value.option) +
            ('&trans_type_id=' + this.trnsTypeId) +
            ('&trans_id=' + this.transaction) +
             '&client_code=' +
                (this.transFrm.value.client_code
                  ? this.transFrm.value.client_code
                  : '') +
                  ('&rnt_name=' +
                  (this.transFrm.value.rnt_id.length > 0
                    ? JSON.stringify(this.transFrm.value.rnt_id)
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
                    ? JSON.stringify(this.transFrm.value.euin_no.map(item => {return item['id']}))
                    : '[]')) +
                ('&sub_brk_cd=' +
                  (this.transFrm.value.sub_brk_cd
                    ? JSON.stringify(this.transFrm.value.sub_brk_cd.map(item => {return item['id']}))
                    : '[]')) +
                ('&brn_cd=' +
                  (this.transFrm.value.brn_cd
                    ? JSON.stringify(this.transFrm.value.brn_cd.map(item => {return item['id']}))
                    : '[]')) +

                    ('&rm_id='+
                    JSON.stringify(this.transFrm.value.rm_name.map(item => {return item['id']}))
                  )+
                ('&bu_type=' +
                  (this.transFrm.value.bu_type
                    ? JSON.stringify(this.transFrm.value.bu_type.map(item => {return item['id']}))
                    : '[]')))  : '')
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.finMst = res.data;
          this.__paginate = res.links;
        });
    }
    }
    SelectedColumns(column){
      const clm = ['edit'];
       this.__columns = column.map(({ field, header }) => ({field, header})).filter(x => !clm.includes(x))
    }
    customSort(ev){
      this.sort.field = ev.sortField;
      this.sort.order = ev.sortOrder;
      if(ev.sortField){
        this.submitFinReport();
      }
    }

    close(ev){
         this.transFrm.patchValue({
          frm_dt: this.transFrm.getRawValue().date_range ? dates.getDateAfterChoose(this.transFrm.getRawValue().date_range[0]) : '',
          to_dt: this.transFrm.getRawValue().date_range ? (global.getActualVal(this.transFrm.getRawValue().date_range[1]) ?  dates.getDateAfterChoose(this.transFrm.getRawValue().date_range[1]) : '') : ''
         });

    }
}
