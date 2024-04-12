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
  ret_cagr:number | undefined
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
  styleUrls: ['./live-mf-port-folio.component.css']
})

export class LiveMfPortFolioComponent implements OnInit {


  __portfolioFiter = portfolioFilter;

  __live_sip_stp_swp_form = new FormGroup({
      live_sip:new FormControl(''),
      live_stp:new FormControl(''),
      live_swp:new FormControl('')
  })

  /*** Holding Tab details for liveMFPortfolio */
  __portFolioTab = portFolioTab;

  selected_id:number = 1;

  truncated_val : number = 10;

  __selectedRow:ILivePortFolio;

  __isDisplay__modal:boolean = false;

  subLiveMfPortFolio: Partial<TotalsubLiveMFPortFolio>;

  parentLiveMfPortFolio: Partial<TotalparentLiveMfPortFolio>;

  view_by = ClientType

  /** Holding client details in array format after search */
  __clientMst:client[] = [];

    /**
   * Setting of multiselect dropdown
   */
    settingsforFamilyMembers = this.utility.settingsfroMultiselectDropdown(
      'pan',
      'client_name',
      'Search Family members',
      2
    );

     /**
     * Setting of multiselect dropdown of `show_valuaton_with`,`Transaction_with`,`column_chooser`
     */
      settings = this.utility.settingsfroMultiselectDropdown(
        'id',
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

  filter_criteria = new FormGroup({
        valuation_as_on: new FormControl((new Date())),
        client_name: new FormControl(''),
        pan_no: new FormControl(''),
        view_type: new FormControl(''),
        family_members: new FormControl([]),
        trans_type:new FormControl('A'),
        view_funds_type: new FormControl('A'),
        view_mf_report:new FormControl(''),
        is_new_tab:new FormControl(false),
        show_valuation_with:new FormControl(this.__portfolioFiter?.val_with),
        trans_with:new FormControl(this.__portfolioFiter?.trans_with.filter(item => item.id ==1)),
        clmn_chooser: new FormControl([])
  })

  constructor(private __dbIntr:DbIntrService,
    private utility:UtiliService,
    private router:Router,
    private activateRoute:ActivatedRoute,
    private datePipe:DatePipe
    ) {


    }

  ngOnInit(): void {
    // console.log(this.__portFolioTab);
    if(this.activateRoute.snapshot.queryParams.id){
      let rt_prms = JSON.parse(this.utility.decrypt_dtls(atob(this.activateRoute.snapshot.queryParams.id)));
      try{
          this.filter_criteria.get('client_name').setValue(rt_prms ? rt_prms?.client_name : '' ,{emitEvent:false});
          this.filter_criteria.patchValue({
            valuation_as_on:rt_prms ? new Date(rt_prms?.valuation_as_on) : '',
            family_members: rt_prms ? rt_prms?.family_members : [],
            pan_no: rt_prms ? rt_prms?.pan_no : '',
            trans_type: rt_prms ? rt_prms?.trans_type : '',
            view_funds_type: rt_prms ? rt_prms?.view_funds_type : '',
            view_mf_report: rt_prms ? rt_prms?.view_mf_report : '',
            view_type: rt_prms ? rt_prms?.view_type : '',
          });
          this.showReport();
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


  ngAfterViewInit(){
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

  showReport = () =>{
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
    this.recent_trxn = []
    this.valuation_as_on = this.filter_criteria.value.valuation_as_on;
    const {family_members,...rest} = Object.assign({},{
      ...this.filter_criteria.value,
      valuation_as_on:global.getActualVal(this.datePipe.transform(new Date(this.filter_criteria.value.valuation_as_on),'YYYY-MM-dd')),
      family_members_pan:this.utility.mapIdfromArray(this.filter_criteria.value.family_members.filter(item => item.pan),'pan') ,
      family_members_name: this.utility.mapIdfromArray(this.filter_criteria.value.family_members.filter(item => !item.pan),'client_name'),
    })
    this.call_corrosponding_api(this.selected_id,rest)
    }
  }

  call_func_tab_change = () =>{
    if(this.__selectedRow){
      this.primeTbl.toggleRow(this.__selectedRow);
      this.__selectedRow = null
    }
    this.valuation_as_on = this.filter_criteria.value.valuation_as_on;
    const {family_members,...rest} = Object.assign({},{
      ...this.filter_criteria.value,
      valuation_as_on:global.getActualVal(this.datePipe.transform(new Date(this.filter_criteria.value.valuation_as_on),'YYYY-MM-dd')),
      family_members_pan:this.utility.mapIdfromArray(this.filter_criteria.value.family_members.filter(item => item.pan),'pan') ,
      family_members_name: this.utility.mapIdfromArray(this.filter_criteria.value.family_members.filter(item => !item.pan),'client_name'),
    })
    this.call_corrosponding_api(this.selected_id,rest)
  }


  onRowExpand = (ev:{originalEvent:Partial<PointerEvent>,data:ILivePortFolio}) =>{
    try{
    this.subLiveMfPortFolio = null;
    this.__selectedRow = ev?.data;
    this.truncated_val = 0;
    const index = this.dataSource.map(item => item.id).indexOf(ev?.data.id);
    this.dataSource[index].data.length = 0;
      this.__dbIntr.api_call(
        0,
        '/clients/liveMFShowDetails',
        `rnt_id=${ev.data.rnt_id}&product_code=${ev.data.product_code}&isin_no=${ev.data.isin_no}&folio_no=${ev.data.folio_no}&nav_date=${ev.data.nav_date}&valuation_as_on=${global.getActualVal(this.datePipe.transform(new Date(this.filter_criteria.value.valuation_as_on),'YYYY-MM-dd'))}`)
      .pipe(
        pluck('data'),
        // map((item:ISubDataSource[]) => {
        //   return item.filter(el => !el.transaction_type.toLowerCase().includes('rejection'))
        // }),
        )
      .subscribe((res: ISubDataSource[]) =>{
            // let redem_arr = res.filter((item:ISubDataSource) =>  item.transaction_type.toLowerCase().includes('redemption'));
            // let with_out_redem_arr = res.filter((item:ISubDataSource) =>  !item.transaction_type.toLowerCase().includes('redemption'))
            // if(this.filter_criteria.value.trans_type === 'A'){
            //   this.dataSource[index].data = res
            // }
            // else{
            //     this.calculateTransaction(redem_arr,with_out_redem_arr,index);
            // }
              this.dataSource[index].data = res;
              this.calculat_Total_Value_For_Table_Footer(res)
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
      this.calculat_Total_Value_For_Table_Footer(FinalTransactions);
      return FinalTransactions;
  }

  calculat_Total_Value_For_Table_Footer(arr:Partial<ISubDataSource>[]){
          var tot_arr = arr.filter(row => (!row.transaction_type.toLowerCase().includes('redemption') && row.cumml_units >= 0));
          try{
                  this.subLiveMfPortFolio = {
                    tot_amount: this.Total__Count(tot_arr,item => Number(item.tot_amount)),
                    tot_tds:this.Total__Count(tot_arr,item => item.tot_tds),
                    tot_stamp_duty:this.Total__Count(tot_arr,item => Number(item.tot_stamp_duty)),
                    pur_price:this.Total__Count(tot_arr,item => Number(item.pur_price)) / tot_arr.length,
                    tot_units:this.Total__Count(tot_arr,item => Number(item.tot_units)),
                    curr_val:this.Total__Count(tot_arr,item=> Number(item.curr_val)),
                    gain_loss:this.Total__Count(tot_arr,item=> Number(item.gain_loss)),
                    ret_abs: this.Total__Count(tot_arr,item=> Number(item.ret_abs)) / tot_arr.length,
                    cumml_units:tot_arr.length > 0 ? tot_arr.slice(-1)[0].cumml_units : 0,
                  }

                  console.log(this.subLiveMfPortFolio)

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
      `rnt_id=${liveMFPortFolio.rnt_id}&product_code=${liveMFPortFolio.product_code}&isin_no=${liveMFPortFolio.isin_no}&folio_no=${liveMFPortFolio.folio_no}`)
    .pipe(pluck('data'))
    .subscribe((res: ISubDataSource[]) =>{
      this.details__transaction_details = res;
    })
  }


  show_more = (mode:string,index:number) =>{
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
        case 2:

          this.call_api_for_detail_summary_func(fb)
          break; // call summary & details
        case 3: break;
        case 4: this.call_api_for_sip_func(fb);break; // call SIP
        case 5: this.call_api_for_stp_func(fb);break; // call STP
        case 6: this.call_api_for_swp_func(fb);break; // call SWP
        case 9: this.call_api_for_pL_func(fb); break; // call P&L
        case 11: this.call_api_for_recent_trxn_func(fb); break; // call P&L

        default: break;
      }
  }

  call_api_for_detail_summary_func(formData) {
    if(this.dataSource.length == 0){
      this.__dbIntr.api_call(1,'/clients/liveMFPortfolio',this.utility.convertFormData(formData))
      .pipe(pluck('data'))
      .subscribe((res:Required<{data,client_details:client}>) => {
            this.dataSource = res.data.map((item: ILivePortFolio) => (
              {
                ...item,
                id:`${Math.random()}_${item.product_code}`,
                inv_since:item.inv_since,
                pur_nav:item.pur_nav,
                data:[]
              }));
              // console.log( this.dataSource);
            this.clientDtls = res.client_details;
            this.parentLiveMfPortFolio = {
              inv_cost: this.Total__Count(this.dataSource,x => Number(x.inv_cost)),
              pur_nav:(this.Total__Count(this.dataSource,x => Number(x.pur_nav)) / this.dataSource.length),
              tot_units:this.Total__Count(this.dataSource,x => Number(x.tot_units)),
              curr_val:this.Total__Count(this.dataSource,x => Number(x.curr_val)),
              total:this.Total__Count(this.dataSource,x => x.curr_val),
              ret_abs: (this.Total__Count(this.dataSource,x => x.ret_abs) / this.dataSource.length),
              gain_loss:this.Total__Count(this.dataSource,x => x.gain_loss),
            }
      })
    }
    }

  /** call api for p&l */
  call_api_for_pL_func = (formData) =>{
    if(this.plTrxnDtls.length == 0){
      this.__dbIntr.api_call(0,'/pl',null)
      .pipe(pluck('data')).subscribe((result:Partial<IPLTrxn>[]) =>{
            this.plTrxnDtls = result
      })
   }
  }
  /*** End */

  /** call api for sip */
  call_api_for_sip_func = (formData) =>{
    if(this.liveSipPortFolio.length == 0){
      this.__dbIntr.api_call(0,'/liveSipPortfolio',null)
      .pipe(pluck('data')).subscribe((result:Partial<ILiveSIP>[]) =>{
            this.liveSipPortFolio = result
      })
   }
  }
  /** end */

   /** call api for stp */
   call_api_for_stp_func = (formData) =>{
    if(this.liveStpPortFolio.length == 0){
      this.__dbIntr.api_call(0,'/liveStpPortFolio',null)
      .pipe(pluck('data')).subscribe((result:Partial<ILiveSTP>[]) =>{
            this.liveStpPortFolio = result
      })
   }
  }
  /** end */

  /** call api for stp */
  call_api_for_swp_func = (formData) =>{
    if(this.liveSwpPortFolio.length == 0){
      this.__dbIntr.api_call(0,'/liveSwpPortFolio',null)
      .pipe(pluck('data')).subscribe((result:Partial<ILiveSWP>[]) =>{
            this.liveSwpPortFolio = result
      })
   }
  }
  /** end */

  /** call api for recent_trxn */
  call_api_for_recent_trxn_func = (formData) =>{
    if(this.recent_trxn.length == 0){
      this.__dbIntr.api_call(0,'/recentTrxn',null)
      .pipe(pluck('data')).subscribe((result:Partial<IRecentTrxn>[]) =>{
            this.recent_trxn = result
      })
   }
  }
  /** End */


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
  id: number
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
  idcwr:number;
  tot_tds: number;
  tot_stamp_duty: string;
  pur_price: number;
  tot_units:string;
  cumml_units: number;
  sensex: string
  nifty50: number;
  curr_val:number;
  idcw_reinv:number;
  idcwp:number;
  gain_loss: number;
  days:number;
  ret_abs: number;
  ret_cagr: number;
  ret_xirr:number;
  trans_mode: string;
}


export class LiveMFPortFolioColumn{

  public static column:column[] = [
    {
      field:'scheme_name',
      header:'Scheme',
      width:'300px'
    },
    {
      field:'isin_no',
      header:'ISIN',
      width:'100px'
    },
    {
      field:'folio_no',
      header:'Folio',
      width:'80px'
    },
    {
      field:'inv_since',
      header:'Inv. Since',
      width:'74px'
    },
    {
      field:'sensex',
      header:'SENSEX',
      width:'70px'
    },
    {
      field:'nifty50',
      header:'NIFTY50',
      width:'70px'
    },
    {
      field:'inv_cost',
      header:'Inv. Cost',
      width:'70px'
    },
    {
      field:'idcwr',
      header:'IDCWR',
      width:'70px'
    },
    {
      field:'pur_nav',
      header:'Pur. NAV',
      width:'50px'
    },
    {
      field:'tot_units',
      header:'Units',
      width:'50px'
    },
    {
      field:'nav_date',
      header:'NAV Date',
      width:'75px'
    },
    {
      field:'curr_nav',
      header:'Curr.NAV',
      width:'70px'
    },
    {
      field:'curr_val',
      header:'Curr. Value',
      width:'70px'
    },
    {
      field:'idcw_reinv',
      header:'IDCW Reinv.',
      width:'70px'
    },
    {
      field:'idcwp',
      header:'IDCWP',
      width:'70px'
    },
    {
      field:'curr_val',
      header:'Total',
      width:'70px'
    },
    {
      field:'gain_loss',
      header:'Gain/Loss',
      width:'70px'
    },
    {
      field:'ret_abs',
      header:'Ret.ABS',
      width:'55px'
    },
    {
      field:'xirr',
      header:'XIRR',
      width:'50px'
    },
    {
      field:'trans_mode',
      header:'Tran. Mode',
      width:'70px'
    }
  ]

  public static sub_column:column[] = [
    {
      field:"sl_no",header:'Sl No',width:'2rem',
    },
    {
      field:'transaction_type',header:'Trans Type',width:'6rem'
    },
    {
      field:'trans_date',header:'Trans Date',width:"4rem"
    },
    {
      field:'gross_amount',header:'Gross Amount',width:"5rem"
    },
    {
      field:'tot_stamp_duty',header:'S.Duty',width:"3rem"
    },
    {
      field:'tot_tds',header:'TDS',width:"3rem"
    },
    {
      field:'tot_amount',header:'Net Amt',width:"5rem"
    },
    {
      field:'idcwr',header:'IDCWR',width:"3rem"
    },
    {
      field:'pur_price',header:'Pur. NAV',width:"6rem"
    },
    {
      field:'tot_units',header:'Units',width:"3rem"
    },
    {
      field:'cumml_units',header:'Cumml.Unit',width:"5rem"
    },
    {
      field:'sensex',header:'SENSEX',width:"4rem"
    },
    {
      field:'nifty50',header:'Nifty50',width:"4rem"
    },
    {
      field:'curr_nav',header:'Curr.NAV',width:"4rem"
    },
    {
      field:'curr_val',header:'Curr. Value',width:"6rem"
    },
    {
      field:'idcw_reinv',header:'IDCW Reinv',width:"4rem"
    },
    {
      field:'idcwp',header:'IDCWP',width:"4rem"
    },
    {
      field:'gain_loss',header:'Gain/Loss',width:"5rem"
    },
    {
      field:'days',header:'Days',width:"3rem"
    },
    {
      field:'ret_abs',header:'Ret.ABS',width:"4rem"
    },
    {
      field:'ret_cagr',header:'Ret.Cagr',width:"4rem"
    },
    {
      field:'trans_mode',header:'Trans. Mode',width:"6rem"
    }
  ]

  public static details_column:column[] = [
    {field:'sl_no',header:'Sl No',width:"6rem"},
    {field:'scheme_name',header:'Scheme',width:"35rem"},
    {field:'isin_no',header:'ISIN',width:'10rem'},
    {field:'folio',header:'Folio',width:'11rem'},
    {field:'transaction_type',header:'Transaction type',width:'14rem'},
    {field:'transaction_subtype',header:'Transaction Sub Type',width:"14rem"},
    {field:'trans_no',header:'Transaction No',width:"11rem"},
    {field:'trans_date',header:'Transaction Date',width:"9rem"},
    {field:'sensex',header:'SENSEX',width:'8rem'},
    {field:'nifty50',header:'Nifty50',width:'8rem'},
    {field:'tot_gross_amount',header:'Gross Amount',width:"12rem"},
    {field:'stamp_duty',header:'Stamp Duty',width:"8rem"},
    {field:'tds',header:'TDS',width:"6rem"},
    {field:'tot_amount',header:'Net Amt',width:"12rem"},
    {field:'units',header:'Unit',width:"12rem"},
    {field:'nav',header:'NAV',width:"8rem"},
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


