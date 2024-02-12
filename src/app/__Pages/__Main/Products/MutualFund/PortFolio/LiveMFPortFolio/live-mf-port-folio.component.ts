import { Component, OnInit, ViewChild } from '@angular/core';
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
@Component({
  selector: 'app-live-mf-port-folio',
  templateUrl: './live-mf-port-folio.component.html',
  styleUrls: ['./live-mf-port-folio.component.css']
})
export class LiveMfPortFolioComponent implements OnInit {


  truncated_val : number = 10;

  __isDisplay__modal:boolean = false;

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
      3
    );

    /**
     * Holding Client Details & display in middle card
     */
    clientDtls:Partial<client>;

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

  valuation_as_on:string;

  details__transaction_details:ISubDataSource[] = [];

  detailedColumn:column[] = LiveMFPortFolioColumn.details_column;

  datePipe:DatePipe;

  filter_criteria = new FormGroup({
        valuation_as_on: new FormControl((new Date())),
        client_name: new FormControl(''),
        pan_no: new FormControl(''),
        view_type: new FormControl(''),
        family_members: new FormControl([]),
        trans_type:new FormControl('L'),
        view_funds_type: new FormControl('A'),
        view_mf_report:new FormControl(''),
        is_new_tab:new FormControl(false)
  })

  constructor(private __dbIntr:DbIntrService,
    private utility:UtiliService,
    private router:Router,
    private activateRoute:ActivatedRoute
    ) { }

  ngOnInit(): void {
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
        console.log(`ERROR`)
      }
    }
    else{
      this.filter_criteria.get('client_name').disable();
    }

  }

  ngAfterViewInit(){


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
            this.getFamilyMembers(searchRlt.item.id)
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
    this.dataSource = [];
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
    this.dataSource = [];
    this.valuation_as_on = this.filter_criteria.value.valuation_as_on;
    const {family_members,...rest} = Object.assign({},{
      ...this.filter_criteria.value,
      valuation_as_on:this.filter_criteria.value.valuation_as_on?.toISOString().substring(0,10),
      family_members_pan:this.utility.mapIdfromArray(this.filter_criteria.value.family_members.filter(item => item.pan),'pan') ,
      family_members_name: this.utility.mapIdfromArray(this.filter_criteria.value.family_members.filter(item => !item.pan),'client_name'),
    })
    this.__dbIntr.api_call(1,'/clients/liveMFPortfolio',this.utility.convertFormData(rest))
    .pipe(pluck('data'))
    .subscribe((res:Required<{data,client_details:client}>) => {
          this.dataSource = res.data.map((item: ILivePortFolio) => ({...item,inv_since:item.inv_since?.trans_date,pur_nav:item.pur_nav?.pur_price,data:[]}));
          this.clientDtls = res.client_details;
     })
    ;
    }
  }

  onRowExpand = (ev:{originalEvent:Partial<PointerEvent>,data:ILivePortFolio}) =>{
    try{
    this.truncated_val = 0;
    const index = this.dataSource.map(item => item.id).indexOf(ev.data.id);
    this.dataSource[index].data.length = 0;
      this.__dbIntr.api_call(
        0,
        '/clients/liveMFShowDetails',
        `rnt_id=${ev.data.rnt_id}&product_code=${ev.data.product_code}&isin_no=${ev.data.isin_no}&folio_no=${ev.data.folio_no}`)
      .pipe(
        pluck('data'),
        tap((item:ISubDataSource[]) => {

          return item.filter(el => !el.transaction_type.toLowerCase().includes('rejection'))

        }),
        )
      .subscribe((res: ISubDataSource[]) =>{
          // this.dataSource[index].data = res.filter((item:ISubDataSource) => !item.transaction_type.toLowerCase().includes('rejection'));
          // this.show_more('M',index);
            console.log(res)
            let redem_arr = res.filter((item:ISubDataSource) =>  item.transaction_type.toLowerCase().includes('redemption'))
            let with_out_redem_arr = res.filter((item:ISubDataSource) =>  !item.transaction_type.toLowerCase().includes('redemption'))
            redem_arr.forEach((el,i) =>{
              let pur_price = el.pur_price;
              const ___index = res.findIndex((trnx:ISubDataSource) => trnx.id == el.id);
              console.log(___index);
              with_out_redem_arr = with_out_redem_arr.filter((item,j) => {
                            if(___index > j && item.pur_price > 0){
                              console.log(___index);
                              console.log(item.pur_price);
                                pur_price  = item.pur_price - Math.abs(pur_price);
                               if(pur_price < 0){
                                  item.pur_price = pur_price
                                }
                            }
                            return item
              });
            });
            console.log(with_out_redem_arr.filter(item => item.pur_price > 0))
            this.dataSource[index].data = with_out_redem_arr.length > 0 ?  with_out_redem_arr.filter(item => item.pur_price > 0) : with_out_redem_arr;
            this.show_more('M',index);
        })
      }
    catch(ex){
        // console.log(ex);
        console.log(`ERROR`)
    }
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

  OpenDialog = (liveMFPortFolio) => {
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
              }
  }

  setTrancated_val = (length_of_actual_array:number) => {
    this.truncated_val = length_of_actual_array
  }

}

