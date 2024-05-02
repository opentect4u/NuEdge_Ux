import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import  ClientType  from '../../../../../../../assets/json/view_type.json';
import { client } from 'src/app/__Model/__clientMst';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { UtiliService } from 'src/app/__Services/utils.service';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Calendar } from 'primeng/calendar';
import portfolioFilter from '../../../../../../../assets/json/Product/Portfolio/liveMFPortfolioFilter.json';
import portFolioTab from '../../../../../../../assets/json/Product/Portfolio/liveMfPortfolioTab.json'
import { global } from 'src/app/__Utility/globalFunc';
import { IPLTrxn } from './pl-trxn-dtls/pl-trxn-dtls.component';
import { IRecentTrxn } from './recent-trxn/recent-trxn.component';
import { ILiveSIP } from './live-sip/live-sip.component';
import { ILiveSTP } from './live-stp/live-stp.component';
import { ILiveSWP } from './live-swp/live-swp.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { rntTrxnType } from 'src/app/__Model/MailBack/rntTrxnType';
import { IUpcommingTrxn } from './upcomming-trxn/upcomming-trxn.component';
import { ISystematicMissedTrxn } from './systematic-missed-trxn/systematic-missed-trxn.component';
import { Observable, Subscription, fromEvent } from 'rxjs';

/*** Display Footer data on Raw Expand Inside Inner Table*/
type TotalsubLiveMFPortFolio = {
  tot_amount:number | undefined,
  tot_tds:number| undefined,
  tot_stamp_duty:number | undefined,
  tot_idcwr:number | undefined,
  pur_price:number | undefined,
  tot_units:number | undefined,
  cumml_units:number | undefined,
  curr_val:number | undefined,
  gain_loss:number | undefined,
  ret_abs:number | undefined,
  ret_cagr:number | undefined,
  xirr:number | undefined,
  gross_amount:number | undefined
}
/*** End */
/**** Display Footer Data On Parent Table*/
type TotalparentLiveMfPortFolio = {
    inv_cost: number | undefined;
    idcwr: number | undefined;
    tot_units: number | undefined;
    curr_val:number | undefined;
    total:number | undefined;
    gain_loss: number | undefined;
    ret_abs: number | undefined;
    pur_nav:number | undefined
}
/*** End */

@Component({
  selector: 'app-live-mf-port-folio',
  templateUrl: './live-mf-port-folio.component.html',
  styleUrls: ['./live-mf-port-folio.component.css'],
})

export class LiveMfPortFolioComponent implements OnInit {


  @ViewChild("calendar", { static: false }) private TrnsDateRange: Calendar;

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

/* The above code is defining an array of objects in TypeScript. Each object in the array has two
properties: `act_value` and `value`. The `act_value` property represents an actual value, while the
`value` property represents a corresponding label. The array appears to be defining different
mappings between `act_value` and `value` for transition durations. */

  trans_duration = [
    {act_value:'A',value:'All'},
    {act_value:'< 1',value:'Below 1 year'},
    {act_value:'> 1',value:'Above 1 year'},
    {act_value:'> 2',value:'Above 2 year'},
    {act_value:'> 3',value:'Above 3 year'},
    {act_value:'> 4',value:'Above 4 year'},
    {act_value:'> 5',value:'Above 5 year'},
    {act_value:'> 7',value:'Above 7 year'},
    {act_value:'> 10',value:'Above 10 year'},
    {act_value:'D',value:'Date Range'}
  ]

  __portfolioFiter = portfolioFilter;

  flowType = [
    {
      id:"A",name:'All'
    },
    {
      id:"I",name:'Inflow'
    },
    {
      id:"O",name:'Outflow'
    }
  ]

  __live_sip_stp_swp_form = new FormGroup({
      live_sip:new FormControl(''),
      live_stp:new FormControl(''),
      live_swp:new FormControl('')
  })

   /**
   *  getAccess of Prime Ng Calendar
   */
   @ViewChild('recentdateRng') recent_date_range:Calendar;

  /*** Holding Tab details for liveMFPortfolio */
  __portFolioTab = portFolioTab;

  selected_id:number = 1;

  truncated_val : number = 10;

  __selectedRow:ILivePortFolio;

  __isDisplay__modal:boolean = false;

  subLiveMfPortFolio: Partial<TotalsubLiveMFPortFolio>;

  parentLiveMfPortFolio: Partial<TotalparentLiveMfPortFolio>;

  /**
   * Holding Transaction Type  Master Data
   */
    trxnTypeMst: rntTrxnType[] = [];

  /**
   * Holding Transaction Type  Master Data
   */
    trxnTypeMst_upcomming:rntTrxnType[] = [];

  /**
   * Holding Transaction Sub-Type  Master Data
   */
  trxnSubTypeMst: rntTrxnType[] = [];

  /**
    * Holding Transaction SubType Master Data for Upcomming Transaction
    */
  UpComming_trxnSubTypeMst: rntTrxnType[] = [];


  view_by = ClientType

  /** Holding client details in array format after search */
  __clientMst:client[] = [];

  /** Holding  Systematic Missed Transaction Master Data*/
    // systematicMissedTrxn:ISystematicMissedTrxn[] = []
    systematicMissedTrxn:TrxnRpt[] = []

  /**** End */

  /** Holding Reject Transaction Master Data */
    rejectTrxn:TrxnRpt[] = []
  /** End */

    /**
   * Setting of multiselect dropdown
   */
    settingsforFamilyMembers = this.utility.settingsfroMultiselectDropdown(
      'pan',
      'client_name',
      'Search Family members',
      2
    );

    // settingsforFlow_type = this.utility.settingsfroMultiselectDropdown(
    //   'id',
    //   'name',
    //   'Search Flow Type',
    //   2
    // );

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
     * Setting of multiselect dropdown of `show_valuaton_with`,`Transaction_with`,`column_chooser`
     */
      settings = this.utility.settingsfroMultiselectDropdown(
        'flag',
        'name',
        'Search',
        1
      );

    /**
     * Holding Client Details & display in middle card
     */
    clientDtls:Partial<client>;

    /*** Holding P&L transaction details */

    plTrxnDtls:Partial<IPLTrxn>[] = [];

    /*** End */

    /** Holding Recent transaction details */
    recent_trxn:Partial<IRecentTrxn>[] = []
    /*** End */

    /** Holding Upcomming Transaction Details*/
    upcomming_trxn:Partial<IUpcommingTrxn>[] = []
    /** End */

     /** Holding Recent transaction details */
     liveSipPortFolio:Partial<ILiveSIP>[] = []
     /*** End */

     /** Holding Live SWP Transaction details */
     liveStpPortFolio:Partial<ILiveSTP>[] = []
     /*** End */

     /** Holding Live SWP Transaction details */
     liveSwpPortFolio:Partial<ILiveSWP>[] = []
     /***End */

  /**
   * Holding family members details in array format after select a family head
   */
  family_members:client[]= [];

  /**
   * showing loader when search cliient
   */
  __isClientPending:boolean = false

