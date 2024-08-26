import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  map,
  pluck,
  switchMap,
  tap,
} from 'rxjs/operators';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { trxnClm } from 'src/app/__Utility/TransactionRPT/trnsClm';
import periods from '../../../../../../../assets/json/datePeriods.json';
import { amc } from 'src/app/__Model/amc';
import { client } from 'src/app/__Model/__clientMst';
import { category } from 'src/app/__Model/__category';
import { subcat } from 'src/app/__Model/__subcategory';
import { scheme } from 'src/app/__Model/__schemeMst';
import { rntTrxnType } from 'src/app/__Model/MailBack/rntTrxnType';
import { global } from 'src/app/__Utility/globalFunc';
import filterOpt from '../../../../../../../assets/json/filterOption.json';
import { Calendar } from 'primeng/calendar';
import { dates } from 'src/app/__Utility/disabledt';
import { totalAmt } from 'src/app/__Model/TotalAmt';
import { Table } from 'primeng/table';
import { Inject } from '@angular/core';
import { DatePipe, DOCUMENT } from '@angular/common';
// import { Observable, Subscription, from, of } from 'rxjs';
import clientType from '../../../../../../../assets/json/view_type.json';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { trxnCountAmtSummaryColumn, trxnCountSummary } from '../TransactionReport/trxn-rpt/trxnAmtCountSummary';
import { TrxnType } from '../TransactionReport/trxn-rpt/trxn-rpt.component';
import * as XLSX from 'xlsx';
import { IDisclaimer } from '../../PortFolio/LiveMFPortFolio/live-mf-port-folio.component';
//  export type TrxnType = {
//    reject:Partial<TrxnRpt[]>;
//    process:Partial<TrxnRpt[]>;
//    total:Partial<TrxnRpt[]>
//  }

