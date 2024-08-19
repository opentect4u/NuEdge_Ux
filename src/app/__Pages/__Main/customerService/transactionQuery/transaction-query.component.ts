import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import clientType from '../../../../../assets/json/view_type.json';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { client } from 'src/app/__Model/__clientMst';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { column } from 'src/app/__Model/tblClmns';
import { trxnClm } from 'src/app/__Utility/TransactionRPT/trnsClm';
import { Table } from 'primeng/table';
import { global } from 'src/app/__Utility/globalFunc';
import { ILivePortFolio, ISubDataSource, LiveMFPortFolioColumn, TotalparentLiveMfPortFolio, TotalsubLiveMFPortFolio } from '../../Products/MutualFund/PortFolio/LiveMFPortFolio/live-mf-port-folio.component';
@Component({
  selector: 'app-transaction-query',
  templateUrl: './transaction-query.component.html',
  styleUrls: ['./transaction-query.component.css']
})
export class TransactionQueryComponent implements OnInit {

  trans_query_form = new FormGroup({
      view_type:new FormControl(''),
      client_name:new FormControl(''),
      pan_no:new FormControl(''),
      folio_no:new FormControl(''),
      family_members: new FormControl([])

  });

  @ViewChild('primeTbl') primeTbl :Table;

  subLiveMfPortFolio: Partial<TotalsubLiveMFPortFolio>;

  parentLiveMfPortFolio: Partial<TotalparentLiveMfPortFolio>;

  truncated_val : number = 10;


  transaction_query_dataSource = [];

   /**
   * Column For Parent Table
   */
   parent_column:column[] = [...LiveMFPortFolioColumn.column,{
    field:'action',
    header:'Action',
    width:'7rem'
   }];

  /**
   * Column For Sub Table
  */
  child_column:column[] = LiveMFPortFolioColumn.sub_column;

  /**
   * Hold column for transaction table
   */

  /**
   * Show / hide Loader Spinner while typing inside Client Details Input Field
   */
  __isClientPending: boolean = false;

  /**
  * Show / hide search list dropdown after serach input match
  */
  displayMode_forClient: string;

  /**
   * Holding Client Master Data after search
   */
  __clientMst: client[] = [];

  /**
   * Setting of multiselect dropdown
   */
  settingsforFamilyMembers = this.utility.settingsfroMultiselectDropdown(
    'pan',
    'client_name',
    'Search Family members',
    1
  );

  family_members:client[] = [];

  client_type= clientType;

  constructor(private dbIntr:DbIntrService,private utility:UtiliService,private datePipe:DatePipe) { }

  ngOnInit(): void {
    this.trans_query_form.get('client_name').disable();
  }

