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
import periods from '../../../../../../../../assets/json/datePeriods.json';
import { amc } from 'src/app/__Model/amc';
import { client } from 'src/app/__Model/__clientMst';
import { category } from 'src/app/__Model/__category';
import { subcat } from 'src/app/__Model/__subcategory';
import { scheme } from 'src/app/__Model/__schemeMst';
import { rntTrxnType } from 'src/app/__Model/MailBack/rntTrxnType';
import { global } from 'src/app/__Utility/globalFunc';
import filterOpt from '../../../../../../../../assets/json/filterOption.json';
import { Calendar } from 'primeng/calendar';
import { dates } from 'src/app/__Utility/disabledt';
import { totalAmt } from 'src/app/__Model/TotalAmt';
import { Table } from 'primeng/table';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, Subscription, from, of } from 'rxjs';
import clientType from '../../../../../../../../assets/json/view_type.json';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { trxnCountAmtSummaryColumn, trxnCountSummary } from './trxnAmtCountSummary';

 type TrxnType = {
   reject:Partial<TrxnRpt[]>;
   process:Partial<TrxnRpt[]>;
   total:Partial<TrxnRpt[]>
 }

@Component({
  selector: 'app-trxn-rpt',
  templateUrl: './trxn-rpt.component.html',
  styleUrls: ['./trxn-rpt.component.css'],
  animations: [
    trigger('bodyExpansion', [
      state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed, void => collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('formbodyExpansion', [
      state('collapsed, void', style({ height: '0px', padding: '0px 20px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', padding: '10px 20px', visibility: 'visible', })),
      transition('expanded <=> collapsed, void => collapsed',
        animate('230ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]

})
export class TrxnRptComponent implements OnInit {

  transType:string = '';

  trxnAmtCountClm:column[] = trxnCountAmtSummaryColumn.columns;

  transaction_amt_count_summary = [];

  rows:number = 10;

  first:number = 0;

  subscribe:Subscription;

  trxn_count:TrxnType;

  @ViewChild('primeTbl') primeTbl :Table;
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
   */
  column: column[] = trxnClm.column.filter((item:column) => (item.field!='amc_link' && item.field!='scheme_link' && item.field!='isin_link' && item.field!='plan_name' && item.field!='option_name' && item.field!='plan_opt' && item.field!='divident_opt' && item.field!='lock_trxn'));

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
    @Inject(DOCUMENT) private document: Document
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

  /**
   * Form Field for search Transaction
   */
  misTrxnRpt = new FormGroup({
    date_periods: new FormControl(''),
    date_range: new FormControl(''),
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
  });

  ngOnInit(): void {
    setTimeout(() => {
    this.misTrxnRpt.get('date_periods').setValue('M',{emitEvent:true});
    this.searchTrxnReport();
    }, 500);
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
        console.log(res);
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

  ngAfterViewInit() {
    // this.hideCard('none');
    // this.primeTbl.tableHeaderViewChild.nativeElement.style.position = 'sticky!important';

   /**
    *  Event Trigger on change on Date Periods
    */
   this.misTrxnRpt.controls['date_periods'].valueChanges.subscribe((res) => {
    if(res){
      this.misTrxnRpt.controls['date_range'].reset(
        res && res != 'R' ? ([new Date(dates.calculateDT(res)),new Date(dates.getTodayDate())]) : ''
      );
    }
    else{
      this.misTrxnRpt.controls['date_range'].setValue('');
      this.misTrxnRpt.controls['date_range'].disable();
      return;
    }

    if (res && res != 'R') {
      this.misTrxnRpt.controls['date_range'].disable();
    } else {
      this.misTrxnRpt.controls['date_range'].enable();
    }
  });


  this.misTrxnRpt.controls['date_range'].valueChanges.subscribe((res) => {
    if(res){
        this.maxDate = dates.calculatMaximumDates('R',6,new Date(res[0]));
      }
      else{
        this.maxDate = dates.calculateDates('T');
      }
  })

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
      this.disabledSubBroker(res);
      this.getRelationShipManagerMst(res, this.misTrxnRpt.value.brn_cd);
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
        tap(() => (this.__isClientPending = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.dbIntr.searchItems('/searchClient',
          dt+'&view_type='+this.misTrxnRpt.value.view_type
          ) : []

        ),
        map((x: any) => x.data)
      )
      .subscribe({
        next: (value) => {
          console.log(value);
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
            if(res){
              this.paginate = 1;
              this.__clientMst = [];
              this.misTrxnRpt.get('client_name').reset('',{emitEvent:false});
              this.misTrxnRpt.get('pan_no').reset('');
              this.getClientMst(res,this.paginate);
            }
      })
      /**End */

  }
  /**
   *  call API for get transaction according to search result
   */
  searchTrxnReport = () => {
    if(this.misTrxnRpt.value.date_periods == 'Y'
    // || this.misTrxnRpt.value.date_periods == 'R'
    || this.misTrxnRpt.value.date_periods == ''){
           if(this.misTrxnRpt.value.pan_no
            || this.misTrxnRpt.value.folio_no
            || this.misTrxnRpt.value.amc_id.length > 0
            || this.misTrxnRpt.value.trxn_type_id.length > 0
            )
           {}
           else{
            this.utility.showSnackbar('Please select one or more filter criteria',2)
            return;
           }
    }
    else if(this.misTrxnRpt.value.date_periods == 'R'){
          if(this.misTrxnRpt.value.date_range[0]
          && this.misTrxnRpt.value.date_range[1]){}
          else if(!this.misTrxnRpt.value.date_range[0]
          || !this.misTrxnRpt.value.date_range[1]){
            this.utility.showSnackbar('Please provide valid date range',2)
            return;
          }
    }
    // this.primeTbl.clear();

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
    const TrxnDt = new FormData();
    this.transType = 'Total'
    TrxnDt.append('date_range',global.getActualVal(this.date_range.inputFieldValue));
    TrxnDt.append('folio_no',global.getActualVal(this.misTrxnRpt.value.folio_no));
    // TrxnDt.append('client_id',global.getActualVal(this.misTrxnRpt.value.client_id));
    TrxnDt.append('amc_id',this.utility.mapIdfromArray(this.misTrxnRpt.value.amc_id, 'id'));
    TrxnDt.append('cat_id',this.utility.mapIdfromArray(this.misTrxnRpt.value.cat_id, 'id'));
    TrxnDt.append('sub_cat_id',this.utility.mapIdfromArray(this.misTrxnRpt.value.sub_cat_id, 'id'));
    TrxnDt.append('pan_no',this.misTrxnRpt.value.pan_no);
    TrxnDt.append('scheme_id',this.utility.mapIdfromArray(this.misTrxnRpt.value.scheme_id, 'id'));
    TrxnDt.append('trans_type',this.utility.mapIdfromArray(this.misTrxnRpt.value.trxn_type_id,'trans_type'));
    TrxnDt.append('trans_sub_type',this.utility.mapIdfromArray(this.misTrxnRpt.value.trxn_sub_type_id,'trans_sub_type'));
    if (this.btn_type == 'A') {
      TrxnDt.append('euin_no',this.utility.mapIdfromArray(this.misTrxnRpt.value.euin_no, 'euin_no'));
      TrxnDt.append('brn_cd',this.utility.mapIdfromArray(this.misTrxnRpt.value.brn_cd, 'id'));
      TrxnDt.append('rm_id',this.utility.mapIdfromArray(this.misTrxnRpt.value.rm_id, 'euin_no'));
      TrxnDt.append('bu_type',this.utility.mapIdfromArray(this.misTrxnRpt.value.bu_type_id, 'bu_code'));
      TrxnDt.append('sub_brk_cd',this.utility.mapIdfromArray(this.misTrxnRpt.value.sub_brk_cd, 'code'));
    }
     let count = 0;
     count = this.trxnRpt.length;
    this.trxnRpt = [];
    this.dbIntr
      .api_call(1, '/showTransDetails', TrxnDt)
      .pipe(
        pluck('data'),
        tap((item:TrxnRpt[]) => {
            let net_amt = 0,gross_amt=0,tds=0,stamp_duity =0;
          this.trxn_count = {
            reject:item.filter(res => res.transaction_subtype.includes('Rejection')),
             process:item.filter(res => !res.transaction_subtype.includes('Rejection')),
             total: item
            };

           item.map( item => {
              net_amt+=Number(item.tot_amount ? item.tot_amount : 0);
              gross_amt+=Number(item.tot_gross_amount ? item.tot_gross_amount : 0);
              tds+=Number(item.tot_tds ? item.tot_tds : 0);
              stamp_duity+=Number(item.tot_stamp_duty ? item.tot_stamp_duty : 0);
              this.total = {
                      net_amt:net_amt,
                      stamp_duity:stamp_duity,
                      tds:tds,
                      gross_amt:gross_amt
                };
            });
        })
        )
      .subscribe((res: TrxnRpt[]) => {
        if(res.length > 0){
        this.calculateProcess_Reject(res);
      }
        // console.log(res);

       this.isTotalFooterShow = (this.misTrxnRpt.value.folio_no != '' || this.misTrxnRpt.value.pan_no != '') ? true : false;
        if(this.subscribe){
          this.subscribe.unsubscribe();
        }
        if(res.length == 0){
          this.utility.showSnackbar('No transactions are available on this periods',2,true);
          return;
        }
      this.state = 'collapsed';
       this.subscribe = from(res).pipe(
        delay(2),
       ).subscribe(res =>{
          this.streamTrxn(res);
        });
      });
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
    // console.log(this.transaction_amt_count_summary);
  }


  streamTrxn(trxnRow:TrxnRpt){
    console.log(trxnRow);
   this.trxnRpt.push(trxnRow);
  }

  /**
   * event trigger after select particular result from search list
   * @param searchRlt
   */
  getSelectedItemsFromParent = (searchRlt: {
    flag: string;
    item: any;
  }) => {
    this.misTrxnRpt.get('client_name').reset(searchRlt.item.first_client_name, { emitEvent: false });
    this.misTrxnRpt.get('pan_no').reset(searchRlt.item.first_client_pan);
    this.searchResultVisibilityForClient('none');
  };

  /**
   *  evnt trigger on search particular client & after select client
   * @param display_mode
   */
  searchResultVisibilityForClient = (display_mode: string) => {
    console.log(display_mode);
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
    console.log(amc_id)
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
          date_range:'',
          date_periods:'M',
          view_type:'',
          pan_no:''
         });
         this.paginate = 1;
         this.misTrxnRpt.get('brn_cd').setValue([],{emitEvent:true});
         this.__subbrkArnMst = [];
         this.misTrxnRpt.controls['sub_brk_cd'].setValue([]);
         this.misTrxnRpt.controls['euin_no'].setValue([]);
         this.misTrxnRpt.controls['client_name'].setValue('',{emitEvent:false});
         this.searchTrxnReport();
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

  getColumns = () =>{
    return this.utility.getColumns(this.column);
  }
  loadInvestorOnScrollToEnd = (ev) =>{
    console.log(this.misTrxnRpt.value.client_name);
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
      console.log(ev);
  }

  toggle() {
    this.state = this.state === 'collapsed' ? 'expanded' : 'collapsed';
  }
}