  /**
   * maintain display mode for client search list
   */
  displayMode_forClient:string;
  /**
   * Column For Parent Table
   */
  parent_column:column[] = LiveMFPortFolioColumn.column;

  /**
   * Column For Sub Table
   */
  child_column:column[] = LiveMFPortFolioColumn.sub_column;

  /**
   * Holding Main data for Live MF Port Folio
   */
  dataSource:ILivePortFolio[] = [];

  @ViewChild('primeTble') primeTbl :Table;

  @ViewChild('detailedTbl') secondaryTbl :Table;

  @ViewChild('dateRng') date__rng:Calendar;

  valuation_as_on:string;

  details__transaction_details:ISubDataSource[] = [];

  detailedColumn:column[] = LiveMFPortFolioColumn.details_column;

  // datePipe:DatePipe;

  main_frm_dt;

  filter_criteria = new FormGroup({
        valuation_as_on: new FormControl((new Date())),
        client_name: new FormControl(''),
        pan_no: new FormControl(''),
        view_type: new FormControl(''),
        family_members: new FormControl([]),
        trans_type:new FormControl('L'),
        view_funds_type: new FormControl('A'),
        view_mf_report:new FormControl(''),
        is_new_tab:new FormControl(false),
        trans_date_range:new FormControl(''),
        trans_duration: new FormControl('A'),
        show_valuation_with:new FormControl(this.__portfolioFiter?.val_with),
        trans_with:new FormControl(this.__portfolioFiter?.trans_with.filter(item => item.id ==1)),
        clmn_chooser: new FormControl(this.__portfolioFiter?.clm_chooser.map(item =>  ({name: item.name,flag:item.flag})))
  })

  max_date :Date = new Date()

  recent_trxn_frm = new FormGroup({
    date_range:new FormControl(''),
    flow_type: new FormControl('A'),
    trxn_type_id:new FormControl([],{
      updateOn:'blur'
    }),
    trxn_sub_type_id:new FormControl([]),
  })

  upcomming_trxn_frm = new FormGroup({
    flow_type: new FormControl('A'),
    trxn_type_id:new FormControl([],{
      updateOn:'blur'
    }),
    trxn_sub_type_id:new FormControl([]),
  })

  constructor(private __dbIntr:DbIntrService,
    private utility:UtiliService,
    private router:Router,
    private activateRoute:ActivatedRoute,
    private datePipe:DatePipe,
    private spinner:NgxSpinnerService
    ) {
      const dt = new Date();
      dt.setDate(dt.getDate() - 1)
      this.recent_trxn_frm.patchValue({
        date_range: [dt,this.max_date]
      })
    }

  ngOnInit(): void {

    if(this.activateRoute.snapshot.queryParams.id){
      let rt_prms = JSON.parse(this.utility.decrypt_dtls(atob(this.activateRoute.snapshot.queryParams.id)));
      try{

          console.log(rt_prms)
          this.filter_criteria.get('client_name').setValue(rt_prms ? rt_prms?.client_name : '' ,{emitEvent:false});
          this.filter_criteria.patchValue({
            valuation_as_on:rt_prms ? new Date(rt_prms?.valuation_as_on) : '',
            family_members: rt_prms ? rt_prms?.family_members : [],
            pan_no: rt_prms ? rt_prms?.pan_no : '',
            trans_type: rt_prms ? rt_prms?.trans_type : '',
            view_funds_type: rt_prms ? rt_prms?.view_funds_type : '',
            view_mf_report: rt_prms ? rt_prms?.view_mf_report : '',
            view_type: rt_prms ? rt_prms?.view_type : '',
            trans_duration:rt_prms ? rt_prms?.trans_duration : '',
            trans_date_range:rt_prms ? (rt_prms?.trans_date_range ? [new Date(rt_prms?.trans_date_range[0]),new Date(rt_prms?.trans_date_range[1])] : '') : '',
          });

          setTimeout(() => {
            this.showReport()
        }, 1000);
      }
      catch(ex){
        // console.log(ex);
        // console.log(`ERROR`)
      }
    }
    else{
      this.filter_criteria.get('client_name').disable();
    }

  }
  /** To check whether the li of the ul has been overflowed or not  */
   isOverflown(element){
    try{
      let cus__tab:any  = document.getElementById('cus___tab');
      let arrow_left:any = document.getElementById('arrow-left');
      let arrow_right:any = document.getElementById('arrow-right');
      let isOverflowed = element?.scrollHeight > element?.clientHeight || element?.scrollWidth > element?.clientWidth;
      if(arrow_left && arrow_right && cus__tab){
      arrow_left.style.display = isOverflowed ? 'block' : 'none';
      arrow_right.style.display = isOverflowed ? 'block' : 'none';
      cus__tab.style.margin = isOverflowed ? '0px 33px' : '0px 0px';
    }
    }
    catch(err){
    }

  }

  getwindowresizeEVent = () =>{
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe(e => {
        this.isOverflown(document.getElementById('cus___tab'));
    });
  }