export interface ILivePortFolio{
  id: number
  mailback_process_id: number
  rnt_id: number
  arn_no: string
  sub_brk_cd: string
  euin_no: string
  old_euin_no: any
  first_client_name: string
  first_client_pan: string
  amc_code: string
  folio_no: string
  product_code: string
  trans_no: number
  trans_mode: string
  trans_status: string
  user_trans_no: number
  trans_date: string
  post_date: string
  pur_price: number
  units: string
  amount: string
  rec_date: string
  trxn_type: string
  trxn_type_flag: string
  trxn_nature: string
  trans_desc: any
  kf_trans_type: any
  trans_flag: any
  te_15h: string
  micr_code: string
  sw_flag: string
  old_folio: string
  seq_no: string
  stt: string
  stamp_duty: string
  tds: any
  acc_no: string
  bank_name: string
  remarks: string
  reinvest_flag: string
  dividend_option: any
  isin_no: string
  bu_type_flag: string
  bu_type_lock_flag: string
  amc_flag: string
  scheme_flag: string
  plan_option_flag: string
  divi_mismatch_flag: string
  divi_lock_flag: string
  delete_flag: string
  deleted_at: any
  deleted_date: any
  created_at: string
  updated_at: string
  scheme_name: string
  cat_name: string
  subcat_name: string
  amc_name: string
  plan_name: string
  option_name: string
  nifty50: string
  sensex: string
  curr_nav: string
  tot_units: string
  inv_cost: string
  tot_stamp_duty: string
  tot_tds: any
  tot_rows: number
  gross_amount: string
  tot_gross_amount: string
  transaction_type: string
  transaction_subtype: string
  inv_since: any
  pur_nav: any
  nav_date: string
  curr_val: number
  gain_loss: number
  ret_abs: number
  data:Partial<ISubDataSource>[]
}

export interface ISubDataSource{
  id: number;
  mailback_process_id: number;
  rnt_id: number;
  arn_no: string;
  sub_brk_cd: string;
  euin_no: string;
  old_euin_no?: any;
  first_client_name: string;
  first_client_pan: string;
  amc_code: string;
  folio_no: string;
  product_code: string;
  trans_no: number;
  trans_mode: string;
  trans_status: string;
  user_trans_no: number;
  trans_date: string;
  post_date: string;
  pur_price: number;
  units: string;
  amount: string;
  rec_date: string;
  trxn_type?: any;
  trxn_type_flag?: any;
  trxn_nature?: any;
  trans_desc: string;
  kf_trans_type: string;
  trans_flag: string;
  te_15h?: any;
  micr_code?: any;
  sw_flag?: any;
  old_folio?: any;
  seq_no?: any;
  stt: string;
  stamp_duty: string;
  tds: string;
  acc_no: string;
  bank_name: string;
  remarks: string;
  reinvest_flag?: any;
  dividend_option: string;
  isin_no: string;
  bu_type_flag: string;
  bu_type_lock_flag: string;
  amc_flag: string;
  scheme_flag: string;
  plan_option_flag: string;
  divi_mismatch_flag: string;
  divi_lock_flag: string;
  delete_flag: string;
  deleted_at?: any;
  deleted_date?: any;
  created_at: string;
  updated_at: string;
  scheme_name: string;
  cat_name: string;
  subcat_name: string;
  amc_name: string;
  plan_name: string;
  option_name: string;
  rm_name: string;
  branch: string;
  bu_type_id: string;
  branch_id: number;
  tot_amount: string;
  tot_stamp_duty: string;
  tot_tds: number;
  tot_rows: number;
  bu_type: string;
  gross_amount: string;
  tot_gross_amount: string;
  transaction_type: string;
  transaction_subtype: string;
  idcwp:string;
  idcw_reinv:string;
  idcwr:string;
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
      width:'70px'
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
      field:'pur_price',
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
      width:'70px'
    },
    {
      field:'curr_nav',
      header:'Curr. NAV',
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
      width:'50px'
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
      field:'amount',header:'Amount',width:"5rem"
    },
    {
      field:'tds',header:'TDS',width:"3rem"
    },
    {
      field:'stamp_duty',header:'S. Duty',width:"3rem"
    },
    {
      field:'idcwr',header:'IDCWR',width:"3rem"
    },
    {
      field:'pur_price',header:'Pur. NAV',width:"4rem"
    },
    {
      field:'cumml_unit',header:'Cumml. Unit',width:"4rem"
    },
    {
      field:'sensex',header:'SENSEX',width:"4rem"
    },
    {
      field:'nifty50',header:'Nifty50',width:"4rem"
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
      field:'ret_cagr',header:'Ret. CAGR',width:"4rem"
    },
    {
      field:'trans_mode',header:'Tran. Mode',width:"6rem"
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
    {field:'tot_amount',header:'Net Amount',width:"12rem"},
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
