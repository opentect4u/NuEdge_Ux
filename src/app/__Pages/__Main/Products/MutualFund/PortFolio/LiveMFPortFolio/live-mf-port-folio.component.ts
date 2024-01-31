import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import  ClientType  from '../../../../../../../assets/json/view_type.json';
import { client } from 'src/app/__Model/__clientMst';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-live-mf-port-folio',
  templateUrl: './live-mf-port-folio.component.html',
  styleUrls: ['./live-mf-port-folio.component.css']
})
export class LiveMfPortFolioComponent implements OnInit {

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


  /** Paginate : for holding how many result tobe fetched */
  paginate: number = 1;

  filter_criteria = new FormGroup({
        valuation_as_on: new FormControl((new Date()).toISOString().substring(0,10)),
        client_name: new FormControl(''),
        pan_no: new FormControl(''),
        view_type: new FormControl(''),
        family_members: new FormControl([]),
        trans_type:new FormControl('L'),
        view_funds_type: new FormControl('A'),
        view_mf_report:new FormControl(''),
  })

  constructor(private __dbIntr:DbIntrService,
    @Inject(DOCUMENT) private document: Document,
    private utility:UtiliService
    ) { }

  ngOnInit(): void {
    this.filter_criteria.get('client_name').disable();
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
          this.paginate = 1;
          this.__clientMst = [];
          // this.getClientMst(res, this.paginate);
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

  loadInvestorOnScrollToEnd = (ev) => {
    console.log(this.filter_criteria.value.client_name);
    if (this.filter_criteria.value.client_name == '') {
      // console.log('adasd')
      this.paginate += 1;
      this.getClientMst(this.filter_criteria.value.view_type, this.paginate);
    }
  }

   /**
   * Get Client Master Data
   */
   getClientMst = (view_type: string, paginate: number | undefined = 1) => {
    if (view_type) {
      this.__dbIntr.api_call(0,
        '/searchClient',
        'view_type=' + view_type
        + '&page=' + paginate
      ).pipe(pluck("data")).subscribe((res: any) => {
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
        console.log(res);
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
    if(this.filter_criteria.value.pan_no){
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
    const {family_members,...rest} = Object.assign({},{
      ...this.filter_criteria.value,
      family_members_pan:this.utility.mapIdfromArray(this.filter_criteria.value.family_members.filter(item => item.pan),'pan') ,
      family_members_name: this.utility.mapIdfromArray(this.filter_criteria.value.family_members.filter(item => !item.pan),'client_name'),
    })
    this.__dbIntr.api_call(1,'/clients/liveMFPortfolio',this.utility.convertFormData(rest))
    .pipe(pluck('data'))
    .subscribe((res:ILivePortFolio[]) => {
          this.dataSource = res.map((item: ILivePortFolio) => ({...item,data:[]}));;
    })
    ;
  }

  onRowExpand = (ev:{originalEvent:PointerEvent,data:ILivePortFolio}) =>{
      this.__dbIntr.api_call(
        0,
        '/clients/liveMFPortfolioDetails',
        `rnt_id=${ev.data.rnt_id}&product_code=${ev.data.product_code}&isin_no=${ev.data.isin_no}&folio_no=${ev.data.folio_no}`)
      .pipe(pluck('data'))
      .subscribe((res: ISubDataSource[]) =>{
        try{
          const index = this.dataSource.map(item => item.id).indexOf(ev.data.id);
          this.dataSource[index].data.length = 0;
          this.dataSource[index].data = res.filter((item:ISubDataSource) => !item.transaction_type.toLowerCase().includes('rejection'));

        }
        catch(ex){
            console.log(ex);
        }
      })
  }

}

export interface ILivePortFolio{
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
  pur_price: string;
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
  pur_price: string;
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
      width:'120px'
    },
    {
      field:'folio_no',
      header:'Folio',
      width:'120px'
    },
    {
      field:'inv',
      header:'Inv. Since',
      width:'120px'
    },
    {
      field:'sen_sex',
      header:'SENSEX',
      width:'120px'
    },
    {
      field:'nifty_fifty',
      header:'NIFTY50',
      width:'120px'
    },
    {
      field:'inv_cost',
      header:'Inv. Cost',
      width:'120px'
    },
    {
      field:'idcwr',
      header:'IDCWR',
      width:'200px'
    },
    {
      field:'pur_price',
      header:'Pur. NAV',
      width:'120px'
    },
    {
      field:'units',
      header:'Units',
      width:'120px'
    },
    {
      field:'curr_nav',
      header:'Curr. NAV',
      width:'120px'
    },
    {
      field:'curr_value',
      header:'Curr. Value',
      width:'120px'
    },
    {
      field:'idcw_reinv',
      header:'IDCW Reinv.',
      width:'200px'
    },
    {
      field:'idcwp',
      header:'IDCWP',
      width:'200px'
    },
    {
      field:'gain_loss',
      header:'Gain/Loss',
      width:'120px'
    },
    {
      field:'ret_abs',
      header:'Ret.ABS',
      width:'120px'
    },
    {
      field:'ret_abs',
      header:'Ret.ABS',
      width:'120px'
    },
    {
      field:'ret_cagr',
      header:'Ret.CAGR',
      width:'120px'
    },
    {
      field:'xirr',
      header:'XIRR',
      width:'120px'
    },
    {
      field:'tran_mode',
      header:'Tran. Mode',
      width:'120px'
    }
  ]

  public static sub_column:column[] = [
    {
      field:"sl_no",header:'Sl No'
    },
    {
      field:'scheme_name',header:'Scheme'
    },
    {
      field:'isin_no',header:'ISIN'
    },
    {
      field:'folio_no',header:'Folio'
    },
    {
      field:'transaction_type',header:'Transaction Type'
    },
    {
      field:'trans_date',header:'Transaction Date'
    },
    {
      field:'sensex',header:'SENSEX'
    },
    {
      field:'nifty_50',header:'NIFTY50'
    },
    {
      field:'tot_gross_amount',header:'Gross Amount'
    },
    {
      field:'tds',header:'TDS'
    },
    {
      field:'tot_stamp_duty',header:'Stamp Duty'
    },
    {
      field:'tot_amount',header:'Net Amount'
    },
    {
      field:'idcwr',header:'IDCWR'
    },
    {
      field:'pur_price',header:'Pur. NAV'
    },
    {
      field:'cuml_unit',header:'Cuml. Unit'
    },
    {
      field:'cur_nav',header:'Cur. NAV'
    },
    {
      field:'cur_value',header:'Cur. Value'
    },
    {
      field:'idcw_reinv',header:'IDCW Reinv.'
    },
    {
      field:'idcwp',header:'IDCWP'
    },
    {
      field:'days',header:'Days'
    },
    {
      field:'gain_loss',header:'Gain/Loss'
    },
    {
      field:'ret_abs',header:'Ret. ABS'
    },
    {
      field:'ret_cagr',header:'Ret. CAGR'
    },
    {
      field:'xirr',header:'XIRR'
    },
    {
      field:'trans_mode',header:'Tran. Mode'
    }
  ]


}