  ngAfterViewInit(){

    this.getwindowresizeEVent()

     /**
     * Event Trigger after change Transaction Duration
     */
    this.filter_criteria.controls['trans_duration'].valueChanges.subscribe((res) => {
      if(res != 'D'){
        this.recent_trxn_frm.controls['trans_date_range'].setValue('')
      }
    });
    /** End */


     /**
     * Event Trigger after change Transaction Type
     */
     this.recent_trxn_frm.controls['trxn_type_id'].valueChanges.subscribe((res) => {
      this.getTrxnSubTypeMst(res);
    });

    this.upcomming_trxn_frm.controls['trxn_type_id'].valueChanges.subscribe((res) => {
      this.getTrxnSubTypeMstForUpcomming(res);
    });

   this.__live_sip_stp_swp_form.controls['live_sip'].valueChanges.subscribe(value =>{
      this.liveSipPortFolio = []
      this.call_api_for_sip_func(this.main_frm_dt,value)
   })

   this.__live_sip_stp_swp_form.controls['live_stp'].valueChanges.subscribe(value =>{
    this.liveStpPortFolio = []
    this.call_api_for_stp_func(this.main_frm_dt,value)
 })

 this.__live_sip_stp_swp_form.controls['live_swp'].valueChanges.subscribe(value =>{
  this.liveSwpPortFolio = []
  this.call_api_for_swp_func(this.main_frm_dt,value)
 })




    this.date__rng.maxDate = new Date();

      /**view_type Change*/
      this.filter_criteria.controls['view_type'].valueChanges.subscribe(res => {
        if(this.family_members.length > 0){
          this.getFamilyMembers();
        }
        this.filter_criteria.get('client_name').reset('', { emitEvent: false });
        this.filter_criteria.get('pan_no').reset('');
        if (res) {
          this.filter_criteria.get('client_name').enable();
          this.__clientMst = [];
        }
        else{
          this.filter_criteria.get('client_name').disable();
        }
      })
          /**End */

    /** Investor Change */
    this.filter_criteria.controls['client_name'].valueChanges
      .pipe(
        tap(() => this.filter_criteria.get('pan_no').setValue('')),
        tap(() =>  {
          this.__isClientPending = true;
           if(this.family_members.length > 0){
            this.getFamilyMembers();
           }
        }),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.searchItems('/searchWithClient',
            dt + '&view_type=' + this.filter_criteria.value.view_type
          ) : []

        ),
        map((x: any) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__clientMst = value;
          this.searchResultVisibilityForClient('block');
          this.__isClientPending = false;
        },
        complete: () => { },
        error: (err) => {
          this.__isClientPending = false;
        },
      });

    /** End */
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe();
  }

  /**
  *  evnt trigger on search particular client & after select client
  * @param display_mode
  */
  searchResultVisibilityForClient = (display_mode: string) => {
    this.displayMode_forClient = display_mode;
  };


  /**
  * event trigger after select particular result from search list
  * @param searchRlt
  */
  getSelectedItemsFromParent = (searchRlt: {
    flag: string;
    item: any;
  }) => {
    this.filter_criteria.get('client_name').reset(searchRlt.item.client_name, { emitEvent: false });
    this.filter_criteria.get('pan_no').reset(searchRlt.item.pan);
    this.__isClientPending = false;
    this.searchResultVisibilityForClient('none');
    if(this.filter_criteria.value.view_type == 'F'){
            this.getFamilyMembers(searchRlt.item.client_id)
    }
  };

  getFamilyMembers = (id:number | undefined = undefined) =>{
    if(id){
       this.__dbIntr.api_call(0,'/clientFamilyDetail',`family_head_id=${id}&view_type=${this.filter_criteria.value.view_type}`)
       .pipe(pluck('data'))
       .subscribe((res:client[]) =>{
        // console.log(res);
        this.family_members = res;
        this.filter_criteria.get('family_members').setValue(res.map((item:client) => ({pan:item.pan,client_name:item.client_name})))
       })
    }
    else{
        this.family_members = [];
        this.filter_criteria.get('family_members').setValue([]);

    }
  }

  setcolumns = (column_to_be_set_on_tble:column[]) =>{
    const act_column =this.__portfolioFiter?.clm_chooser.map(column => column.flag);
    const act_column_to_be_set = this.filter_criteria.value.clmn_chooser.map(column => column.flag);
    const dt  = column_to_be_set_on_tble.filter((clmn:column)=>{
            if(act_column.findIndex(item => item === clmn.field) == -1){
              clmn.isVisible = true;
            }
            else{
              clmn.isVisible = act_column_to_be_set.findIndex(item => item === clmn.field) !=  -1
            }
            return clmn.isVisible ? clmn : false;
    });
    // this.child_column = LiveMFPortFolioColumn.sub_column.filter((clmn:column)=>{
    //     if(act_column.findIndex(item => item === clmn.field) == -1){
    //       clmn.isVisible = true;
    //     }
    //     else{
    //       clmn.isVisible = act_column_to_be_set.findIndex(item => item === clmn.field) !=  -1
    //     }
    //     return clmn.isVisible ? clmn : false;
    //   });
    return dt;
  }

  showReport = () =>{
    this.parent_column = this.setcolumns(LiveMFPortFolioColumn.column);
    if(this.__selectedRow){
      this.primeTbl.toggleRow(this.__selectedRow);
    }
    this.__selectedRow = null;
    this.dataSource = [];
    this.parentLiveMfPortFolio = null;
    this.subLiveMfPortFolio = null;
    if(this.filter_criteria.value.valuation_as_on){
    if(this.filter_criteria.value.pan_no || this.filter_criteria.value.client_name){
            if(this.filter_criteria.value.view_type == 'F'){
                if(this.filter_criteria.value.family_members.length == 0) {
                    this.utility.showSnackbar(`Please select at least one family member`,2);
                    return;
                }
            }
    }
    else{
        this.utility.showSnackbar(`Please select ${this.filter_criteria.value.view_type == 'F' ? 'family head' : ' investor'}`,2);
        return;
    }
    }
    else{
      this.utility.showSnackbar('Please select date',2);
      return;
    }
    if(this.filter_criteria.value.is_new_tab){
        window.open(`${this.router.url}?id=${btoa(this.utility.encrypt_dtls(JSON.stringify(this.filter_criteria.value)))}`, '_blank');
    }
    else{
    this.clientDtls = null;
    this.plTrxnDtls=[];
    this.liveSipPortFolio = [];
    this.liveSwpPortFolio = [];
    this.liveStpPortFolio = [];
    this.systematicMissedTrxn = [];
    this.upcomming_trxn = [];
    this.recent_trxn = [];
    this.rejectTrxn = [];
    const dt = new Date();
    dt.setDate(dt.getDate() - 1)
    this.recent_trxn_frm.patchValue({
      trxn_type_id:[],
      trxn_sub_type_id:[],
      flow_type:'A',
      date_range:[dt,this.max_date]
    })
    this.upcomming_trxn_frm.patchValue({
      trxn_type_id:[],
      trxn_sub_type_id:[],
      flow_type:'A',
    })
    this.__live_sip_stp_swp_form.reset('',{
      emitEvent:false,
      onlySelf:true
    });
    this.selected_id = this.__portFolioTab[0].id;
    this.valuation_as_on = this.filter_criteria.value.valuation_as_on;
    const {family_members,...rest} = Object.assign({},{
      ...this.filter_criteria.value,
      valuation_as_on:global.getActualVal(this.datePipe.transform(new Date(this.filter_criteria.value.valuation_as_on),'YYYY-MM-dd')),
      family_members_pan:this.utility.mapIdfromArray(this.filter_criteria.value.family_members.filter(item => item.pan),'pan') ,
      family_members_name: this.utility.mapIdfromArray(this.filter_criteria.value.family_members.filter(item => !item.pan),'client_name'),
      trans_date_range:this.filter_criteria.value.trans_duration == 'D' ? global.getActualVal(this.TrnsDateRange.inputFieldValue) : ''
    })
    this.main_frm_dt = rest;
    this.call_corrosponding_api(this.selected_id,rest);
    }
  }


  call_func_tab_change = () =>{
    if(this.__selectedRow){
      this.primeTbl.toggleRow(this.__selectedRow);
      this.__selectedRow = null
    }
    this.call_corrosponding_api(this.selected_id,this.main_frm_dt);
  }


  onRowExpand = (ev:{originalEvent:Partial<PointerEvent>,data:ILivePortFolio}) =>{
    try{
    this.subLiveMfPortFolio = null;
    this.__selectedRow = ev?.data;
    this.truncated_val = 0;
    const index = this.dataSource.map(item => item.id).indexOf(ev?.data.id);
    this.dataSource[index].data.length = 0;
    this.child_column = this.setcolumns(LiveMFPortFolioColumn.sub_column);
      this.__dbIntr.api_call(
        0,
        '/clients/liveMFShowDetails',
        `rnt_id=${ev.data.rnt_id}&product_code=${ev.data.product_code}&isin_no=${ev.data.isin_no}&folio_no=${ev.data.folio_no}&nav_date=${ev.data.nav_date}&valuation_as_on=${global.getActualVal(this.datePipe.transform(new Date(this.main_frm_dt?.valuation_as_on),'YYYY-MM-dd'))}&trans_type=${this.main_frm_dt?.trans_type}`)
      .pipe(
        pluck('data')
        )
      .subscribe((res: ISubDataSource[]) =>{
            let dates = [this.dataSource[index].nav_date];
            let amt = [this.dataSource[index].curr_val];
            let _index = 0;
            let nper = 0;
              this.dataSource[index].data = res.filter((item:ISubDataSource,i:number) =>{
                    try{

                      if(item.cumml_units > 0 && !item.transaction_type.toLowerCase().includes('redemption')){
                            amt.splice(_index,0,(Number(item.tot_gross_amount) * -1));
                            dates.splice(_index,0,item.trans_date);
                            _index += 1;
                            item.xirr = global.XIRR(amt,dates,0);
                            // nper = item.cumml_units >= 0 ? (item.days / 365) : 0;
                            // item.xirr = item.cumml_units >= 0 ? ((Math.pow((item.curr_val/Number(item.tot_amount)),(1/nper)) - 1) * 100) : 0;
                      }
                    }
                    catch(err){
                        item.xirr = 0;
                    }
                    return item;
              });
              this.calculat_Total_Value_For_Table_Footer(res,this.dataSource[index])
              this.show_more('M',index);
            /**** End */
        })
      }
    catch(ex){
        // console.log(ex);
        // console.log(`ERROR`)
    }
  }

  calculateTransaction = (redem_arr:ISubDataSource[],with_out_redem_arr:ISubDataSource[],index:number) =>{
        redem_arr.forEach((el,i) =>{
          let pur_price = el.pur_price;
          with_out_redem_arr = with_out_redem_arr.filter((item,j) => {
                      if(item.pur_price > 0){
                        if(pur_price > 0){
                              if(j > 0){
                                if(Number(with_out_redem_arr[j-1].pur_price) < 0){
                                    pur_price  = item.pur_price - Math.abs(pur_price);
                                    item.pur_price = pur_price
                                }
                              }
                              else{
                                    pur_price  = item.pur_price - Math.abs(pur_price);
                                    item.pur_price = pur_price
                              }
                        }
                        else{
                              pur_price  = item.pur_price - Math.abs(pur_price);
                              item.pur_price = pur_price
                          }
                      }
                      /**** END */
                    return item
          });
        });
        this.dataSource[index].data = this.filterTransactions(with_out_redem_arr.length > 0 ? with_out_redem_arr.filter(item => Number(item.pur_price) > 0) : with_out_redem_arr);
        this.show_more('M',index);
  }

  filterTransactions = (liveMFPortFolio:ISubDataSource[]): ISubDataSource[] => {
      // let getLastpositiveCummlDigitDtlsIndex = liveMFPortFolio.findIndex(el => el.cumml_units >= 0);
      let nper = 0;
      let cummulativeSum = liveMFPortFolio.find(el => el.cumml_units >=0)?.cumml_units;
      let FinalTransactions =  liveMFPortFolio.map(((element:ISubDataSource,i) =>{
                if(!element.transaction_type.toLowerCase().includes('redemption')){
                  if(element.cumml_units == 0){
                    cummulativeSum = cummulativeSum + Number(element.tot_units)
                    element.cumml_units = cummulativeSum
                  }
                  element.curr_val = element.cumml_units >= 0 ?  (Number(element.tot_units) * Number(element.curr_nav)) : 0;
                  element.gain_loss =element.cumml_units >= 0 ? (element.curr_val - Number(element.tot_amount)) : 0;
                  element.ret_abs = element.cumml_units >= 0 ? (element.gain_loss / Number(element.tot_amount)) * 100 : 0;
                  nper = element.cumml_units >= 0 ? (element.days / 365) : 0;
                  element.ret_cagr = element.cumml_units >= 0 ? ((Math.pow((element.curr_val/Number(element.tot_amount)),(1/nper)) - 1) * 100) : 0;
                }
            return element;
      }))
      // this.calculat_Total_Value_For_Table_Footer(FinalTransactions);
      return FinalTransactions;
  }

  calculat_Total_Value_For_Table_Footer(arr:Partial<ISubDataSource>[],final_arr){
          var tot_arr = arr.filter(row => (!row.transaction_type.toLowerCase().includes('redemption') && row.cumml_units > 0));
          try{
                  // this.subLiveMfPortFolio = {
                  //   tot_amount: this.Total__Count(tot_arr,item => Number(item.tot_amount)),
                  //   tot_tds:this.Total__Count(tot_arr,item => item.tot_tds),
                  //   tot_stamp_duty:this.Total__Count(tot_arr,item => Number(item.tot_stamp_duty)),
                  //   pur_price:this.Total__Count(tot_arr,item => Number(item.pur_price)) / tot_arr.length,
                  //   tot_units:this.Total__Count(tot_arr,item => Number(item.tot_units)),
                  //   curr_val:this.Total__Count(tot_arr,item=> Number(item.curr_val)),
                  //   gain_loss:this.Total__Count(tot_arr,item=> Number(item.gain_loss)),
                  //   ret_abs: this.Total__Count(tot_arr,item=> Number(item.ret_abs)) / tot_arr.length,
                  //   cumml_units:tot_arr.length > 0 ? tot_arr.slice(-1)[0].cumml_units : 0,
                  // }
                  this.subLiveMfPortFolio = {
                    tot_amount: final_arr ? final_arr?.inv_cost : 0,
                    tot_tds:this.Total__Count(tot_arr,item => Number(item.tot_tds)),
                    tot_stamp_duty:this.Total__Count(tot_arr,item => item.tot_stamp_duty ? Number(item.tot_stamp_duty) : 0),
                    // pur_price:this.Total__Count(tot_arr,item => Number(item.pur_price)) / tot_arr.length,
                    pur_price:final_arr ? final_arr?.pur_nav : 0,
                    tot_units:final_arr ? final_arr?.tot_units : 0,
                    curr_val:final_arr ? final_arr?.curr_val : 0,
                    gain_loss:final_arr ? final_arr?.gain_loss : 0,
                    ret_abs: final_arr ? final_arr?.ret_abs : 0,
                    cumml_units:tot_arr.length > 0 ? tot_arr.slice(-1)[0].cumml_units : 0,
                    xirr:final_arr ? final_arr?.xirr : 0,
                    gross_amount: final_arr ? final_arr?.inv_cost : 0
                  }

                  // console.log(this.subLiveMfPortFolio)

          }
          catch(ex){
            // console.log(ex)
          }
  }
  /**
   * For Counting Number of locked and unlocked transactions
   * @param arr
   * @param predicate
   * @returns
   */
  Total__Count<T>(arr: T[], predicate: (elem: T, idx: number) => number) {
    return arr.reduce((prev, curr, idx) => prev + (predicate(curr, idx)), 0)
    }

    Reset(){
      this.filter_criteria.patchValue({
          valuation_as_on:new Date(),
          pan_no: new FormControl(''),
          view_type: '',
          family_members: [],
          trans_type:'L',
          view_funds_type: 'A',
          view_mf_report:'',
          is_new_tab:false
      });
      this.filter_criteria.get('client_name').reset('',{emitEvent:false});
    }


  filterGlobal($event){
      let value = $event.target.value;
      this.primeTbl.filterGlobal(value,'contains')
  }
  filterGlobal_secondary = ($event) =>{
    let value = $event.target.value;
    this.secondaryTbl.filterGlobal(value,'contains')
  }

  getColumns = () =>{
    return this.utility.getColumns(this.detailedColumn);
  }

  OpenDialog = (liveMFPortFolio:ILivePortFolio) => {
    this.__isDisplay__modal = true;
    this.details__transaction_details = [];
    this.__dbIntr.api_call(
      0,
      '/clients/liveMFPortfolioDetails',
      `rnt_id=${liveMFPortFolio.rnt_id}&product_code=${liveMFPortFolio.product_code}&isin_no=${liveMFPortFolio.isin_no}&folio_no=${liveMFPortFolio.folio_no}&nav_date=${liveMFPortFolio.nav_date}&valuation_as_on=${global.getActualVal(this.datePipe.transform(new Date(this.main_frm_dt?.valuation_as_on),'YYYY-MM-dd'))}&trans_type=${this.main_frm_dt?.trans_type}`)
    .pipe(pluck('data'))
    .subscribe((res: ISubDataSource[]) =>{
      this.details__transaction_details = res.filter((item:ISubDataSource) =>{
            item.tot_tds = item.tot_tds.toString();
            item.idcwr = item.idcwr.toString();
            item.idcw_reinv = item.idcw_reinv.toString();
            item.idcwp = item.idcwp.toString();

            return item;
      })
    })
  }


  show_more = (mode:string,index:number) =>{
            // console.log('aass')
            this.spinner.show()
              if(mode == 'A'){
                    this.setTrancated_val(this.dataSource[index].data.length)
              }
              else{
                  const dt = this.truncated_val + 10;
                 if(dt >= this.dataSource[index].data.length){
                    this.setTrancated_val(this.dataSource[index].data.length)
                 }
                 else{
                    this.truncated_val+=10
                 }
                //  console.log(this.truncated_val)
              }
            this.spinner.hide();

  }

  setTrancated_val = (length_of_actual_array:number) => {
    this.truncated_val = length_of_actual_array
  }

  getTabsDtls = (tabs) => {
        if(tabs.items.length == 0){
          this.seleActivaTab(tabs);
        }
        this.call_func_tab_change()
  }

  call_corrosponding_api = (id:number,fb) =>{
      switch(id){
        case 1:
        case 2:this.call_api_for_detail_summary_func(fb);
        break;
        case 3: break;
        case 9: this.call_api_for_pL_func(fb); break; // call P&L
        case 11:  this.getTrxnTypeMst();break
        case 12:  this.getTrxnTypeMst_forUpcomming();break;
        case 13: this.call_api_for_reject_transactions(fb);break
        case 14: this.call_api_for_systematicMissedTransaction(fb);break;
        default: break;
      }

  }

  call_api_for_reject_transactions = (formData) =>{
        if(this.rejectTrxn.length == 0){
          this.__dbIntr.api_call(1,'/clients/liveMFRejectTrans',this.utility.convertFormData(formData)).pipe(pluck('data')).subscribe((res:Required<{data:TrxnRpt[],client_details:client}>) =>{
            this.rejectTrxn = res.data.filter((el:TrxnRpt) =>{
                    el.scheme_name = `${el.scheme_name}-${el.plan_name}-${el.divi_lock_flag == 'L' ? 'IDCW Reinvestment' :  el.option_name}`;
                    return true;
            })
            this.setClientDtls(res.client_details);
          })
        }
  }

  call_api_for_systematicMissedTransaction = (formData) =>{
      if(this.systematicMissedTrxn.length == 0){
        this.__dbIntr.api_call(1,'/clients/liveMFRejectTrans',this.utility.convertFormData(formData)).pipe(pluck('data'))
        // .subscribe((res:Required<{data:ISystematicMissedTrxn[],client_details:client}>) =>{
        .subscribe((res:Required<{data:TrxnRpt[],client_details:client}>) =>{
                this.systematicMissedTrxn = res.data.filter((el:TrxnRpt) =>{
                    if(el.transaction_type.toLowerCase().includes('sip') || el.transaction_type.toLowerCase().includes('stp') ||  el.transaction_type.toLowerCase().includes('swp')){
                      el.scheme_name = `${el.scheme_name}-${el.plan_name}-${el.divi_lock_flag == 'L' ? 'IDCW Reinvestment' :  el.option_name}`;
                      return true;
                    }
                    return false;
                })
                this.setClientDtls(res.client_details);
        })
      }
  }

  call_api_for_detail_summary_func(formData) {
    if(this.dataSource.length == 0){
      this.__dbIntr.api_call(1,'/clients/liveMFPortfolio',this.utility.convertFormData(formData))
      .pipe(pluck('data'))
      .subscribe((res:Required<{data,client_details:client}>) => {
            try{
              if(this.main_frm_dt?.trans_type == 'A'){
                    this.dataSource = res.data.filter((item: ILivePortFolio) => {
                      item.id = `${Math.random()}_${item.product_code}`;
                      item.data=[];
                      item.custom_trans_type = item.transaction_type.toLowerCase().includes('sip') ? '(SIP)' : (item.transaction_type.toLowerCase().includes('purchase') ? '(PIP)' : (item.transaction_type.toLowerCase().includes('switch') ? '(Switch In)' : ''))
                      if(item.mydata){
                        const amt = item?.mydata.all_amt_arr.map(item => Number(item));
                        const dt = item?.mydata.all_date_arr;
                        item.xirr = item.curr_val == 0 ? 0 : global.XIRR([...amt,item.curr_val],[...dt,item.nav_date],0)
                      }
                      else{
                        item.xirr =0
                      }
                      return item
                });
              }
              else{
                this.dataSource = res.data.filter((item: ILivePortFolio,index:number) => {
                  if(Number(item.curr_val) > 0 ){
                    item.id = `${Math.random()}_${item.product_code}`;
                    item.data=[];
                    item.custom_trans_type = item.transaction_type.toLowerCase().includes('sip') ? '(SIP)' : (item.transaction_type.toLowerCase().includes('purchase') ? '(PIP)' : (item.transaction_type.toLowerCase().includes('switch') ? '(Switch In)' : ''))
                    if(item.mydata){
                      const amt = item?.mydata.all_amt_arr.map(item => Number(item));
                      const dt = item?.mydata.all_date_arr;
                      item.xirr = item.curr_val == 0 ? 0 : global.XIRR([...amt,item.curr_val],[...dt,item.nav_date],0)
                    }
                    else{
                      item.xirr =0
                    }
                    return true
                   }
                   return false
                });
              }
              this.setParentTableFooter_ClientDtls(this.dataSource,res.client_details)
              }
            catch(ex){
                // console.log(ex)
            }
      })
    }
    }

    setParentTableFooter_ClientDtls(arr:ILivePortFolio[],client_details:client){
      if(arr.length > 0){
        this.setClientDtls(client_details)
        this.parentLiveMfPortFolio = {
         inv_cost: this.Total__Count(arr,x => Number(x.inv_cost)),
         pur_nav:(this.Total__Count(arr,x => Number(x.pur_nav)) / arr.length),
         tot_units:this.Total__Count(arr,x => Number(x.tot_units)),
         curr_val:this.Total__Count(arr,x => Number(x.curr_val)),
         total:this.Total__Count(arr,x => Number(x.curr_val)),
         ret_abs: (this.Total__Count(arr,x => Number(x.ret_abs)) / arr.length),
         gain_loss:this.Total__Count(arr,x =>  Number(x.gain_loss)),
        }
         setTimeout(() => {
             this.isOverflown(document.getElementById('cus___tab'));
         }, 1000);
      }
      else{
        this.utility.showSnackbar(`No transaction available for ${this.filter_criteria.value.client_name}`,0)
      }

    }



  /** call api for p&l */
  call_api_for_pL_func = (formData) =>{
    if(this.plTrxnDtls.length == 0){
      this.__dbIntr.api_call(1,'/clients/liveMFPL',this.utility.convertFormData(formData))
      .pipe(pluck('data')).subscribe((result:Required<{data:Partial<IPLTrxn>[],client_details:client}>) =>{
            this.plTrxnDtls = result.data.filter((item: IPLTrxn) =>
              {
                item.scheme_name= `${item.scheme_name} - ${item.plan_name} - ${item.option_name}`,
                item.gain_loss= ((Number(item.curr_val) + Number(item.tot_outflow)) - Number(item.tot_inflow));
                item.ret_abs = item.tot_inflow > 0 ?  (Number(item.gain_loss) / Number(item.tot_inflow)): 0;
                if(item.mydata){
                  const amt = item?.mydata.all_amt_arr.map(item => Number(item));
                  const dt = item?.mydata.all_date_arr;
                  item.xirr = item.curr_val == 0 ? 0 : global.XIRR([...amt,item.curr_val],[...dt,item.nav_date],0)
                }
                else{
                  item.xirr =0
                }
                return item
              }

            );
              console.log(this.plTrxnDtls)
              this.setClientDtls(result.client_details)
      })
   }
  }
  /*** End */

  /** call api for sip */
  call_api_for_sip_func = (formData,val) =>{
    if(val){
      this.__dbIntr.api_call(1,'/clients/liveMFSTW',
      this.utility.convertFormData(
        {
          ...formData,
          sip_type:val,
          report_type:'P'
        })
      )
      .pipe(pluck('data')).subscribe(
        (result:Required<{data:Partial<ILiveSIP>[],client_details:client}>) =>{
            this.liveSipPortFolio = result.data.filter((item: ILiveSIP) => {
                item.scheme_name=`${item.scheme_name} - ${item.plan_name} - ${item.option_name}`;
                item.duration = item.activate_status == 'Inactive' ? '0' : item.duration;
                if(item.folio_data){
                  const amt = item?.folio_data.all_amt_arr.map(item => Number(item));
                  const dt = item?.folio_data.all_date_arr;
                  item.xirr = Number(item.curr_val) == 0 ? 0 : global.XIRR([...amt,Number(item.curr_val)],[...dt,item.nav_date],0)
                }
                else{
                  item.xirr =0
                }
                return item
              });
              this.setClientDtls(result.client_details)
      })
    }
  }
  /** end */

   /** call api for stp */
   call_api_for_stp_func = (formData,val) =>{
    if(val){
      this.__dbIntr.api_call(1,'/clients/liveMFSTW',
      this.utility.convertFormData(
        {
          ...formData,
          stp_type:val,
          report_type:'SO'
        })
      )
      .pipe(pluck('data')).subscribe(
        (result:Required<{data:Partial<ILiveSTP>[],client_details:client}>) =>{
            this.liveStpPortFolio = result.data.filter((item: ILiveSTP) => {
              item.scheme_name=`${item.scheme_name} - ${item.plan_name} - ${item.option_name}`;
              item.duration = item.activate_status == 'Inactive' ? '0' : item.duration;
              if(item.folio_data){
                const amt = item?.folio_data.all_amt_arr.map(item => Number(item));
                const dt = item?.folio_data.all_date_arr;
                item.xirr = Number(item.curr_val) == 0 ? 0 : global.XIRR([...amt,Number(item.curr_val)],[...dt,item.nav_date],0)
              }
              else{
                item.xirr =0
              }
              return item
            });
            this.setClientDtls(result.client_details)
          })
        }
  }
  /** end */

  /** call api for stp */
  call_api_for_swp_func = (formData,val) =>{
    if(val){
  this.__dbIntr.api_call(1,'/clients/liveMFSTW',
      this.utility.convertFormData({...formData,swp_type:val,report_type:'R'}))
      .pipe(pluck('data')).subscribe(
        (result:Required<{data:Partial<ILiveSWP>[],client_details:client}>) =>{
            this.liveSwpPortFolio = result.data.filter((item: ILiveSWP) => {
              item.scheme_name=`${item.scheme_name} - ${item.plan_name} - ${item.option_name}`;
              item.duration = item.activate_status == 'Inactive' ? '0' : item.duration;

              if(item.folio_data && val != 'I'){
                const amt = item?.folio_data.all_amt_arr.map(item => Number(item));
                const dt = item?.folio_data.all_date_arr;
                item.xirr = Number(item.curr_val) == 0 ? 0 : global.XIRR([...amt,Number(item.curr_val)],[...dt,item.nav_date],0)
              }
              else{
                item.xirr =0
              }
              return item
              });
              this.setClientDtls(result.client_details)
      })
    }
  }
  /** end */

  /** call api for recent_trxn */
  call_api_for_recent_trxn_func = () =>{
    // if(this.recent_trxn.length == 0){
      this.__dbIntr.api_call(1,'/clients/liveMFRecentTrans',
       this.utility.convertFormData({
        ...this.main_frm_dt,
        ...this.recent_trxn_frm.value,
        date_range:global.getActualVal(this.recent_date_range.inputFieldValue),
        flow_type:this.recent_trxn_frm.value.flow_type == 'A' ? '' : this.recent_trxn_frm.value.flow_type,
        trans_sub_type:this.utility.mapIdfromArray(this.recent_trxn_frm.value.trxn_sub_type_id,'trans_sub_type'),
        trans_type:this.utility.mapIdfromArray(this.recent_trxn_frm.value.trxn_type_id,'trans_type'),
       })
      )
      .pipe(pluck('data')).subscribe((result:Required<{data:Partial<IRecentTrxn>[],client_details:client}>)  =>{
            this.recent_trxn = result.data.map((item: IRecentTrxn) => (
              {
                ...item,
                scheme_name: `${item.scheme_name} - ${item.plan_name} - ${item.option_name}`
              }));;
            this.setClientDtls(result.client_details)
      })
  //  }
  }
  /** End */

  /*** setting client details */
  setClientDtls = (clients:client) =>{
    if(!this.clientDtls){
      this.clientDtls = Object.assign(clients,
        {
          ...clients,
           add_line_1:[clients.add_line_1,clients.add_line_2,clients.add_line_3,clients.city_name,clients.state_name,clients.district_name,clients.pincode].filter(item => {return item}).toString()
        }
      );
      console.log( this.clientDtls)
    }
  }
  /** End */

  /*** Get Transaction Type From Master*/
  getTrxnTypeMst = () => {
    if(this.trxnTypeMst.length == 0){
      this.__dbIntr
        .api_call(0, '/rntTransTypeSubtypeShow', null)
        .pipe(pluck('data'))
        .subscribe((res: rntTrxnType[]) => {
          this.trxnTypeMst = res;
        });
     }
  };
  /** End */

    /*** Get Transaction Type From Master*/
    getTrxnTypeMst_forUpcomming = () => {
      if(this.trxnTypeMst_upcomming.length == 0){
        this.__dbIntr
          .api_call(0, `/rntSystematicTransType`, `rnt_id=1`)
          .pipe(pluck('data'))
          .subscribe((res: rntTrxnType[]) => {
            this.trxnTypeMst_upcomming = res;
          });
       }
    };
    /** End */

  /** Get Transaction SubType against Transaction Type */
  getTrxnSubTypeMst = <T extends rntTrxnType[]>(trxnType: T) => {
    if(trxnType.length > 0){
      this.__dbIntr
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
      this.recent_trxn_frm.get('trxn_sub_type_id').setValue([]);
    }
  };

  getTrxnSubTypeMstForUpcomming = <T extends rntTrxnType[]>(trxnType: T) => {
    if(trxnType.length > 0){
      this.__dbIntr
        .api_call(
          0,
          '/rntTransTypeSubtypeShow',
          'arr_trans_type=' + this.utility.mapIdfromArray(trxnType, 'trans_type')
        )
        .pipe(pluck('data'))
        .subscribe((res: rntTrxnType[]) => {
          this.UpComming_trxnSubTypeMst = res;
        });
    }
    else{
      this.UpComming_trxnSubTypeMst = [];
      this.upcomming_trxn_frm.get('trxn_sub_type_id').setValue([]);
    }
  };

  searchRecentTrxn =() =>{
    this.recent_trxn = [];
    this.call_api_for_recent_trxn_func()
  }

  searchUpcommingTrxn = () =>{
      this.__dbIntr.api_call(1,'/clients/liveMFUpcoming',
        this.utility.convertFormData({
          ...this.main_frm_dt,
          ...this.recent_trxn_frm.value,
          flow_type:this.upcomming_trxn_frm.value.flow_type == 'A' ? '' : this.upcomming_trxn_frm.value.flow_type,
          trans_sub_type:this.utility.mapIdfromArray(this.upcomming_trxn_frm.value.trxn_sub_type_id,'trans_sub_type'),
          trans_type:this.utility.mapIdfromArray(this.upcomming_trxn_frm.value.trxn_type_id,'trans_type'),
         }))
         .pipe(pluck('data'))
         .subscribe((res:Required<{data:Partial<IUpcommingTrxn>[],client_details:client}>) =>{
            const freq = ['Daily', 'Weekly', 'Fortnightly'];
            const check_valuation_date = new Date(this.valuation_as_on).getDate();
            this.upcomming_trxn = res.data.filter((el: IUpcommingTrxn) => {
                    el.scheme_name = `${el.scheme_name}-${el.plan_name}-${el.option_name}`;
                    el.trans_type =  el.trans_type.toLowerCase().includes('stp') ? 'STP' : (el.trans_type.toLowerCase().includes('swp') ? 'SWP' : "SIP")
                    if(freq.indexOf(el.freq) === -1){
                       el.date = this.setDateinUpcommingTrxn(
                        el.trans_type.toLowerCase().includes('stp') ? el.stp_date : (el.trans_type.toLowerCase().includes('swp') ? el.swp_date : el.sip_date),
                        check_valuation_date,
                        new Date()
                      )
                    }
                    else{
                      el.date = el.freq;
                    }
                  return true;
            })
         })
  }

  setDateinUpcommingTrxn = (date,valuation_as_on_date,currDate) =>{
        currDate.setDate(date);
        currDate.setMonth(valuation_as_on_date > Number(date) ? (currDate.getMonth() + 1) : currDate.getMonth());
        return currDate
  }

  getSubTabDtls = (tabs) =>{
    this.seleActivaTab(tabs);
  }

  seleActivaTab = (tabs) =>{
    this.selected_id = tabs.id
  }
  // @HostListener('window:scroll', ['$event'])
  // onScroll(event) {
  //   const element1 = document.getElementById('bck__Container');
  //   const element2 = document.getElementById('container_Tab');
  //   const rect1 = element1.getBoundingClientRect();
  //   const rect2 = element2.getBoundingClientRect();
  //   if (
  //     rect1.x < rect2.x + rect2.width &&
  //     rect1.x + rect1.width > rect2.x &&
  //     rect1.y < rect2.y + rect2.height &&
  //     rect1.y + rect1.height > rect2.y
  //   ) {
  //     document.getElementById('container_Tab').style.backgroundColor = 'white';
  //     document.getElementById('container_Tab').style.borderRadius = '5px 5px 0px 0px';
  //     document.getElementById('matCard').style.boxShadow = 'none';
  //     document.getElementById('matCard').style.borderRadius = '0px';
  //   } else {
  //     document.getElementById('container_Tab').style.backgroundColor = 'transparent';
  //     document.getElementById('matCard').style.boxShadow = '0px 2px 1px -1px rgba(0, 0, 0, 0.2),0px 1px 1px 0px rgba(0, 0, 0, 0.14),0px 1px 3px 0px rgba(0, 0, 0, 0.12)';
  //     document.getElementById('matCard').style.borderRadius = '4px';
  //   }
  // }
  moveNavigation(byX) {
    var navigation= document.getElementsByClassName("cus__tab")[0];
    navigation.scrollLeft= navigation.scrollLeft + byX;
  }

}