  ngAfterViewInit(){
    /** Investor Change */
    this.trans_query_form.controls['client_name'].valueChanges
    .pipe(
      tap(()=> this.trans_query_form.get('pan_no').setValue('')),
      tap(() => {
        this.__isClientPending = true
        if(this.family_members.length > 0){
          this.getFamilymemberAccordingToFamilyHead_Id();
        }
      }),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((dt) =>
        dt?.length > 1 ? this.dbIntr.searchItems('/searchWithClient',
        dt+'&view_type='+this.trans_query_form.value.view_type
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
    this.trans_query_form.controls['view_type'].valueChanges.subscribe(res =>{
      this.trans_query_form.get('client_name').reset('',{emitEvent:false});
      this.trans_query_form.get('pan_no').reset('');
      // this.trans_query_form.get('select_all_client').setValue(false,{emitEvent:false});
        if(res){
          // this.paginate = 1;
          this.__clientMst = [];
          this.trans_query_form.get('client_name').enable();
          // this.trans_query_form.get('select_all_client').enable();
          // this.getClientMst(res,this.paginate);
        }
        else{
          this.trans_query_form.get('client_name').disable();
          // this.trans_query_form.get('select_all_client').disable();
        }
  })
  /**End */
  }

  searchTrxnReport = () =>{
      // console.log(this.trans_query_form.value);
      // const pay_load = Object.assign({},{
      //   ...this.trans_query_form.value,
      //   report_type: 'S',
      //   valuation_as_on:this.datePipe.transform(new Date(),'YYYY-MM-dd'),
      //   trans_type:'L',
      //   view_funds_type:'A',
      //   family_members_pan:this.utility.mapIdfromArray(this.trans_query_form.value.family_members.filter(item => item.pan),'pan') ,
      //   family_members_name: this.utility.mapIdfromArray(this.trans_query_form.value.family_members.filter(item => !item.pan),'client_name'),
      // })
      // this.dbIntr.api_call(1,'/clients/liveMFPortfolio',this.utility.convertFormData(pay_load))
      // .pipe(
      //   pluck('data')
      // )
      // .subscribe((res:Required<{data,client_details:client[],disclaimer:string}>) => {
      //     console.log(res);
      // })


      this.dbIntr.api_call(1,'/clients/liveMFPortfolio',this.utility.convertFormData(this.trans_query_form.value))
      .pipe(
        pluck('data'),
        // map((x:any) =>{
        //     var valuation_with = this.filter_criteria.get('show_valuation_with').value.map(el => el.name.toLowerCase())
        //     this.setClientDtls(x.client_details);
        //     return this.mappedData(x,valuation_with)
        // })
      )
      .subscribe((res:Required<{data,client_details,disclaimer:string}>) => {
        console.log(res);
            // try{
            //     let modify_dt = [];
            //     modify_dt = res.data.filter((item: ILivePortFolio,index:number) => {
            //         item.id = `${Math.random()}_${item.product_code}`;
            //         item.data=[];
            //         if(item.mydata){
            //           const amt = item?.mydata.all_amt_arr.map(item => Number(item));
            //           const dt = item?.mydata.all_date_arr;
            //           const xirr = global.XIRR([...amt,item.curr_val],[...dt,item.nav_date],0)
            //           item.xirr = (item.curr_val == 0 && isFinite(xirr)) ? 0 : xirr
            //         }
            //         else{
            //           item.xirr =0;
            //         }
            //         item.custom_trans_type = item.transaction_type.toLowerCase().includes('sip') ? '(SIP)' : '';
            //         item.gain_loss = item.gain_loss;
            //         item.idcw_reinv = item.idcw_reinv;
            //         item.idcwp =item.idcwp;
            //         item.curr_val =item.curr_val;
            //         item.inv_cost =item.inv_cost;
            //         item.ret_abs =item.ret_abs;
            //         item.tot_units =item.tot_units;
            //         return true
                  
            //     });
            //     this.transaction_query_dataSource = modify_dt.filter((el,index) =>{
            //         let dt = [];
            //         dt = el.mydata.cal_purchase_data;
            //         el.data = dt.filter((item:ISubDataSource,i:number) =>{
            //           try{
            //             if(item.cumml_units > 0 && !item.transaction_type.toLowerCase().includes('redemption')){
            //                   const amt = [(Number(item.tot_amount) * -1),Number(item.curr_val)]
            //                   const dates = [item.trans_date,el.nav_date]
            //                   const xirr = global.XIRR(amt,dates,0);
            //                   item.xirr = isFinite(xirr) ? xirr : 0;
            //             }
            //           }
            //           catch(err){
            //               item.xirr = 0;
            //           }
            //           return item;
            //         });
            //         return el
            //     })
            //     this.setParentTableFooter_ClientDtls(modify_dt);
            //   }
            // catch(ex){}
      })
  } 

  setParentTableFooter_ClientDtls = (dt) =>{
      console.log(dt);
  }

  /**
   *  evnt trigger on search particular client & after select client
   * @param display_mode
   */
  searchResultVisibilityForClient = (display_mode: string) => {
    // console.log(display_mode);
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
    this.trans_query_form.get('client_name').reset(searchRlt.item.client_name, { emitEvent: false });
    this.trans_query_form.get('pan_no').reset(searchRlt.item.pan);
    this.searchResultVisibilityForClient('none');
    if(this.trans_query_form.value.view_type == 'F'){
      this.getFamilymemberAccordingToFamilyHead_Id(searchRlt.item.client_id)
    }
  };

  /**
   *
   */
  getFamilymemberAccordingToFamilyHead_Id = (id:number | undefined = undefined) =>{
    if(id){
      this.dbIntr.api_call(0,'/clientFamilyDetail',`family_head_id=${id}&view_type=${this.trans_query_form.value.view_type}`)
      .pipe(pluck('data'))
      .subscribe((res:client[]) =>{
       console.log(res);
       this.family_members = res;
       this.trans_query_form.get('family_members').setValue(res.map((item:client) => ({pan:item.pan,client_name:item.client_name})))
      })
   }
   else{
       this.family_members = [];
       this.trans_query_form.get('family_members').setValue([]);

   }
 }

 onRowExpand = (ev) =>{
    console.log(ev)
 }

 loadInvestorOnScrollToEnd = (ev) =>{
  // if(this.misTrxnRpt.value.client_name == ''){
  //   this.paginate+=1;
  // this.getClientMst(this.misTrxnRpt.value.view_type,this.paginate);
  // }
 }

 getColumnsForDetails = () =>{
  return [...this.utility.getColumns(this.parent_column),'isin_no','folio_no','custom_trans_type'];
}


filterGlobal = ($event) => {
  let value = $event.target.value;
  this.primeTbl.filterGlobal(value,'contains')
}

}

