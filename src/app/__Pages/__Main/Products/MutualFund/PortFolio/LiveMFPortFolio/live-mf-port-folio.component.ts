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
        view_mf_report:new FormControl('')
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
        // this.filter_criteria.get('is_all_client').reset(false, { emitEvent: false });
        // if(res != 'C'){
        //   this.filter_criteria.get('is_all_client').disable()
        // }
        // else{
        //     this.filter_criteria.get('is_all_client').enable()
        // }
        this.filter_criteria.get('client_name').reset('', { emitEvent: false });
        this.filter_criteria.get('pan_no').reset('');
        if (res) {
          this.filter_criteria.get('client_name').enable();
          this.paginate = 1;
          this.__clientMst = [];
          this.getClientMst(res, this.paginate);
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
        tap(() => (this.__isClientPending = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.searchItems('/searchClient',
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

    this.filter_criteria.get('client_name').reset(searchRlt.item.first_client_name, { emitEvent: false });
    this.filter_criteria.get('pan_no').reset(searchRlt.item.first_client_pan);
    // this.Rpt.get('client_id').reset(searchRlt.item.first_client_pan);
    this.__isClientPending = false;
    this.searchResultVisibilityForClient('none');
  };
  showReport = () =>{
    // console.log(this.filter_criteria.value)
    this.__dbIntr.api_call(1,'/clients/liveMFPortfolio',this.utility.convertFormData(this.filter_criteria.value))
    .pipe(pluck('data'))
    .subscribe((res:ILivePortFolio[]) => {
          this.dataSource = res;
    })
  }

}

export interface ILivePortFolio{
      scheme_name:string;
      isin_no:string;
      folio_no:string;
      inv_since:Date | string;
      sen_sex:string;
      nifty_50:string;
      inv_cost:number;
      idcwr:string;
      pur_nav:number;
      units:number;
      cur_nav:number;
      cur_value:number;
      idcwr_reinv:string;
      idcwp:string;
      gain_loss:number;
      ret_abs:number;
      ret_cagr:number;
      xirr:number;
      trans_mode:string;
      data:Partial<ISubDataSource>[]
}

export interface ISubDataSource{
      scheme_name:string;
      isin_no:string;
      folio_no:string;
      trans_type:string;
      trans_date:Date;
      sensex:number;
      nift_50:string;
      gross_amt:number;
      tds:number;
      stamp_duty:number;
      net_amt:number;
      idcwr:string;
      pur_nav:number;
      unit:number;
      cuml_unit:number;
      cur_nav:number;
      cur_value:number;
      idcw_reinv:string;
      idcwp:string;
      days:number;
      gain_loss:number;
      ret_abs:number;
      ret_cagr:number;
      xirr:number;
      trans_mode:string;
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
      field:'pur_nav',
      header:'PUR. NAV',
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
      field:'trans_type',header:'Transaction Type'
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
      field:'gross_amt',header:'Gross Amount'
    },
    {
      field:'gross_amt',header:'Gross Amount'
    },
    {
      field:'tds',header:'TDS'
    },
    {
      field:'stamp_duty',header:'Stamp Duty'
    },
    {
      field:'net_amt',header:'Net Amount'
    },
    {
      field:'idcwr',header:'IDCWR'
    },
    {
      field:'pur_nav',header:'Pur. NAV'
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