export interface ILivePortFolio{
  id: any
  rnt_id: number
  product_code: string
  plan_name: string
  option_name: string
  transaction_type: string
  transaction_subtype: string
  scheme_name: string
  isin_no: string
  folio_no: string
  inv_since?: any
  sensex: string
  nifty50: string
  inv_cost: string
  idcwr:number;
  pur_price: number
  pur_nav: any
  tot_units: string
  nav_date: string
  curr_nav: string
  idcw_reinv:string;
  idcwp:string
  curr_val: number
  gain_loss: number
  ret_abs: number
  xirr:number
  trans_mode: string
  data:Partial<ISubDataSource>[]
  mydata:any
  custom_trans_type:string | null
}

/** Use both for Details Transaction & row expand transactions */
export interface ISubDataSource{
  id: number;
  rnt_id: number;
  product_code: string;
  units: string;
  amount: string;
  stt: string;
  stamp_duty: string;
  tds: string;
  curr_nav: string;
  acc_no: string;
  bank_name: string;
  remarks: string;
  dividend_option: string;
  scheme_name: string;
  isin_no: string;
  folio_no: string;
  transaction_type: string;
  transaction_subtype: string;
  trans_no: number;
  trans_date: string;
  cat_name: string;
  subcat_name: string;
  amc_name: string;
  plan_name: string;
  option_name: string;
  gross_amount: string;
  tot_gross_amount: string;
  tot_amount: string;
  idcwr:string;
  tot_tds: string;
  tot_stamp_duty: string;
  pur_price: number;
  tot_units:string;
  cumml_units: number;
  sensex: string
  nifty50: number;
  curr_val:number;
  idcw_reinv:string;
  idcwp:string;
  gain_loss: number;
  days:number;
  ret_abs: number;
  ret_cagr: number;
  xirr:number;
  trans_mode: string;
}