@Component({
  selector: 'app-broker-change',
  templateUrl: './broker-change.component.html',
  styleUrls: ['./broker-change.component.css'],
  animations: [
    trigger('bodyExpansion', [
      state('collapsed, void', style({ height: '0px', padding: '0px 20px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', padding: '15px 20px', visibility: 'visible' })),
      transition('expanded <=> collapsed, void => collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('formbodyExpansion', [
      state('collapsed, void', style({ height: '0px', padding: '0px 20px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', padding: '15px 20px', visibility: 'visible', })),
      transition('expanded <=> collapsed, void => collapsed',
        animate('230ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]

})
export class BrokerChangeComponent implements OnInit {
/**** showing transaction details on popup */
shwoPopup__trxn:TrxnRpt[]= [];
visible:boolean = false;
 isLoader:boolean = false;
 popup_header_title:string = '';
/*****End */

transType:string = '';

trxnAmtCountClm:column[] = trxnCountAmtSummaryColumn.columns;

transaction_amt_count_summary = [];

rows:number = 10;

first:number = 0;

// subscribe:Subscription;

trxn_count:TrxnType = { reject:[],total:[],process:[]}


@ViewChild('primeTbl') primeTbl :Table;

@ViewChild('secondaryTbl') secondaryTbl :Table;

state: string | undefined = 'expanded';

/** For Showing Total amount footer in datatable  */
isTotalFooterShow:boolean = false;
/******End */


  /**
   * For Showing Rejection Transaction count
  */
  rejection_trxn_count:number = 0;

  /**
   * For Showing Process Transaction count
  */
  process_trxn_count:number = 0;

client_type= clientType;

/** Paginate : for holding how many result tobe fetched */
 paginate:number = 1;

/**
 * For Display Total Amount
 */
  total:totalAmt;

/**
 * For Display Total
 */

/**
 * For Holding Max Date And Min Date form Prime Ng Calendar
 */
  minDate: Date;
  maxDate:Date;

/**
 *  getAccess of Prime Ng Calendar
 */
@ViewChild('dateRng') date_range:Calendar;

/**
 * Holding Advance Filter / Normal Filter
 */
selectBtn = filterOpt;
/**
 * Show / hide Loader Spinner while typing inside Client Details Input Field
 */
__isClientPending: boolean = false;

/**
 * Holding Client Master Data after search
 */
__clientMst: client[] = [];

/**
 * Show / hide search list dropdown after serach input match
 */
displayMode_forClient: string;

/**
 *  get date Periods from JSON File Located at (assets/json/datePeriods) for populate
 *  inside the date periods dropdown
 */
periods_type: { id: string; periods: string }[] = periods;

/**
 * Hold transaction details after search
 */
trxnRpt: Partial<TrxnRpt[]> = [];

/**
 * Hold column for transaction table
 * {field:'sl_no',header:'Sl No',width:"6rem"},
 */
column: column[] = trxnClm.column.filter((item:column) => (item.field!='amc_link' && item.field!='scheme_link' && item.field!='isin_link' && item.field!='plan_name' && item.field!='option_name' && item.field!='plan_opt' && item.field!='divident_opt' && item.field!='lock_trxn'))

/**
 * Holding AMC Master Data
 */
amcMst: amc[] = [];

/**
 * Holding Category Master Data
 */
catMst: category[] = [];

/**
 * Holding Sub-Category Master Data
 */
subcatMst: subcat[] = [];

/**
 * Holding Scheme Master Data
 */
schemeMst: scheme[] = [];

/**
 * Holding Transaction Type  Master Data
 */
trxnTypeMst: rntTrxnType[] = [];

/**
 * Holding Transaction Sub-Type  Master Data
 */
trxnSubTypeMst: rntTrxnType[] = [];

/**
 * Holding Branch Master Data
 */
__branchMst: any = [];

/**
 * Holding Buisness type
 */
__bu_type: any = [];

/**
 * Holding Relationship Manager
 */
__RmMst: any = [];

/**
 * Holding Sub Broker Master Data
 */
__subbrkArnMst: any = [];


disclaimer:Partial<IDisclaimer> | undefined;

/**
 * Holding Sub Broker Master Data
 */
__euinMst: any = [];


clientMst:any = [];

/**
 * Constructor
 * @param dbIntr
 * @param utility
 */

constructor(private dbIntr: DbIntrService, private utility: UtiliService,
  @Inject(DOCUMENT) private document: Document,private datePipe:DatePipe
  ) {}


/**
 * Setting of multiselect dropdown
 */
settingsforClient = this.utility.settingsfroMultiselectDropdown(
  'first_client_pan',
  'first_client_name',
  'Search Investor',
  1
);

/**
 * Setting of multiselect dropdown
 */
settingsforSubCatDropdown = this.utility.settingsfroMultiselectDropdown(
  'id',
  'subcategory_name',
  'Search Sub-Category',
  1
);
settingsforCatDropdown = this.utility.settingsfroMultiselectDropdown(
  'id',
  'cat_name',
  'Search Category',
  1
);
settingsforAMCDropdown = this.utility.settingsfroMultiselectDropdown(
  'id',
  'amc_short_name',
  'Search AMC',
  1
);
settingsforSchemeDropdown = this.utility.settingsfroMultiselectDropdown(
  'id',
  'scheme_name',
  'Search Scheme',
  1
);
settingsforBrnchDropdown = this.utility.settingsfroMultiselectDropdown(
  'id',
  'brn_name',
  'Search Branch',
  1,
  90
);
settingsforBuTypeDropdown = this.utility.settingsfroMultiselectDropdown(
  'bu_code',
  'bu_type',
  'Search Business Type',
  1,
  90
);
settingsforRMDropdown = this.utility.settingsfroMultiselectDropdown(
  'euin_no',
  'emp_name',
  'Search Relationship Manager',
  1
);
settingsforSubBrkDropdown = this.utility.settingsfroMultiselectDropdown(
  'code',
  'bro_name',
  'Search Sub Broker',
  1
);
settingsforEuinDropdown = this.utility.settingsfroMultiselectDropdown(
  'euin_no',
  'euin_no',
  'Search Employee',
  1
);
settingsforTrxnTypeDropdown = this.utility.settingsfroMultiselectDropdown(
  'id',
  'trans_type',
  'Search Transaction Type',
  1
);
settingsforTrxnSubTypeDropdown = this.utility.settingsfroMultiselectDropdown(
  'id',
  'trans_sub_type',
  'Search Transaction Sub-Type',
  1,
  150
);

/**
 * END
 */

/**
 * hold Button Type Advance Filter / Normal Filter
 */
btn_type: 'R' | 'A' = 'R';

family_members:client[] = [];

    /**
   * Setting of multiselect dropdown
   */
    settingsforFamilyMembers = this.utility.settingsfroMultiselectDropdown(
      'pan',
      'client_name',
      'Search Family members',
      1
    );


/**
 * Form Field for search Transaction
 */
misTrxnRpt = new FormGroup({
  type:new FormControl(''),
  // date_periods: new FormControl(''),
  // date_range: new FormControl(''),
  select_all_client:new FormControl(false),
  view_type:new FormControl(''),
  amc_id: new FormControl([], { updateOn: 'blur' }),
  cat_id: new FormControl([], { updateOn: 'blur' }),
  sub_cat_id: new FormControl([], { updateOn: 'blur' }),
  scheme_id: new FormControl([]),
  brn_cd: new FormControl([], { updateOn: 'blur' }),
  bu_type_id: new FormControl([], { updateOn: 'blur' }),
  rm_id: new FormControl([], { updateOn: 'blur' }),
  sub_brk_cd: new FormControl([], { updateOn: 'blur' }),
  euin_no: new FormControl([]),
  folio_no: new FormControl(''),
  // client_id: new FormControl(''),
  pan_no:new FormControl(''),
  client_name: new FormControl(''),
  trxn_type_id: new FormControl([], { updateOn: 'blur' }),
  trxn_sub_type_id: new FormControl([], { updateOn: 'blur' }),
  family_members: new FormControl([]),
});

ngOnInit(): void {
  // console.log(this.column.splice((this.column.length - 1),0,{field:'change_type',header:'Type',width:"12rem"}))
  this.misTrxnRpt.get('client_name').disable();
  this.misTrxnRpt.get('select_all_client').disable();

  // setTimeout(() => {
  // this.misTrxnRpt.get('date_periods').setValue('M',{emitEvent:true});
  // this.searchTrxnReport();
  // }, 500);
  // this.searchTrxnReport();
  this.getAmcMst();
  this.getTrxnTypeMst();
  // this.maxDate= dates.calculateDates('T');
  // this.minDate= dates.calculateDates('P');
}



/**
 * Get Client Master Data
 */
getClientMst = (view_type:string,paginate:number | undefined = 1) =>{
  if(view_type){
    this.dbIntr.api_call(0,
      '/searchClient',
     'view_type='+view_type
     +'&page='+paginate
     ).pipe(pluck("data")).subscribe((res: any) =>{
      // console.log(res);
      // this.__clientMst= res.data;
      /** 1st Way of concat two array*/
      // Array.prototype.push.apply( this.__clientMst, res.data);
      /** END */
      /** 2nd Way of concat two array*/
      this.__clientMst.push(...res.data);
      /**End */
      this.searchResultVisibilityForClient('block');
      this.document.getElementById('Investor').focus();
     })
  }

}

// calculateDates  =  (mode:string):Date =>{
//   let dt = new Date();
//   switch(mode){
//     case 'T' : break;
//     case 'P' : dt.setFullYear(dt.getFullYear() - 1)
//   }
//   return new Date(dt.toISOString().split('T')[0]);
// }

/**
 * Cal API for getting Transaction Type Master Data
 */
getTrxnTypeMst = () => {
  this.dbIntr
    .api_call(0, '/rntTransTypeSubtypeShow', null)
    .pipe(pluck('data'))
    .subscribe((res: rntTrxnType[]) => {
      this.trxnTypeMst = res;
    });
};

changeWheelSpeed(container, speedY) {
  var scrollY = 0;
  var handleScrollReset = function() {
      scrollY = container.scrollTop;
  };
  var handleMouseWheel = function(e) {
      e.preventDefault();
      scrollY += speedY * e.deltaY
      if (scrollY < 0) {
          scrollY = 0;
      } else {
          var limitY = container.scrollHeight - container.clientHeight;
          if (scrollY > limitY) {
              scrollY = limitY;
          }
      }
      container.scrollTop = scrollY;
  };

  var removed = false;
  container.addEventListener('mouseup', handleScrollReset, false);
  container.addEventListener('mousedown', handleScrollReset, false);
  container.addEventListener('mousewheel', handleMouseWheel, false);

  return function() {
      if (removed) {
          return;
      }
      container.removeEventListener('mouseup', handleScrollReset, false);
      container.removeEventListener('mousedown', handleScrollReset, false);
      container.removeEventListener('mousewheel', handleMouseWheel, false);
      removed = true;
  };
}

ngAfterViewInit() {

    const el = document.querySelector<HTMLElement>('.cdk-virtual-scroll-viewport');
    this.changeWheelSpeed(el, 0.99);


  // this.hideCard('none');
  // this.primeTbl.tableHeaderViewChild.nativeElement.style.position = 'sticky!important';

 /**
  *  Event Trigger on change on Date Periods
  */
//  this.misTrxnRpt.controls['date_periods'].valueChanges.subscribe((res) => {
//   if(res){
//     this.misTrxnRpt.controls['date_range'].reset(
//       res && res != 'R' ? ([new Date(dates.calculateDT(res)),new Date(dates.getTodayDate())]) : ''
//     );
//   }
//   else{
//     this.misTrxnRpt.controls['date_range'].setValue('');
//     this.misTrxnRpt.controls['date_range'].disable();
//     return;
//   }

//   if (res && res != 'R') {
//     this.misTrxnRpt.controls['date_range'].disable();
//   } else {
//     this.misTrxnRpt.controls['date_range'].enable();
//   }
// });


// this.misTrxnRpt.controls['date_range'].valueChanges.subscribe((res) => {
//   if(res){
//       this.maxDate = dates.calculatMaximumDates('R',6,new Date(res[0]));
//     }
//     else{
//       this.maxDate = dates.calculateDates('T');
//     }
// })

/*** Event Trigger when check Select All */
  this.misTrxnRpt.controls['select_all_client'].valueChanges.subscribe(res =>{
    // this.misTrxnRpt.get('client_name').setValue('',{emitEvent:false});
    // this.misTrxnRpt.get('pan_no').setValue('');
    // if(!res){
    //   if(this.misTrxnRpt.value.view_type){
    //    this.misTrxnRpt.get('client_name').enable();
    //   }
    // }
    // else{
    //   this.misTrxnRpt.get('client_name').disable();
    // }

    this.misTrxnRpt.get('client_name').setValue('',{onlySelf:true,emitEvent:false});
    this.misTrxnRpt.get('pan_no').setValue('',{onlySelf:true,emitEvent:false});
    this.getFamilymemberAccordingToFamilyHead_Id()
    if(res){
        this.misTrxnRpt.get('client_name').disable({onlySelf:true,emitEvent:false});
        if(this.misTrxnRpt.value.view_type == 'F'){
          this.misTrxnRpt.controls.family_members.disable();
        }
      }
      else{
        this.misTrxnRpt.get('client_name').enable({onlySelf:true,emitEvent:false});
        if(this.misTrxnRpt.value.view_type == 'F'){
          this.misTrxnRpt.get('family_members').enable();
        }
      }
  })
/*****END */

  /**
   * Event Trigger after change amc
   */
  this.misTrxnRpt.controls['amc_id'].valueChanges.subscribe((res) => {
    this.getCategoryMst(res);
    this.getSubcategoryMst(res, this.misTrxnRpt.value.cat_id);
    this.getSchemeMst(
      res,
      this.misTrxnRpt.value.cat_id,
      this.misTrxnRpt.value.sub_cat_id
    );
  });
  /**
   * Event Trigger after change category
   */
  this.misTrxnRpt.controls['cat_id'].valueChanges.subscribe((res) => {
    this.getSubcategoryMst(this.misTrxnRpt.value.amc_id, res);
    this.getSchemeMst(
      this.misTrxnRpt.value.amc_id,
      res,
      this.misTrxnRpt.value.sub_cat_id
    );
  });
  /**
   * Event Trigger after change subcategory
   */
  this.misTrxnRpt.controls['sub_cat_id'].valueChanges.subscribe((res) => {
    this.getSchemeMst(
      this.misTrxnRpt.value.amc_id,
      this.misTrxnRpt.value.cat_id,
      res
    );
  });

  /**
   * Event Trigger after change Transaction Type
   */
  this.misTrxnRpt.controls['trxn_type_id'].valueChanges.subscribe((res) => {
    this.getTrxnSubTypeMst(res);
  });
  /**
   * Event Trigger after change Branch
   */
  this.misTrxnRpt.controls['brn_cd'].valueChanges.subscribe((res) => {
    this.getBusinessTypeMst(res);
  });

  /**
   * Event Trigger after Business Type
   */
  this.misTrxnRpt.controls['bu_type_id'].valueChanges.subscribe((res) => {
    if(res.length > 0){
        this.disabledSubBroker(res);
        this.getRelationShipManagerMst(res, this.misTrxnRpt.value.brn_cd);
    }
    else{
        this.__RmMst = [];
        this.__subbrkArnMst =[];
        this.__euinMst = [];
        this.misTrxnRpt.get('euin_no').setValue([]);
        this.misTrxnRpt.get('sub_brk_cd').setValue([]);
        this.misTrxnRpt.get('rm_id').setValue([]);
    }
  });

  /**
   * Event Trigger after Rlationship Manager
   */
  this.misTrxnRpt.controls['rm_id'].valueChanges.subscribe((res) => {
    if (
      this.misTrxnRpt.value.bu_type_id.findIndex(
        (item) => item.bu_code == 'B'
      ) != -1
    ) {
      this.getSubBrokerMst(res);
    } else {
      this.__euinMst=[];
      this.__euinMst = res;
    }
  });
  /**
   * Event Trigger after Rlationship Manager
   */
  this.misTrxnRpt.controls['sub_brk_cd'].valueChanges.subscribe((res) => {
    this.setEuinDropdown(res, this.misTrxnRpt.value.rm_id);
  });

    /** Investor Change */
    this.misTrxnRpt.controls['client_name'].valueChanges
    .pipe(
      tap(()=> this.misTrxnRpt.get('pan_no').setValue('')),
      tap(() => {
        this.__isClientPending = true;
          if(this.family_members.length > 0){
            this.getFamilymemberAccordingToFamilyHead_Id()
          }
        }
        ),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((dt) =>
        dt?.length > 1 ? this.dbIntr.searchItems('/searchWithClient',
        dt+'&view_type='+this.misTrxnRpt.value.view_type
        ) : []

      ),
      map((x: any) => x.data)
    )
    .subscribe({
      next: (value) => {
        // console.log(value);
        this.__clientMst = value;
        this.searchResultVisibilityForClient('block');
        this.__isClientPending = false;
      },
      complete: () => {},
      error: (err) => {
        this.__isClientPending = false;
      },
    });

    /** End */

    /**view_type Change*/
    this.misTrxnRpt.controls['view_type'].valueChanges.subscribe(res =>{
        this.misTrxnRpt.get('client_name').reset('',{emitEvent:false});
        this.misTrxnRpt.get('pan_no').reset('');
        this.misTrxnRpt.get('select_all_client').setValue(false,{emitEvent:false});
          if(res){
            this.paginate = 1;
            this.__clientMst = [];
            this.misTrxnRpt.get('client_name').enable();
            this.misTrxnRpt.get('select_all_client').enable();
            // this.getClientMst(res,this.paginate);
          }
          else{
            this.misTrxnRpt.get('client_name').disable();
            this.misTrxnRpt.get('select_all_client').disable();
          }
    })
    /**End */

}


getFamilymemberAccordingToFamilyHead_Id = (id:number | undefined = undefined) =>{
  if(id){
    this.dbIntr.api_call(0,'/clientFamilyDetail',`family_head_id=${id}&view_type=${this.misTrxnRpt.value.view_type}`)
    .pipe(pluck('data'))
    .subscribe((res:client[]) =>{
     this.family_members = res;
     this.misTrxnRpt.get('family_members').setValue(res.map((item:client) => ({pan:item.pan,client_name:item.client_name})))
    })
 }
 else{
     this.family_members = [];
     this.misTrxnRpt.get('family_members').setValue([]);

 }
}

/**
 *  call API for get transaction according to search result
 */
searchTrxnReport = () => {
    if(this.misTrxnRpt.value.view_type){
      if(this.misTrxnRpt.value.select_all_client){}
      else{
        if(!this.misTrxnRpt.value.client_name){
          this.utility.showSnackbar(`Please select ${this.misTrxnRpt.value.view_type == 'F' ? 'family head' : 'investor'}`,2)
           return;
        }
        else if(this.misTrxnRpt.getRawValue().family_members.length == 0 && this.misTrxnRpt.value.view_type == 'F'){
          this.utility.showSnackbar(`Please select at least one family member`,2)
           return;
        }
      }
    }
  this.fetchTransaction();
};


/**
 * Final Call To API After Search
 */
fetchTransaction = () =>{
  this.transaction_amt_count_summary = [];
  this.total = new totalAmt();
  this.isTotalFooterShow = false;
  this.primeTbl.reset();
  const family_members_pan = this.misTrxnRpt.value.view_type == 'F' ? this.utility.mapIdfromArray(this.misTrxnRpt.getRawValue().family_members.filter(item => item.pan),'pan') : '[]';
  const family_members_name = this.misTrxnRpt.value.view_type == 'F' ? this.utility.mapIdfromArray(this.misTrxnRpt.getRawValue().family_members.filter(item => !item.pan),'client_name') : '[]';
  const TrxnDt = new FormData();
  this.transType = 'Total'
  TrxnDt.append('view_type',this.misTrxnRpt.value.view_type);
  TrxnDt.append('family_members_pan',family_members_pan);
  TrxnDt.append('family_members_name',family_members_name);
  TrxnDt.append('folio_no',global.getActualVal(this.misTrxnRpt.value.folio_no));
  TrxnDt.append('type',global.getActualVal(this.misTrxnRpt.value.type));
  TrxnDt.append('all_client',this.misTrxnRpt.getRawValue().select_all_client);
  // TrxnDt.append('client_id',global.getActualVal(this.misTrxnRpt.value.client_id));
  TrxnDt.append('amc_id',this.utility.mapIdfromArray(this.misTrxnRpt.value.amc_id, 'id'));
  TrxnDt.append('cat_id',this.utility.mapIdfromArray(this.misTrxnRpt.value.cat_id, 'id'));
  TrxnDt.append('sub_cat_id',this.utility.mapIdfromArray(this.misTrxnRpt.value.sub_cat_id, 'id'));
  TrxnDt.append('pan_no',this.misTrxnRpt.value.pan_no ? this.misTrxnRpt.value.pan_no : '');
  TrxnDt.append('client_name',this.misTrxnRpt.getRawValue().client_name ? this.misTrxnRpt.getRawValue().client_name : '');
  TrxnDt.append('scheme_id',this.utility.mapIdfromArray(this.misTrxnRpt.value.scheme_id, 'id'));
  TrxnDt.append('trans_type',this.utility.mapIdfromArray(this.misTrxnRpt.value.trxn_type_id,'trans_type'));
  TrxnDt.append('trans_sub_type',this.utility.mapIdfromArray(this.misTrxnRpt.value.trxn_sub_type_id,'trans_sub_type'));
  if (this.btn_type == 'A') {
    TrxnDt.append('euin_no',this.utility.mapIdfromArray(this.misTrxnRpt.value.euin_no, 'euin_no'));
    TrxnDt.append('brn_cd',this.utility.mapIdfromArray(this.misTrxnRpt.value.brn_cd, 'id'));
    TrxnDt.append('rm_id',this.utility.mapIdfromArray(this.misTrxnRpt.value.rm_id, 'euin_no'));
    TrxnDt.append('bu_type',this.utility.mapIdfromArray(this.misTrxnRpt.value.bu_type_id, 'bu_code'));
    TrxnDt.append('sub_brk_cd',this.utility.mapIdfromArray(this.misTrxnRpt.getRawValue().sub_brk_cd, 'code'));
  }
   let count = 0;
   count = this.trxnRpt.length;
  this.trxnRpt = [];
  this.dbIntr
    .api_call(1, '/showBrokerChangeDetails', TrxnDt)
    .pipe(
      pluck('data'),
      tap((item:Partial<{data:TrxnRpt[],disclaimer:Partial<IDisclaimer>}>) => {
        console.log(item)
        this.disclaimer = item.disclaimer;
          let net_amt = 0,gross_amt=0,tds=0,stamp_duity =0;
        this.trxn_count = {
          reject:item.data.filter(res => res.transaction_subtype.includes('Rejection')),
           process:item.data.filter(res => !res.transaction_subtype.includes('Rejection')),
           total: item.data
          };

          item.data.map( item => {
            item.tot_amount = (item.rnt_id == 2
              && item.transaction_subtype.toLowerCase().includes('rejection'))
              ? (item.tot_amount ?
                (Number(item.tot_amount) * ((Number(item.tot_amount) > 0) ? -1 : 1)).toString()
                : '0') :  item.tot_amount;

            item.tot_gross_amount = (item.rnt_id == 2
                  && item.transaction_subtype.toLowerCase().includes('rejection'))
                  ? (item.tot_gross_amount ?
                    (Number(item.tot_gross_amount) * ((Number(item.tot_gross_amount) > 0) ? -1 : 1)).toString()
                    : '0') :  item.tot_gross_amount;

            item.tot_tds = (item.rnt_id == 2
              && item.transaction_subtype.toLowerCase().includes('rejection'))
              ? (item.tot_tds ?
                (Number(item.tot_tds) * ((Number(item.tot_tds) > 0) ? -1 : 1)).toString()
                : '0') :  item.tot_tds;
           item.tot_stamp_duty = (item.rnt_id == 2
                  && item.transaction_subtype.toLowerCase().includes('rejection'))
                  ? (item.tot_stamp_duty ?
                    (Number(item.tot_stamp_duty) * ((Number(item.tot_stamp_duty) > 0) ? -1 : 1)).toString()
                    : '0') :  item.tot_stamp_duty;

              // net_amt+= Number(item.tot_amount ? item.tot_amount : 0);
              // gross_amt+=Number(item.tot_gross_amount ? item.tot_gross_amount : 0);
              // tds+=Number(item.tot_tds ? item.tot_tds : 0);
              // stamp_duity+=Number(item.tot_stamp_duty ? item.tot_stamp_duty : 0);
              // this.total = {
              //         net_amt:net_amt,
              //         stamp_duity:stamp_duity,
              //         tds:tds,
              //         gross_amt:gross_amt
              //   };

              return item;
          });

        //  item.map( item => {
        //     net_amt+=Number(item.tot_amount ? item.tot_amount : 0);
        //     gross_amt+=Number(item.tot_gross_amount ? item.tot_gross_amount : 0);
        //     tds+=Number(item.tot_tds ? item.tot_tds : 0);
        //     stamp_duity+=Number(item.tot_stamp_duty ? item.tot_stamp_duty : 0);
        //     this.total = {
        //             net_amt:net_amt,
        //             stamp_duity:stamp_duity,
        //             tds:tds,
        //             gross_amt:gross_amt
        //       };
        //   });
      })
      )
    .subscribe((res) => {
      console.log(res);
    //   if(res.length > 0){
    //   this.calculateProcess_Reject(res);
    // }
     this.isTotalFooterShow = (this.misTrxnRpt.value.folio_no != '' || this.misTrxnRpt.value.pan_no != '') ? true : false;
      if(res.data.length == 0){
        this.utility.showSnackbar('No transactions are available',2,true);
        return;
      }
    this.state = 'collapsed';
    this.trxnRpt = res.data;
    });
}

exportExcel = () =>{
  const column = this.column.map(el => el.header);
  let dt = [];
  this.trxnRpt.forEach((el,index) =>{
      dt.push({
          "Sl No":(index + 1),
          "Business Type":el.bu_type,
          "Branch" : el.branch,
          "RM Name":el.rm_name,
          "Sub Broker Code":el.sub_brk_cd,
          "EUIN":el.euin_no,
          "Investor Name":el.first_client_name,
          "PAN":el.first_client_pan,
          "Transaction Date":  this.datePipe.transform(el.trans_date,'dd-MM-YYYY'),
          "AMC":el.amc_name,
          "Scheme":`${el.scheme_name}-${el.plan_name}-${el.option_name}`,
          "Category":el.cat_name,
          "Sub-Category":el.subcat_name,
          "Folio":el.folio_no,
          "Transaction Type":el.transaction_type,
          "Transaction Sub Type":el.transaction_subtype,
          "Transaction No":el.trans_no,
          "Gross Amount":el.tot_gross_amount,
          "Stamp Duty":el.tot_stamp_duty,
          "TDS":el.tot_tds,
          "Net Amount":el.tot_amount,
          "Unit":el.units,
          "Nav":el.pur_price,
          "Bank":el.bank_name,
          "Account No":el.acc_no,
          "STT":el.stt,
          "Transaction Mode":el.trans_mode,
          "Remarks":el.remarks
      })
  });
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(dt, { header:column});
  XLSX.utils.book_append_sheet(wb, ws, 'BROKERCHANGE');
  var wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'binary'
  });
  const url = window.URL.createObjectURL(new Blob([this.s2ab(wbout)]));
      const link = this.document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'BROKERCHANGEREPORT.xlsx');
      this.document.body.appendChild(link);
      link.click();
      link.remove();
}
s2ab(s) {
var buf = new ArrayBuffer(s.length);
var view = new Uint8Array(buf);
for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
return buf;
}

async calculateProcess_Reject(res:TrxnRpt[]){
  /*** Group by Category */
  const groupByCategory = await res.reduce((group, trxn) => {
    const { cat_name } = trxn; /*** Destructure `cat_name` from trxn */
    group[cat_name] = group[cat_name] ?? [];
    // console.log( group[cat_name] );
    group[cat_name].push(trxn); /****** push the array in the particular `key` index*/
    return group;
  }, {});
  /****** END */
 Object.keys(groupByCategory).forEach((key:string,index:number) => {
    // let dt = {};
    this.transaction_amt_count_summary.push({
      cat_name: key, ...new trxnCountSummary(groupByCategory[key])
    })
  });
}

/**
 * event trigger after select particular result from search list
 * @param searchRlt
 */
getSelectedItemsFromParent = (searchRlt: {
  flag: string;
  item: any;
}) => {
  this.misTrxnRpt.get('client_name').setValue(searchRlt.item.client_name, { emitEvent: false });
  this.misTrxnRpt.get('pan_no').setValue(searchRlt.item.client_pan);
  this.searchResultVisibilityForClient('none');
  this.__isClientPending = false;
  if(this.misTrxnRpt.value.view_type == 'F'){
    this.getFamilymemberAccordingToFamilyHead_Id(searchRlt.item.client_id)
  }
};

/**
 *  evnt trigger on search particular client & after select client
 * @param display_mode
 */
searchResultVisibilityForClient = (display_mode: string) => {
  // console.log(display_mode);
  this.displayMode_forClient = display_mode;
};

/**
 * Get AMC Master Data from Backend API
 */
getAmcMst = () => {
  this.dbIntr
    .api_call(0, '/amc', null)
    .pipe(pluck('data'))
    .subscribe((res: amc[]) => {
      this.amcMst = res;
    });
};

/**
 * get Category Master Data according to AMC
 * @param amc_id
 */
getCategoryMst = <T extends { id: number; amc_short_name: string }[]>(
  amc_id: T
) => {
  // console.log(amc_id)
  if (amc_id.length > 0) {
    this.dbIntr
      .api_call(
        0,
        '/category',
        'arr_amc_id=' + this.utility.mapIdfromArray(amc_id, 'id')
      )
      .pipe(pluck('data'))
      .subscribe((res: category[]) => {
        this.catMst = res;
      });
  } else {
    this.catMst = [];
    this.misTrxnRpt.get('cat_id').reset([], { emitEvent: true });
  }
};

/**
 * get Sub-Category Master Data according to AMC,Category
 * @param amc_id
 * @param cat_id
 */

getSubcategoryMst = <
  T extends { id: number; amc_short_name: string }[],
  C extends category[]
>(
  amc_id: T,
  cat_id: C
) => {
  if (cat_id.length > 0 && amc_id.length > 0) {
    this.dbIntr
      .api_call(
        0,
        '/subcategory',
        'arr_cat_id=' +
          this.utility.mapIdfromArray(cat_id, 'id') +
          '&arr_amc_id=' +
          this.utility.mapIdfromArray(amc_id, 'id')
      )
      .pipe(pluck('data'))
      .subscribe((res: subcat[]) => {
        this.subcatMst = res;
      });
  } else {
    this.subcatMst = [];
    this.misTrxnRpt.get('sub_cat_id').reset([], { emitEvent: true });
  }
};

/**
 * get Scheme Master Data according to AMC,Category,Subcategory
 * @param amc_id
 * @param cat_id
 */

getSchemeMst = <
  T extends { id: number; amc_short_name: string }[],
  C extends category[],
  S extends subcat[]
>(
  amc_id: T,
  cat_id: C,
  sub_cat_id: S
) => {
  if (cat_id.length > 0 && amc_id.length > 0 && sub_cat_id.length > 0) {
    this.dbIntr
      .api_call(
        0,
        '/scheme',
        'arr_cat_id=' +
          this.utility.mapIdfromArray(cat_id, 'id') +
          '&arr_subcat_id=' +
          this.utility.mapIdfromArray(sub_cat_id, 'id') +
          '&arr_amc_id=' +
          this.utility.mapIdfromArray(amc_id, 'id')
      )
      .pipe(pluck('data'))
      .subscribe((res: scheme[]) => {
        this.schemeMst = res;
      });
  } else {
    this.schemeMst = [];
    this.misTrxnRpt.get('scheme_id').reset([]);
  }
};

/**
 * get Transaction sub type master data after change transaction type
 * @param trxnType
 */

getTrxnSubTypeMst = <T extends rntTrxnType[]>(trxnType: T) => {
  if(trxnType.length > 0){
  this.dbIntr
    .api_call(
      0,
      '/rntTransTypeSubtypeShow',
      'arr_trans_type=' + this.utility.mapIdfromArray(trxnType, 'trans_type')
    )
    .pipe(pluck('data'))
    .subscribe((res: rntTrxnType[]) => {
      this.trxnSubTypeMst = res;
    });
  }
  else{
    this.trxnSubTypeMst = [];
    this.misTrxnRpt.get('trxn_sub_type_id').setValue([]);
  }
};
/**
 * Get Branch Master Data
 */
getBranchMst = () => {
  this.dbIntr
    .api_call(0, '/branch', null)
    .pipe(pluck('data'))
    .subscribe((res) => {
      this.__branchMst = res;
    });
};
/**
 * Event Trigger for Advacne Filter / Reset
 * @param ev
 */
onItemClick = (ev) => {
  if (ev.option.value == 'A') {
    this.getBranchMst();
  } else {
       this.misTrxnRpt.patchValue({
        amc_id:[],
        folio_no:'',
        trxn_type_id:[],
        type:'',
        view_type:'',
        pan_no:''
       });
       this.paginate = 1;
       this.misTrxnRpt.get('brn_cd').setValue([],{emitEvent:true});
       this.__subbrkArnMst = [];
       this.misTrxnRpt.controls['sub_brk_cd'].setValue([]);
       this.misTrxnRpt.controls['euin_no'].setValue([]);
       this.misTrxnRpt.controls['client_name'].setValue('',{emitEvent:false});
      //  this.searchTrxnReport();
  }
};

setEuinDropdown = (sub_brk_cd, rm) => {
  this.__euinMst = rm.filter(
    (item) =>
      !this.__subbrkArnMst
        .map((item) => {
          return item['emp_euin_no'];
        })
        .includes(item.euin_no)
  );
  if (sub_brk_cd.length > 0) {
    sub_brk_cd.forEach((element) => {
      if (
        this.__subbrkArnMst.findIndex((el) => element.code == el.code) != -1
      ) {
        this.__euinMst.push({
          euin_no:
            this.__subbrkArnMst[
              this.__subbrkArnMst.findIndex((el) => element.code == el.code)
            ].euin_no,
          emp_name: '',
        });
      }
    });
  } else {
    this.__euinMst = this.__euinMst.filter(
      (item) =>
        !this.__subbrkArnMst
          .map((item) => {
            return item['euin_no'];
          })
          .includes(item.euin_no)
    );
  }
  const euin_no = this.__euinMst.map(el => el.euin_no);
  const dt = this.misTrxnRpt.get('euin_no').value.filter(el => euin_no.includes( el.euin_no));
  this.misTrxnRpt.get('euin_no').setValue(dt,{emitEvent:false});
};
disabledSubBroker(bu_type_ids) {
  if (bu_type_ids.findIndex((item) => item.bu_code == 'B') != -1) {
    this.misTrxnRpt.controls['sub_brk_cd'].enable();
  } else {
    this.misTrxnRpt.controls['sub_brk_cd'].disable();
  }
}
getSubBrokerMst(arr_euin_no) {
  if (arr_euin_no.length > 0) {
    this.dbIntr
      .api_call(
        0,
        '/subbroker',
        'arr_euin_no=' +
          JSON.stringify(
            arr_euin_no.map((item) => {
              return item['euin_no'];
            })
          )
      )
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__subbrkArnMst = res.map(
          ({ code, bro_name, emp_euin_no, euin_no }) => ({
            code,
            emp_euin_no,
            euin_no,
            bro_name: bro_name + '-' + code,
          })
        );
        const code = this.__subbrkArnMst.map(el => el.code);
        const dt = this.misTrxnRpt.get('sub_brk_cd').value.filter(el => code.includes( el.code));
        this.misTrxnRpt.get('sub_brk_cd').setValue(dt,{emitEvent:false});
      });
  } else {
    this.__subbrkArnMst = [];
    this.misTrxnRpt.controls['sub_brk_cd'].setValue([]);
  }
}
getBusinessTypeMst(brn_cd) {
  if (brn_cd.length > 0) {
    this.dbIntr
      .api_call(
        0,
        '/businessType',
        'arr_branch_id=' +
          JSON.stringify(
            brn_cd.map((item) => {
              return item['id'];
            })
          )
      )
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.__bu_type = res;
        const bu_code = this.__bu_type.map(el => el.bu_code);
        const dt = this.misTrxnRpt.get('bu_type_id').value.filter(el => bu_code.includes( el.bu_code));
        this.misTrxnRpt.get('bu_type_id').setValue(dt,{emitEvent:false});
      });
  } else {
    this.misTrxnRpt.controls['bu_type_id'].setValue([], { emitEvent: true });
    this.__bu_type = [];
  }
}
getRelationShipManagerMst(bu_type_id, arr_branch_id) {
  if (bu_type_id.length > 0 && arr_branch_id.length > 0) {
    this.dbIntr
      .api_call(
        0,
        '/employee',
        'arr_bu_type_id=' +
          JSON.stringify(
            bu_type_id.map((item) => {
              return item['bu_code'];
            })
          ) +
          '&arr_branch_id=' +
          JSON.stringify(
            arr_branch_id.map((item) => {
              return item['id'];
            })
          )
      )
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.__RmMst = res;
        const euin_no = this.__RmMst.map(el => el.euin_no);
        const dt = this.misTrxnRpt.get('rm_id').value.filter(el => euin_no.includes( el.euin_no));
        this.misTrxnRpt.get('rm_id').setValue(dt,{emitEvent:false});
      });
  } else {
    this.__RmMst = [];
    this.misTrxnRpt.controls['rm_id'].setValue([],{emitEvent:true});
  }
}