export class LiveMFPortFolioColumn{

  public static column:column[] = [
    {
      field:'scheme_name',
      header:'Scheme',
      width:'230px',
      isVisible:true,
    },
    // {
    //   field:'isin_no',
    //   header:'ISIN',
    //   width:'100px'
    // },
    // {
    //   field:'folio_no',
    //   header:'Folio',
    //   width:'80px'
    // },
    {
      field:'inv_since',
      header:'Inv. Since',
      width:'52px',
      isVisible:true
    },
    {
      field:'sensex',
      header:'SENSEX',
      width:'51px',
      isVisible:true,
    },
    {
      field:'nifty50',
      header:'NIFTY50',
      width:'48px',
      isVisible:true,
    },
    {
      field:'inv_cost',
      header:'Inv. Cost',
      width:'70px',
      isVisible:true,
    },
    {
      field:'idcwr',
      header:'IDCWR',
      width:'50px',
      isVisible:true,
    },
    {
      field:'pur_nav',
      header:'Pur. NAV',
      width:'55px',
      isVisible:true,
    },
    {
      field:'tot_units',
      header:'Units',
      width:'50px',
      isVisible:true,
    },
    {
      field:'nav_date',
      header:'NAV Date',
      width:'47px',
      isVisible:true
    },
    {
      field:'curr_nav',
      header:'Curr.NAV',
      width:'55px',
      isVisible:true
    },
    {
      field:'curr_val',
      header:'Curr. Value',
      width:'70px',
      isVisible:true
    },
    {
      field:'idcw_reinv',
      header:'IDCW Reinv.',
      width:'53px',
      isVisible:true
    },
    {
      field:'idcwp',
      header:'IDCWP',
      width:'42px',
      isVisible:true
    },
    {
      field:'curr_val',
      header:'Total',
      width:'70px',
      isVisible:true
    },
    {
      field:'gain_loss',
      header:'Gain/Loss',
      width:'70px',
      isVisible:true
    },
    {
      field:'ret_abs',
      header:'Ret.ABS',
      width:'49px',
      isVisible:true
    },
    {
      field:'xirr',
      header:'XIRR',
      width:'50px',
      isVisible:true
    },
    {
      field:'trans_mode',
      header:'Tran. Mode',
      width:'40px',
      isVisible:true
    }
  ]

  public static sub_column:column[] = [
    {
      field:"sl_no",header:'Sl No',width:'18px',
    },
    {
      field:'transaction_type',header:'Trans Type',width:'55px'
    },
    {
      field:'trans_date',header:'Trans Date',width:"37px"
    },
    {
      field:'gross_amount',header:'Gross Amount',width:"45px"
    },
    {
      field:'tot_stamp_duty',header:'S. Duty',width:"26px"
    },
    {
      field:'tot_tds',header:'TDS',width:"25px"
    },
    {
      field:'tot_amount',header:'Net Amt',width:"42px"
    },
    {
      field:'idcwr',header:'IDCWR',width:"28px"
    },
    {
      field:'pur_price',header:'Pur. NAV',width:"42px"
    },
    {
      field:'tot_units',header:'Units',width:"43px"
    },
    {
      field:'cumml_units',header:'Cumml.Unit',width:"50px"
    },
    {
      field:'sensex',header:'SENSEX',width:"44px"
    },
    {
      field:'nifty50',header:'Nifty50',width:"37px"
    },
    {
      field:'curr_nav',header:'Curr.NAV',width:"50px"
    },
    {
      field:'curr_val',header:'Curr. Value',width:"45px"
    },
    {
      field:'idcw_reinv',header:'IDCW Reinv',width:"32px"
    },
    {
      field:'idcwp',header:'IDCWP',width:"28px"
    },
    {
      field:'gain_loss',header:'Gain/Loss',width:"42px"
    },
    {
      field:'days',header:'Days',width:"22px"
    },
    {
      field:'ret_abs',header:'Ret.ABS',width:"35px"
    },
    {
      field:'xirr',header:'XIRR',width:"35px"
    },
    {
      field:'trans_mode',header:'Trans. Mode',width:"32px"
    }
  ]