filterGlobal = ($event) => {
  let value = $event.target.value;
  this.primeTbl.filterGlobal(value,'contains')
}

filterGlobal_secondary = ($event) =>{
  let value = $event.target.value;
  this.secondaryTbl.filterGlobal(value,'contains')
}

getColumns = () =>{
  return this.utility.getColumns(this.column);
}

getcolumns_secondary = () =>{
  return this.utility.getColumns(this.column);
}
loadInvestorOnScrollToEnd = (ev) =>{
  // console.log(this.misTrxnRpt.value.client_name);
  if(this.misTrxnRpt.value.client_name == ''){
    // console.log('adasd')
    this.paginate+=1;
  this.getClientMst(this.misTrxnRpt.value.view_type,this.paginate);
  }
}
onAmcDeSelect = (ev) =>{
//  this.misTrxnRpt.get('amc_id').setValue(this.misTrxnRpt.value.amc_id.filter(item => item.id != ev.id));
}
onCatDeSelect = (ev) =>{
  // this.misTrxnRpt.get('cat_id').setValue(this.misTrxnRpt.value.cat_id.filter(item => item.id != ev.id));
}
onSubCatDeSelect = (ev) =>{
  // this.misTrxnRpt.get('sub_cat_id').setValue(this.misTrxnRpt.value.sub_cat_id.filter(item => item.id != ev.id));
}
onTrxnTypeDeSelect = (ev) =>{
  // this.misTrxnRpt.get('trxn_type_id').setValue(this.misTrxnRpt.value.trxn_type_id.filter(item => item.id != ev.id));
}
onbuTypeDeSelect = (ev) =>{
  // this.misTrxnRpt.get('bu_type_id').setValue(this.misTrxnRpt.value.bu_type_id.filter(item => item.bu_code != ev.bu_code));
}
onbrnCdDeSelect = (ev) =>{
  // this.misTrxnRpt.get('brn_cd').setValue(this.misTrxnRpt.value.brn_cd.filter(item => item.id != ev.id));
}
onRmDeSelect = (ev) =>{
  // this.misTrxnRpt.get('rm_id').setValue(this.misTrxnRpt.value.rm_id.filter(item => item.euin_no != ev.euin_no));
}
onSubBrkDeSelect = (ev) =>{
  // this.misTrxnRpt.get('sub_brk_cd').setValue(this.misTrxnRpt.value.sub_brk_cd.filter(item => item.code != ev.code));

}
changePage = (ev) =>{
    // console.log(ev);
}

toggle() {
  this.state = this.state === 'collapsed' ? 'expanded' : 'collapsed';
}
getTransaction = async (column:string,trxn:TrxnRpt[],header:string,category:string) =>{
  this.utility.closeSnackBar();
  if(trxn.length > 0){
    this.secondaryTbl.reset();
    this.popup_header_title =  header;
    this.isLoader = true;
    this.visible = true;
    this.shwoPopup__trxn = trxn
    this.isLoader = false;
    }
    else{
      this.utility.showSnackbar(`There are no data available under ${category} in ${header.replace('Count', '') } transaction`,0,true);
    }
  }


}