  public static details_column:column[] = [
    {field:'sl_no',header:'Sl No',width:"6rem"},
    {field:'scheme_name',header:'Scheme',width:"35rem"},
    {field:'isin_no',header:'ISIN',width:'10rem'},
    {field:'folio_no',header:'Folio',width:'11rem'},
    {field:'transaction_type',header:'Transaction type',width:'14rem'},
    {field:'transaction_subtype',header:'Transaction Sub Type',width:"14rem"},
    {field:'trans_no',header:'Transaction No',width:"11rem"},
    {field:'trans_date',header:'Transaction Date',width:"9rem"},
    {field:'sensex',header:'SENSEX',width:'8rem'},
    {field:'nifty50',header:'Nifty50',width:'8rem'},
    {field:'tot_gross_amount',header:'Gross Amount',width:"12rem"},
    {field:'tot_stamp_duty',header:'Stamp Duty',width:"8rem"},
    {field:'tot_tds',header:'TDS',width:"6rem"},
    {field:'tot_amount',header:'Net Amt',width:"12rem"},
    {field:'tot_units',header:'Unit',width:"12rem"},
    {field:'pur_price',header:'NAV',width:"8rem"},
    {field:'idcwr',header:'IDCWR',width:"8rem"},
    {field:'idcw_reinv',header:'IDCW Reinv',width:"8rem"},
    {field:'idcwp',header:'IDCWP',width:"8rem"},
    {field:'days',header:'Days',width:"8rem"},
    {field:'bank_name',header:'Bank',width:"16rem"},
    {field:'acc_no',header:'Account No',width:"15rem"},
    {field:'stt',header:'STT',width:"6rem"},
    {field:'trans_mode',header:'Transaction Mode',width:"12rem"},
    {field:'remarks',header:'Remarks',width:"16rem"},
  ]

}


